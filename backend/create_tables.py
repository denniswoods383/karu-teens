from app.core.database import engine, Base
from app.models.user import User
from app.models.post import Post, Comment
from app.models.like import Like
from app.models.follow import Follow
from app.models.notification import Notification
from app.models.story import Story

# Create all tables
Base.metadata.create_all(bind=engine)
print("All tables created successfully!")