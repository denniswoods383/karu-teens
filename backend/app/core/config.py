from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SocialPlatform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./socialdb.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # File Upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    UPLOAD_DIR: str = "uploads"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://192.168.1.0/24", "*"]
    
    # AI API Keys
    OPENAI_API_KEY: Optional[str] = None
    STABILITY_API_KEY: Optional[str] = None
    STABILITY_API_KEY: Optional[str] = None
    PERSPECTIVE_API_KEY: Optional[str] = None
    HUGGINGFACE_TOKEN: Optional[str] = None
    RAPIDAPI_KEY: Optional[str] = None
    WEATHER_API_KEY: Optional[str] = None
    BITLY_TOKEN: Optional[str] = None
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"

settings = Settings()