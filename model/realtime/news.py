from datetime import datetime, timezone
import hashlib
from typing import List
from .client import RealtimeClient
from model.rag.schemas import Document


class NewsIngestor:

    def __init__(self, api_url: str) -> None:
        self.client = RealtimeClient()
        self.api_url = api_url

    async def fetch(self) -> List[Document]:
        try:
            data = await self.client.get_json(self.api_url)
        except Exception:
            return []

        documents = []

        for item in data.get("articles", []):
            title = item.get("title", "")
            description = item.get("description", "")
            content = item.get("content", "")
            url = item.get("url", "")
            published_at = item.get("publishedAt")

            body_text = content or description or title
            if not body_text:
                continue

            text_block = f"Title: {title}\n\nContent:\n{body_text}"
            
            content_hash = hashlib.sha256(text_block.encode("utf-8")).hexdigest()[:32]
            
            timestamp_str = published_at
            if not timestamp_str:
                timestamp_str = datetime.now(timezone.utc).isoformat()

            documents.append(
                Document(
                    id=f"news_{content_hash}",
                    title=title,
                    text=text_block,
                    source="realtime_news",
                    timestamp=timestamp_str,
                    source_url=url,
                    ingestion_timestamp=datetime.now(timezone.utc).isoformat(),
                    doc_type="news",
                    content_hash=content_hash,
                    user_id="public"
                )
            )

        return documents