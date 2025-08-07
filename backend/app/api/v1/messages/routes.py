from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from ....core.database import get_db
from ....models.user import User
from ....models.message import Message
from ....core.websocket_manager import notification_manager
# from ....core.rate_limiter import rate_limit
from ..auth.routes import get_current_user
from pydantic import BaseModel

router = APIRouter()

class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    created_at: str
    sender_username: str

    class Config:
        from_attributes = True

@router.post("/send")
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if receiver exists
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        content=message_data.content,
        is_delivered=True  # Mark as delivered immediately when sent
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # Send real-time notification
    from ..websocket.chat import manager
    message_data = {
        "id": message.id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "content": message.content,
        "is_delivered": message.is_delivered,
        "is_read": message.is_read,
        "created_at": message.created_at.isoformat(),
        "sender_username": current_user.username
    }
    
    await manager.send_message_notification(current_user.id, message_data["receiver_id"], message_data)
    
    return {
        "message": "Message sent successfully",
        "id": message.id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "content": message.content,
        "created_at": message.created_at.isoformat()
    }

@router.get("/conversations")
def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get unique conversation partners
    conversations = db.query(Message).filter(
        or_(Message.sender_id == current_user.id, Message.receiver_id == current_user.id)
    ).all()
    
    partners = set()
    for msg in conversations:
        if msg.sender_id != current_user.id:
            partners.add(msg.sender_id)
        if msg.receiver_id != current_user.id:
            partners.add(msg.receiver_id)
    
    # Get partner details with unread counts
    users = db.query(User).filter(User.id.in_(partners)).all()
    result = []
    
    for user in users:
        # Count unread messages from this user
        unread_count = db.query(Message).filter(
            Message.sender_id == user.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False
        ).count()
        
        # Get last message
        last_message = db.query(Message).filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.receiver_id == user.id),
                and_(Message.sender_id == user.id, Message.receiver_id == current_user.id)
            )
        ).order_by(Message.created_at.desc()).first()
        
        result.append({
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "unread_count": unread_count,
            "last_message": last_message.content if last_message else None
        })
    
    return result

@router.get("/chat/{user_id}")
def get_chat_messages(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at).all()
    
    # Mark messages as delivered and read
    db.query(Message).filter(
        Message.sender_id == user_id,
        Message.receiver_id == current_user.id,
        Message.is_delivered == False
    ).update({"is_delivered": True})
    
    # Get unread messages before marking as read
    unread_messages = db.query(Message).filter(
        Message.sender_id == user_id,
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).all()
    
    # Mark as read
    db.query(Message).filter(
        Message.sender_id == user_id,
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()
    
    # Send read receipts via WebSocket
    from ..websocket.chat import manager
    import asyncio
    for msg in unread_messages:
        asyncio.create_task(manager.send_read_receipt(current_user.id, user_id, msg.id))
    
    result = []
    for msg in messages:
        result.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "content": msg.content,
            "is_delivered": msg.is_delivered,
            "is_read": msg.is_read,
            "created_at": msg.created_at.isoformat()
        })
    
    return result