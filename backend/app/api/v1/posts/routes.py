from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from ....core.database import get_db
from ....models.post import Post, Comment
from ....models.like import Like
from ....models.user import User
from ....models.like import Like
from ....models.notification import Notification
from ....core.websocket_manager import notification_manager
from ....core.redis_client import redis_client
# from ....core.rate_limiter import rate_limit
from ....schemas.post import PostCreate, PostResponse, CommentCreate, CommentResponse
from ..auth.routes import get_current_user

router = APIRouter()

@router.post("/", response_model=PostResponse)
def create_post(post_data: PostCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_post = Post(
        content=post_data.content,
        image_url=post_data.image_url,
        author_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return PostResponse.from_orm(db_post)

@router.get("/", response_model=List[PostResponse])
def get_posts(skip: int = 0, limit: int = 20, user_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Post).filter(Post.is_active == True)
    if user_id:
        query = query.filter(Post.author_id == user_id)
    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    # Calculate counts for each post
    post_data = []
    for post in posts:
        likes_count = db.query(Like).filter(Like.post_id == post.id).count()
        comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        
        post_dict = {
            "id": post.id,
            "content": post.content,
            "image_url": post.image_url,
            "author_id": post.author_id,
            "author": post.author,
            "likes_count": likes_count,
            "comments_count": comments_count,
            "created_at": post.created_at
        }
        post_data.append(post_dict)
    
    return post_data

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id, Post.is_active == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Calculate counts
    likes_count = db.query(Like).filter(Like.post_id == post.id).count()
    comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    
    return {
        "id": post.id,
        "content": post.content,
        "image_url": post.image_url,
        "author_id": post.author_id,
        "author": post.author,
        "likes_count": likes_count,
        "comments_count": comments_count,
        "created_at": post.created_at
    }

@router.post("/{post_id}/comments", response_model=CommentResponse)
def create_comment(post_id: int, comment_data: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_comment = Comment(
        content=comment_data.content,
        post_id=post_id,
        author_id=current_user.id
    )
    db.add(db_comment)
    
    # Update comment count
    post.comments_count += 1
    db.commit()
    db.refresh(db_comment)
    
    return CommentResponse.from_orm(db_comment)

@router.get("/{post_id}/comments", response_model=List[CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()
    return [CommentResponse.from_orm(comment) for comment in comments]

@router.post("/{post_id}/like")
def like_post(post_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    existing_like = db.query(Like).filter(Like.user_id == current_user.id, Like.post_id == post_id).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        # Count actual likes
        likes_count = db.query(Like).filter(Like.post_id == post_id).count()
        return {"message": "Post unliked", "is_liked": False, "likes_count": likes_count}
    else:
        # Like
        like = Like(user_id=current_user.id, post_id=post_id)
        db.add(like)
        db.commit()
        # Count actual likes
        likes_count = db.query(Like).filter(Like.post_id == post_id).count()
        return {"message": "Post liked", "is_liked": True, "likes_count": likes_count}

@router.delete("/{post_id}/like")
def unlike_post(post_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    like = db.query(Like).filter(Like.user_id == current_user.id, Like.post_id == post_id).first()
    if not like:
        raise HTTPException(status_code=400, detail="Not liked")
    
    post = db.query(Post).filter(Post.id == post_id).first()
    db.delete(like)
    post.likes_count -= 1
    db.commit()
    return {"message": "Post unliked"}

@router.get("/{post_id}/like-status")
def get_like_status(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()
    
    return {"is_liked": like is not None}

@router.put("/{post_id}", response_model=PostResponse)
def edit_post(
    post_id: int,
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.content = post_data.content
    if hasattr(post_data, 'image_url') and post_data.image_url:
        post.image_url = post_data.image_url
    
    db.commit()
    db.refresh(post)
    
    # Clear cache
    redis_client.delete("posts:0:20")
    
    return PostResponse.from_orm(post)

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.is_active = False
    db.commit()
    
    # Clear cache
    redis_client.delete("posts:0:20")
    
    return {"message": "Post deleted"}

@router.post("/{post_id}/report")
def report_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create admin notification
    notification = Notification(
        user_id=1,  # Assuming admin user ID is 1
        type="report",
        message=f"Post {post_id} reported by {current_user.username}",
        related_post_id=post_id
    )
    db.add(notification)
    db.commit()
    
    return {"message": "Post reported successfully"}