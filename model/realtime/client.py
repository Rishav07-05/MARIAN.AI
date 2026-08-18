import asyncio
import logging
import httpx

logger = logging.getLogger(__name__)


class RealtimeClient:

    def __init__(self, retries: int = 3, backoff_factor: float = 1.5) -> None:
        self.retries = retries
        self.backoff_factor = backoff_factor

    async def get_json(self, url: str, params=None, headers=None):
        timeout = httpx.Timeout(15.0, connect=5.0)
        
        async with httpx.AsyncClient(timeout=timeout) as client:
            delay = 1.0
            for attempt in range(self.retries + 1):
                try:
                    response = await client.get(
                        url,
                        params=params,
                        headers=headers
                    )
                    response.raise_for_status()
                    return response.json()
                except (httpx.HTTPStatusError, httpx.RequestError) as e:
                    if attempt == self.retries:
                        logger.error(f"HTTP request failed after {self.retries} retries: {e}")
                        raise
                    logger.warning(
                        f"HTTP request error, retry {attempt + 1}/{self.retries} in {delay:.2f}s: {e}"
                    )
                    await asyncio.sleep(delay)
                    delay *= self.backoff_factor