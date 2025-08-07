from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....models.user import User
from ....models.post import Post
from ....models.follow import Follow
from ..auth.routes import get_current_user

router = APIRouter()

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts_count = db.query(Post).filter(Post.author_id == current_user.id).count()
    followers_count = db.query(Follow).filter(Follow.following_id == current_user.id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == current_user.id).count()
    
    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "profile_photo": getattr(current_user, 'profile_photo', None),
        "background_image": getattr(current_user, 'background_image', None),
        "bio": getattr(current_user, 'bio', ''),
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count
    }

@router.put("/me")
def update_my_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user fields
    if 'full_name' in profile_data:
        current_user.full_name = profile_data['full_name']
    if 'bio' in profile_data:
        current_user.bio = profile_data['bio']
    if 'profile_photo' in profile_data:
        current_user.profile_photo = profile_data['profile_photo']
    if 'background_image' in profile_data:
        current_user.background_image = profile_data['background_image']
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    posts_count = db.query(Post).filter(Post.author_id == user_id).count()
    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "profile_photo": getattr(user, 'profile_photo', None),
        "background_image": getattr(user, 'background_image', None),
        "bio": getattr(user, 'bio', ''),
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count
    }

@router.get("/{user_id}")
def get_user_profile_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    posts_count = db.query(Post).filter(Post.author_id == user_id).count()
    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "profile_photo": getattr(user, 'profile_photo', None),
        "background_image": getattr(user, 'background_image', None),
        "bio": getattr(user, 'bio', ''),
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count
    }