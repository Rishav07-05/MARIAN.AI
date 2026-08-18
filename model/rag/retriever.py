from typing import List, Dict, Any, Optional
from .vector_store import VectorStore
from .config import SIMILARITY_THRESHOLD


class Retriever:

    def __init__(self, store: Optional[VectorStore] = None) -> None:
        # Support passing a shared VectorStore instance or build a local singleton
        self.store = store or VectorStore()

    def retrieve(self, query: str, top_k: int = 5, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        try:
            result = self.store.search(
                query=query,
                top_k=top_k,
                user_id=user_id
            )
        except Exception:
            return []

        documents = result.get("documents", [[]])[0] if result.get("documents") else []
        metadatas = result.get("metadatas", [[]])[0] if result.get("metadatas") else []
        distances = result.get("distances", [[]])[0] if result.get("distances") else []

        results = []

        for doc_text, metadata, dist in zip(documents, metadatas, distances):
            # Cosine distance to Cosine Similarity conversion
            similarity = 1.0 - dist
            
            if similarity < SIMILARITY_THRESHOLD:
                continue

            results.append({
                "text": doc_text,
                "source": metadata.get("source"),
                "title": metadata.get("title"),
                "timestamp": metadata.get("timestamp"),
                "user_id": metadata.get("user_id"),
                "similarity": similarity
            })

        return results