from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from ....core.database import get_db
from ....models.user import User
from ....models.story import Story
from ..auth.routes import get_current_user
from pydantic import BaseModel
from typing import Optional
# from ....core.rate_limiter import rate_limit

router = APIRouter()

class StoryCreate(BaseModel):
    content: Optional[str] = None
    image_url: Optional[str] = None

@router.post("/create")
def create_story(
    story_data: StoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    story = Story(
        user_id=current_user.id,
        content=story_data.content,
        image_url=story_data.image_url,
        expires_at=expires_at
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    
    return {"message": "Story created", "story_id": story.id}

@router.get("/active")
def get_active_stories(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    stories = db.query(Story).filter(
        and_(Story.is_active == True, Story.expires_at > now)
    ).order_by(Story.created_at.desc()).all()
    
    # Group by user
    user_stories = {}
    for story in stories:
        if story.user_id not in user_stories:
            user_stories[story.user_id] = []
        user_stories[story.user_id].append(story)
    
    return user_stories

@router.get("/user/{user_id}")
def get_user_stories(
    user_id: int,
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    stories = db.query(Story).filter(
        and_(
            Story.user_id == user_id,
            Story.is_active == True,
            Story.expires_at > now
        )
    ).order_by(Story.created_at).all()
    
    return stories

@router.delete("/{story_id}")
def delete_story(
    story_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    story = db.query(Story).filter(
        and_(Story.id == story_id, Story.user_id == current_user.id)
    ).first()
    
    if story:
        story.is_active = False
        db.commit()
        return {"message": "Story deleted"}
    
    return {"error": "Story not found"}