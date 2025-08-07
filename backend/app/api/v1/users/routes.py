from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ....core.database import get_db
from ....models.user import User
from ....models.post import Post
from ....models.follow import Follow
from ..auth.routes import get_current_user

router = APIRouter()

@router.get("/")
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).all()
    return [{
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name
    } for user in users]

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    print(f"GET user {user_id} - profile_photo from DB: {getattr(user, 'profile_photo', 'MISSING')}")
    
    posts_count = db.query(Post).filter(Post.author_id == user_id).count()
    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    
    profile_photo = getattr(user, 'profile_photo', None)
    print(f"Profile photo value being returned: {profile_photo}")
    
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "bio": getattr(user, 'bio', None),
        "profile_photo": profile_photo,
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count
    }

@router.put("/{user_id}")
def update_user_profile(
    user_id: int, 
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    print(f"Updating user {user_id} with data: {profile_data}")
    
    if 'full_name' in profile_data:
        user.full_name = profile_data['full_name']
        print(f"Updated full_name to: {profile_data['full_name']}")
    if 'bio' in profile_data:
        user.bio = profile_data['bio']
        print(f"Updated bio to: {profile_data['bio']}")
    if 'profile_photo' in profile_data:
        user.profile_photo = profile_data['profile_photo']
        print(f"Updated profile_photo to: {profile_data['profile_photo']}")
        
        # Also try direct SQL update as backup
        db.execute(
            text("UPDATE users SET profile_photo = :photo WHERE id = :user_id"),
            {"photo": profile_data['profile_photo'], "user_id": user_id}
        )
        print(f"Direct SQL update executed")
    
    try:
        db.commit()
        db.refresh(user)
        print(f"User after commit and refresh - profile_photo: {user.profile_photo}")
        return {"message": "Profile updated successfully"}
    except Exception as e:
        print(f"Error committing changes: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.get("/{user_id}/badges")
def get_user_badges(user_id: int, db: Session = Depends(get_db)):
    from ....services.badge_service import BadgeService
    badge_service = BadgeService(db)
    return badge_service.get_user_badges(user_id)