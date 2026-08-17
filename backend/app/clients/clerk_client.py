import time
from typing import Any, Dict, Optional

import httpx

from app.core.config import settings
from app.core.logging import logger

_jwks_cache: Optional[Dict[str, Any]] = None
_jwks_cache_expiry: float = 0.0
CACHE_TTL = 3600  # 1 hour cache for JWKS keys


async def fetch_clerk_jwks() -> Dict[str, Any]:
    """Fetch Clerk JWKS public keys with caching."""
    global _jwks_cache, _jwks_cache_expiry

    now = time.time()
    if _jwks_cache and now < _jwks_cache_expiry:
        return _jwks_cache

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.CLERK_JWKS_URL)
            response.raise_for_status()
            jwks = response.json()
            _jwks_cache = jwks
            _jwks_cache_expiry = now + CACHE_TTL
            logger.info("clerk_jwks_fetched", key_count=len(jwks.get("keys", [])))
            return jwks
    except Exception as e:
        logger.error("clerk_jwks_fetch_failed", error=str(e))
        if _jwks_cache:
            # Fallback to expired cache if available
            return _jwks_cache
        raise e
