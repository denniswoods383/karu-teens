from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.sql import func
from ..core.database import Base

# Many-to-many relationship table
post_hashtags = Table(
    'post_hashtags',
    Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id')),
    Column('hashtag_id', Integer, ForeignKey('hashtags.id'))
)

class Hashtag(Base):
    __tablename__ = "hashtags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())