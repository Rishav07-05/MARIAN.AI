"""
model/rag/pipeline.py
---------------------
End-to-end RAG ingestion orchestrator.

Flow:
  Document → Validate → Clean → Deduplicate → Chunk → Embed → VectorStore

Idempotence:
  Before chunking, the pipeline checks whether a document with the same
  content hash already exists. If so, ingestion is skipped — the same
  article/document is not re-indexed.
"""
from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .cleaner import clean_document
from .chunker import chunk_document
from .retriever import Retriever
from .schemas import Document
from .vector_store import VectorStore

logger = logging.getLogger(__name__)


def _content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:32]


class RAGPipeline:
    """
    Orchestrates ingestion and retrieval.

    A single RAGPipeline instance should be reused across requests —
    VectorStore and Retriever internals use process-level singletons.
    """

    def __init__(self) -> None:
        self.vector_store = VectorStore()
        self.retriever = Retriever(store=self.vector_store)

    # ------------------------------------------------------------------ #
    # Ingestion                                                            #
    # ------------------------------------------------------------------ #

    def ingest(self, document: Document) -> Dict[str, Any]:
        """
        Ingest a single Document into the vector store.

        Returns a summary dict:
            {
                "document_id": str,
                "chunks_added": int,
                "skipped": bool,
                "reason": str | None,
            }
        """
        # 1. Basic validation
        if not document.text or not document.text.strip():
            logger.warning(
                f"pipeline_ingest_skipped_empty doc_id={document.id}"
            )
            return {
                "document_id": document.id,
                "chunks_added": 0,
                "skipped": True,
                "reason": "empty_text",
            }

        # 2. Set ingestion timestamp
        if not document.ingestion_timestamp:
            document.ingestion_timestamp = datetime.now(timezone.utc).isoformat()

        # 3. Compute content hash
        raw_hash = _content_hash(document.text)
        document.content_hash = raw_hash

        # 4. Deduplication check (use content hash as doc_id key in metadata)
        if self.vector_store.document_exists(raw_hash):
            logger.info(
                f"pipeline_ingest_duplicate_skipped doc_id={document.id} content_hash={raw_hash}"
            )
            return {
                "document_id": document.id,
                "chunks_added": 0,
                "skipped": True,
                "reason": "duplicate_content",
            }

        # 5. Clean
        cleaned = clean_document(document)
        if not cleaned.text:
            logger.warning(
                f"pipeline_ingest_skipped_after_cleaning doc_id={document.id}"
            )
            return {
                "document_id": document.id,
                "chunks_added": 0,
                "skipped": True,
                "reason": "empty_after_cleaning",
            }

        # 6. Chunk
        chunks = chunk_document(cleaned)
        if not chunks:
            logger.warning(
                f"pipeline_ingest_no_chunks doc_id={document.id}"
            )
            return {
                "document_id": document.id,
                "chunks_added": 0,
                "skipped": True,
                "reason": "no_chunks_produced",
            }

        # Override doc_id in all chunks with the content hash for
        # consistent deduplication lookups.
        for chunk in chunks:
            chunk.doc_id = raw_hash

        # 7. Embed + store
        count = self.vector_store.upsert_chunks(chunks)

        logger.info(
            f"pipeline_ingest_complete doc_id={document.id} content_hash={raw_hash} chunks_added={count} user_id={document.user_id or 'public'}"
        )

        return {
            "document_id": document.id,
            "chunks_added": count,
            "skipped": False,
            "reason": None,
        }

    def ingest_many(self, documents: List[Document]) -> List[Dict[str, Any]]:
        """Ingest a list of documents, returning one summary dict per doc."""
        return [self.ingest(doc) for doc in documents]

    # ------------------------------------------------------------------ #
    # Retrieval (thin delegation to Retriever)                             #
    # ------------------------------------------------------------------ #

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        user_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant chunks for *query*."""
        return self.retriever.retrieve(query, top_k=top_k, user_id=user_id)