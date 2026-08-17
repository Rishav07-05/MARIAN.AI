from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.redis_client import get_redis
from app.db.session import get_db

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", status_code=status.HTTP_200_OK)
async def health_check():
    """Liveness check for standard load balancer probing."""
    return {"status": "ok", "service": "marian-backend"}


@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check(
    db: AsyncSession = Depends(get_db),
    redis=Depends(get_redis),
):
    """Deep readiness check verifying PostgreSQL and Redis connections."""
    db_status = "ok"
    redis_status = "ok"

    # Test DB query
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    # Test Redis ping
    try:
        if redis:
            await redis.ping()
        else:
            redis_status = "unavailable"
    except Exception as e:
        redis_status = f"error: {str(e)}"

    is_ready = db_status == "ok" and (redis_status == "ok" or redis_status == "unavailable")

    return {
        "status": "ready" if is_ready else "unhealthy",
        "dependencies": {
            "database": db_status,
            "redis": redis_status,
        },
    }
