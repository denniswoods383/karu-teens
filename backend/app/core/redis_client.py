import redis
import json
from typing import Optional, Any
from .config import settings

class RedisClient:
    def __init__(self):
        self.redis = redis.Redis(
            host=getattr(settings, 'REDIS_HOST', 'localhost'),
            port=getattr(settings, 'REDIS_PORT', 6379),
            db=getattr(settings, 'REDIS_DB', 0),
            decode_responses=True
        )

    def get(self, key: str) -> Optional[Any]:
        try:
            value = self.redis.get(key)
            return json.loads(value) if value else None
        except:
            return None

    def set(self, key: str, value: Any, expire: int = 300):
        try:
            self.redis.setex(key, expire, json.dumps(value, default=str))
            return True
        except:
            return False

    def delete(self, key: str):
        try:
            self.redis.delete(key)
            return True
        except:
            return False

    def exists(self, key: str) -> bool:
        try:
            return self.redis.exists(key) > 0
        except:
            return False

redis_client = RedisClient()