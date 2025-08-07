from app.core.database import engine
from app.models.message import Message
from app.core.database import Base

# Create the messages table
Base.metadata.create_all(bind=engine, tables=[Message.__table__])
print("Messages table created successfully!")