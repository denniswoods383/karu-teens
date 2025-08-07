from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from .redis_client import redis_client

def get_user_id(request: Request):
    # Try to get user ID from token, fallback to IP
    try:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            # Extract user ID from token (simplified)
            return auth_header.split(" ")[1][:10]  # Use first 10 chars as identifier
        return get_remote_address(request)
    except:
        return get_remote_address(request)

# Create limiter instance
limiter = Limiter(
    key_func=get_user_id,
    storage_uri="redis://localhost:6379"
)

# Rate limit decorator
def rate_limit(calls: str):
    return limiter.limit(calls)