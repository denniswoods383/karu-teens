from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from ....core.database import get_db
from ....models.user import User
from ....models.post import Post
from ....models.hashtag import Hashtag
# from ....core.rate_limiter import rate_limit
from pydantic import BaseModel
from ..auth.routes import get_current_user

router = APIRouter()

class SearchResult(BaseModel):
    type: str
    id: int
    title: str
    content: str
    username: Optional[str] = None

@router.get("/")
def search(
    q: str = Query(..., min_length=2),
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    results = []
    
    if not type or type == "users":
        # Search users
        users = db.query(User).filter(
            or_(
                User.username.ilike(f"%{q}%"),
                User.full_name.ilike(f"%{q}%")
            )
        ).limit(10).all()
        
        for user in users:
            results.append({
                "type": "user",
                "id": user.id,
                "title": user.full_name or user.username,
                "content": f"@{user.username}",
                "username": user.username
            })
    
    if not type or type == "posts":
        # Search posts
        posts = db.query(Post).filter(
            Post.content.ilike(f"%{q}%")
        ).order_by(Post.created_at.desc()).limit(10).all()
        
        for post in posts:
            results.append({
                "type": "post",
                "id": post.id,
                "title": f"Post by {post.author.username}",
                "content": post.content[:100] + "..." if len(post.content) > 100 else post.content,
                "username": post.author.username
            })
    
    if not type or type == "hashtags":
        # Search hashtags
        hashtags = db.query(Hashtag).filter(
            Hashtag.name.ilike(f"%{q}%")
        ).limit(10).all()
        
        for hashtag in hashtags:
            results.append({
                "type": "hashtag",
                "id": hashtag.id,
                "title": f"#{hashtag.name}",
                "content": f"{hashtag.usage_count} posts"
            })
    
    return results

@router.get("/trending")
def get_trending(db: Session = Depends(get_db)):
    try:
        # Get top hashtags by usage
        trending = db.query(Hashtag).order_by(Hashtag.usage_count.desc()).limit(10).all()
        return [{"name": tag.name, "count": tag.usage_count} for tag in trending]
    except Exception as e:
        return []

@router.get("/suggestions")
def get_user_suggestions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from ....models.follow import Follow
    
    # Get users that current user is NOT following
    following_ids = db.query(Follow.following_id).filter(Follow.follower_id == current_user.id).subquery()
    
    users = db.query(User).filter(
        User.id != current_user.id,
        ~User.id.in_(following_ids)
    ).order_by(func.random()).limit(10).all()
    
    result = []
    for user in users:
        follower_count = db.query(Follow).filter(Follow.following_id == user.id).count()
        
        result.append({
            "id": user.id, 
            "username": user.username, 
            "full_name": user.full_name,
            "is_following": False,
            "followers_count": follower_count
        })
    
    return result