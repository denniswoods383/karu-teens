from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_initial: Optional[str] = None
    student_id: Optional[str] = None
    year_program: Optional[str] = None
    clubs_societies: Optional[List[str]] = None
    hobbies: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    study_groups: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    fun_bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    interest_tags: Optional[List[str]] = None
    show_real_name: Optional[bool] = None
    show_contact_info: Optional[bool] = None
    show_location: Optional[bool] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: Optional[str]
    last_initial: Optional[str]
    student_id: Optional[str]
    year_program: Optional[str]
    clubs_societies: Optional[List[str]]
    hobbies: Optional[List[str]]
    skills: Optional[List[str]]
    study_groups: Optional[List[str]]
    achievements: Optional[List[str]]
    fun_bio: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    interest_tags: Optional[List[str]]
    show_real_name: bool
    show_contact_info: bool
    show_location: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True