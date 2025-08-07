from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    content: Optional[str] = None
    image_url: Optional[str] = None

class PostResponse(PostBase):
    id: int
    author_id: int
    author: UserResponse
    likes_count: int
    comments_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int

class CommentResponse(CommentBase):
    id: int
    post_id: int
    author_id: int
    author: UserResponse
    created_at: datetime
    
    class Config:
        from_attributes = True