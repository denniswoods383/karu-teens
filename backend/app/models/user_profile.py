from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from ..core.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Identity
    first_name = Column(String(50))
    last_initial = Column(String(1))
    student_id = Column(String(20))
    year_program = Column(String(100))
    
    # Interests & Activities
    clubs_societies = Column(JSON)  # ["AI Club", "Drama Society"]
    hobbies = Column(JSON)  # ["Photography", "Coding", "Football"]
    skills = Column(JSON)  # ["Python", "Public Speaking"]
    
    # Academic Engagement
    study_groups = Column(JSON)  # ["Math Study Group"]
    achievements = Column(JSON)  # ["Debate Champion 2023"]
    
    # Social Features
    fun_bio = Column(Text)
    linkedin_url = Column(String(255))
    github_url = Column(String(255))
    interest_tags = Column(JSON)  # ["#StartupLover", "#Bookworm"]
    
    # Privacy settings
    show_real_name = Column(Boolean, default=False)
    show_contact_info = Column(Boolean, default=False)
    show_location = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())