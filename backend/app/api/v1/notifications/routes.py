from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ....core.database import get_db
from ....models.notification import Notification
from ....models.user import User
from ..auth.routes import get_current_user

router = APIRouter()

@router.get("/")
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(20).all()
    return notifications

@router.put("/{notification_id}/read")
def mark_read(notification_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if notification:
        notification.is_read = True
        db.commit()
    return {"message": "Marked as read"}