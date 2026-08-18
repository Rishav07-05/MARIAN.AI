import logging
from typing import List, Dict, Any, Optional
import chromadb
from .config import VECTOR_DB_DIR
from .embeddings import EmbeddingModel
from .schemas import Chunk

logger = logging.getLogger(__name__)


class VectorStore:

    def __init__(self) -> None:
        logger.info(f"Initializing ChromaDB persistent client at {VECTOR_DB_DIR}...")
        self.client = chromadb.PersistentClient(
            path=str(VECTOR_DB_DIR)
        )

        self.collection = self.client.get_or_create_collection(
            name="marian_knowledge",
            metadata={"hnsw:space": "cosine"}  # Explicitly configure cosine similarity distance
        )

        self.embedding_model = EmbeddingModel()

    def health_check(self) -> bool:
        try:
            self.client.heartbeat()
            return True
        except Exception as e:
            logger.error(f"ChromaDB health check failed: {e}")
            return False

    def document_exists(self, content_hash: str) -> bool:
        """Checks if chunks for this content hash already exist inside collection."""
        try:
            results = self.collection.get(
                where={"doc_hash": content_hash},
                limit=1
            )
            return len(results.get("ids", [])) > 0
        except Exception as e:
            logger.error(f"Error checking document existence inside ChromaDB: {e}")
            return False

    def upsert_chunks(self, chunks: List[Chunk]) -> int:
        if not chunks:
            return 0

        ids = [chunk.id for chunk in chunks]
        texts = [chunk.text for chunk in chunks]

        # Generate embeddings
        embeddings = self.embedding_model.encode(texts)

        metadatas = []
        for chunk in chunks:
            meta = {
                "doc_id": chunk.doc_id,
                "doc_hash": chunk.doc_id,
                "source": chunk.source or "",
                "title": chunk.title or "",
                "timestamp": chunk.timestamp or "",
                "user_id": chunk.user_id or "public"
            }
            # Append other flat metadata items
            if chunk.metadata:
                for k, v in chunk.metadata.items():
                    if k not in meta and isinstance(v, (str, int, float, bool)):
                        meta[k] = v
            metadatas.append(meta)

        self.collection.upsert(
            ids=ids,
            documents=texts,
            embeddings=embeddings.tolist(),
            metadatas=metadatas
        )
        return len(chunks)

    def search(self, query: str, top_k: int = 5, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Queries vector database matching the query embedding with user tenant scoping."""
        embedding = self.embedding_model.encode([query])[0]

        if user_id:
            where_clause = {
                "$or": [
                    {"user_id": user_id},
                    {"user_id": "public"}
                ]
            }
        else:
            where_clause = {"user_id": "public"}

        results = self.collection.query(
            query_embeddings=[embedding.tolist()],
            n_results=top_k,
            where=where_clause
        )
        return results

    def reset_collection(self) -> None:
        """Deletes and recreates the collection."""
        try:
            self.client.delete_collection("marian_knowledge")
        except Exception:
            pass
        self.collection = self.client.get_or_create_collection(
            name="marian_knowledge",
            metadata={"hnsw:space": "cosine"}
        )