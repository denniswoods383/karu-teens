from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
from ....core.database import get_db
from ....models.user import User
from ..auth.routes import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Check file size (50MB limit)
    if file.size and file.size > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 50MB)")
    
    # Allow all file types - no restriction
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if file.filename else 'bin'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Return file URL with dynamic IP support
    file_url = f"/uploads/{unique_filename}"
    return {"url": file_url, "filename": unique_filename}