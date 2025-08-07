from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from ..core.database import Base
import enum

class ReportType(enum.Enum):
    SPAM = "spam"
    HARASSMENT = "harassment"
    INAPPROPRIATE = "inappropriate"
    FAKE_NEWS = "fake_news"
    OTHER = "other"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reported_user_id = Column(Integer, ForeignKey("users.id"))
    reported_post_id = Column(Integer, ForeignKey("posts.id"))
    type = Column(Enum(ReportType), nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())