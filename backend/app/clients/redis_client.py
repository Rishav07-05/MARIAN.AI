from typing import Optional

from redis.asyncio import Redis

from app.core.config import settings
from app.core.logging import logger

redis_client: Optional[Redis] = None


async def init_redis() -> Redis:
    """Initialize Redis async client."""
    global redis_client
    try:
        redis_client = Redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
        await redis_client.ping()
        logger.info("redis_connected", url=settings.REDIS_URL)
        return redis_client
    except Exception as e:
        logger.warning("redis_connection_failed", error=str(e))
        redis_client = None
        return None


async def get_redis() -> Optional[Redis]:
    """Dependency getter for Redis connection."""
    global redis_client
    if redis_client is None:
        return await init_redis()
    return redis_client


async def close_redis() -> None:
    """Close Redis connection on application shutdown."""
    global redis_client
    if redis_client is not None:
        await redis_client.close()
        logger.info("redis_closed")
