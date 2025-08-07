from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.user import User
from ....models.report import Report, ReportType
from ....models.comment_reply import CommentReply
from ....models.post import Comment
# from ....core.rate_limiter import rate_limit
from ..auth.routes import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ReportCreate(BaseModel):
    reported_user_id: Optional[int] = None
    reported_post_id: Optional[int] = None
    type: ReportType
    reason: Optional[str] = None

class CommentReplyCreate(BaseModel):
    content: str

@router.post("/report")
def create_report(
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = Report(
        reporter_id=current_user.id,
        reported_user_id=report_data.reported_user_id,
        reported_post_id=report_data.reported_post_id,
        type=report_data.type,
        reason=report_data.reason
    )
    db.add(report)
    db.commit()
    
    return {"message": "Report submitted"}

@router.post("/comments/{comment_id}/reply")
def reply_to_comment(
    comment_id: int,
    reply_data: CommentReplyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    reply = CommentReply(
        comment_id=comment_id,
        author_id=current_user.id,
        content=reply_data.content
    )
    db.add(reply)
    db.commit()
    db.refresh(reply)
    
    return {"message": "Reply added", "reply_id": reply.id}

@router.get("/comments/{comment_id}/replies")
def get_comment_replies(comment_id: int, db: Session = Depends(get_db)):
    replies = db.query(CommentReply).filter(CommentReply.comment_id == comment_id).all()
    return [
        {
            "id": reply.id,
            "content": reply.content,
            "author_id": reply.author_id,
            "created_at": reply.created_at
        }
        for reply in replies
    ]

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.author_id == current_user.id
    ).first()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    db.delete(comment)
    db.commit()
    
    return {"message": "Comment deleted"}