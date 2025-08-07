from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from ....core.database import get_db
from ....models.user import User
from ....models.follow import Follow
from ....models.notification import Notification
from ....core.websocket_manager import notification_manager
# from ....core.rate_limiter import rate_limit
from ..auth.routes import get_current_user

router = APIRouter()

@router.post("/follow/{user_id}")
async def follow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    # Check if already following
    existing = db.query(Follow).filter(
        and_(Follow.follower_id == current_user.id, Follow.following_id == user_id)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already following")
    
    # Create follow relationship
    follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.add(follow)
    
    # Create notification
    notification = Notification(
        user_id=user_id,
        type="follow",
        message=f"{current_user.username} started following you",
        related_user_id=current_user.id
    )
    db.add(notification)
    db.commit()
    
    # Send real-time notification
    await notification_manager.send_notification(user_id, {
        "type": "follow",
        "message": f"{current_user.username} started following you",
        "user": current_user.username
    })
    
    return {"message": "Following user"}

@router.delete("/follow/{user_id}")
def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    follow = db.query(Follow).filter(
        and_(Follow.follower_id == current_user.id, Follow.following_id == user_id)
    ).first()
    
    if not follow:
        raise HTTPException(status_code=400, detail="Not following user")
    
    db.delete(follow)
    db.commit()
    
    return {"message": "Unfollowed user"}

@router.get("/followers/{user_id}")
def get_followers(user_id: int, db: Session = Depends(get_db)):
    followers = db.query(Follow).filter(Follow.following_id == user_id).all()
    result = []
    for f in followers:
        follower_count = db.query(Follow).filter(Follow.following_id == f.follower_id).count()
        result.append({
            "id": f.follower_id,
            "username": f.follower.username,
            "full_name": f.follower.full_name,
            "followers_count": follower_count,
            "is_following": False
        })
    return result

@router.get("/following/{user_id}")
def get_following(user_id: int, db: Session = Depends(get_db)):
    following = db.query(Follow).filter(Follow.follower_id == user_id).all()
    result = []
    for f in following:
        follower_count = db.query(Follow).filter(Follow.following_id == f.following_id).count()
        result.append({
            "id": f.following_id,
            "username": f.following.username,
            "full_name": f.following.full_name,
            "followers_count": follower_count,
            "is_following": True
        })
    return result

@router.get("/stats/{user_id}")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    
    return {
        "followers": followers_count,
        "following": following_count
    }