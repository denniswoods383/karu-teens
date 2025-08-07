from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from .api.v1.auth.routes import router as auth_router
from .api.v1.posts.routes import router as posts_router
from .api.v1.upload.routes import router as upload_router
from .api.v1.websocket.routes import router as websocket_router
from .api.v1.websocket.chat import websocket_endpoint
from .api.v1.users.routes import router as users_router
from .api.v1.notifications.routes import router as notifications_router
from .api.v1.profile.routes import router as profile_router
from .api.v1.messages.routes import router as messages_router
from .api.v1.stories.routes import router as stories_router
from .api.v1.search.routes import router as search_router
from .api.v1.social.routes import router as social_router
from .api.v1.moderation.routes import router as moderation_router
from .api.v1.ai.routes import router as ai_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(posts_router, prefix=f"{settings.API_V1_STR}/posts", tags=["posts"])
app.include_router(upload_router, prefix=f"{settings.API_V1_STR}/upload", tags=["upload"])
app.include_router(websocket_router, prefix=f"{settings.API_V1_STR}", tags=["websocket"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(notifications_router, prefix=f"{settings.API_V1_STR}/notifications", tags=["notifications"])
app.include_router(profile_router, prefix=f"{settings.API_V1_STR}/profile", tags=["profile"])
app.include_router(messages_router, prefix=f"{settings.API_V1_STR}/messages", tags=["messages"])
app.include_router(stories_router, prefix=f"{settings.API_V1_STR}/stories", tags=["stories"])
app.include_router(search_router, prefix=f"{settings.API_V1_STR}/search", tags=["search"])
app.include_router(social_router, prefix=f"{settings.API_V1_STR}/social", tags=["social"])
app.include_router(moderation_router, prefix=f"{settings.API_V1_STR}/moderation", tags=["moderation"])
app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.websocket("/ws/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: int):
    await websocket_endpoint(websocket, user_id)