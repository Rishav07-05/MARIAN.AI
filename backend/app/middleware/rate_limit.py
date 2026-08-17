import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.clients.redis_client import get_redis
from app.core.config import settings
from app.core.logging import logger


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip rate limit on health endpoints
        path = request.url.path
        if path.startswith("/api/v1/health") or request.method == "OPTIONS":
            return await call_next(request)

        # Distinguish endpoint limits
        if "/chat" in path:
            limit = settings.RATE_LIMIT_CHAT_RPM
        elif "/integrations" in path:
            limit = settings.RATE_LIMIT_OAUTH_RPM
        else:
            limit = settings.RATE_LIMIT_STANDARD_RPM

        # Identify client (Auth user ID if present, otherwise client IP)
        client_ip = request.client.host if request.client else "127.0.0.1"
        key = f"rate_limit:{path}:{client_ip}"

        redis = await get_redis()
        if redis:
            try:
                now = time.time()
                pipeline = redis.pipeline()
                pipeline.zremrangebyscore(key, 0, now - 60)
                pipeline.zadd(key, {str(now): now})
                pipeline.zcard(key)
                pipeline.expire(key, 60)
                results = await pipeline.execute()

                request_count = results[2]
                if request_count > limit:
                    logger.warning("rate_limit_exceeded", path=path, ip=client_ip, count=request_count)
                    return JSONResponse(
                        status_code=429,
                        content={
                            "error": {
                                "code": "RATE_LIMIT_EXCEEDED",
                                "message": f"Rate limit of {limit} requests per minute exceeded.",
                                "request_id": getattr(request.state, "request_id", None),
                            }
                        },
                        headers={"Retry-After": "60"},
                    )
            except Exception as e:
                logger.warning("rate_limiter_error_bypassed", error=str(e))

        return await call_next(request)
