import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch
import numpy as np
import pytest

# Ensure root paths are in sys.path
WORKSPACE_DIR = Path(__file__).resolve().parents[3]
if str(WORKSPACE_DIR) not in sys.path:
    sys.path.append(str(WORKSPACE_DIR))
if str(WORKSPACE_DIR / "backend") not in sys.path:
    sys.path.append(str(WORKSPACE_DIR / "backend"))

from model.rag.schemas import Document, Chunk
from model.rag.cleaner import clean_text, clean_document
from model.rag.chunker import chunk_document
from model.rag.embeddings import EmbeddingModel
from model.rag.vector_store import VectorStore
from model.rag.retriever import Retriever
from model.rag.pipeline import RAGPipeline
from model.realtime.client import RealtimeClient


# 1. Text Cleaner Tests
def test_clean_text() -> None:
    # NFC normalization, HTML tagging, URL matching
    html_text = "<p>Hello <b>World</b>!</p>"
    assert clean_text(html_text) == "Hello World !"
    
    url_text = "Check this out https://google.com or www.example.com for info"
    assert clean_text(url_text) == "Check this out or for info"
    
    whitespace_text = "Line1  \n\n  Line2\tLine3"
    assert clean_text(whitespace_text) == "Line1 Line2 Line3"
    
    unicode_text = "Héllo\u00a0world"  # Non-breaking space
    assert clean_text(unicode_text) == "Héllo world"


def test_clean_document() -> None:
    doc = Document(
        id="doc_123",
        text="<p>This is test content.</p>",
        source="unit_test",
        title="<b>Test Title</b>",
        metadata={"author": "<i>Jane Doe</i>"}
    )
    cleaned = clean_document(doc)
    assert cleaned.text == "This is test content."
    assert cleaned.title == "Test Title"
    assert cleaned.metadata["author"] == "Jane Doe"


# 2. Chunker Tests
def test_chunk_document_basic() -> None:
    # Small document fits in a single chunk
    doc = Document(
        id="doc_small",
        text="A brief test sentence.",
        source="test"
    )
    chunks = chunk_document(doc)
    assert len(chunks) == 1
    assert chunks[0].id == f"{chunks[0].doc_id}_0"
    assert chunks[0].text == "A brief test sentence."
    assert chunks[0].source == "test"
    assert chunks[0].user_id == "public"


# 3. Model Embeddings Mocked Test
@patch("model.rag.embeddings.SentenceTransformer")
def test_embedding_singleton(mock_transformer: MagicMock) -> None:
    # Reset singleton instance for testing
    EmbeddingModel._instance = None
    
    # Configure mock encode behavior
    mock_inst = MagicMock()
    mock_inst.encode.return_value = np.zeros((1, 384))
    mock_transformer.return_value = mock_inst

    model1 = EmbeddingModel()
    model2 = EmbeddingModel()
    
    # Verify singleton identity
    assert model1 is model2
    
    embeddings = model1.encode(["Test embedding query"])
    assert embeddings.shape == (1, 384)
    mock_inst.encode.assert_called_once()


# 4. VectorStore and Multi-Tenancy test
@patch("model.rag.vector_store.chromadb.PersistentClient")
@patch("model.rag.embeddings.SentenceTransformer")
def test_vector_store_multitenancy(mock_transformer: MagicMock, mock_chroma: MagicMock) -> None:
    # Reset singleton instance for testing
    EmbeddingModel._instance = None
    mock_transformer_inst = MagicMock()
    mock_transformer_inst.encode.return_value = np.zeros((1, 384))
    mock_transformer.return_value = mock_transformer_inst

    # Mock Chroma Client and Collection responses
    mock_client = MagicMock()
    mock_collection = MagicMock()
    mock_chroma.return_value = mock_client
    mock_client.get_or_create_collection.return_value = mock_collection

    store = VectorStore()
    
    # Ingestion test
    chunks = [
        Chunk(
            id="chunk_1",
            doc_id="doc_hash_1",
            text="User A secret document.",
            source="user_upload",
            user_id="user_a"
        ),
        Chunk(
            id="chunk_2",
            doc_id="doc_hash_2",
            text="Public common document.",
            source="news",
            user_id="public"
        )
    ]
    store.upsert_chunks(chunks)
    assert mock_collection.upsert.called

    # Search with user isolation logic (User A)
    store.search(query="secret query", user_id="user_a")
    # Verify the where clause contains user_a OR public
    args, kwargs = mock_collection.query.call_args
    assert "where" in kwargs
    assert "$or" in kwargs["where"]
    assert {"user_id": "user_a"} in kwargs["where"]["$or"]
    assert {"user_id": "public"} in kwargs["where"]["$or"]

    # Search with no authenticated user (only public)
    store.search(query="news query", user_id=None)
    args, kwargs = mock_collection.query.call_args
    assert "where" in kwargs
    assert kwargs["where"] == {"user_id": "public"}


# 5. Pipeline Idempotence Ingestion Test
@patch("model.rag.vector_store.chromadb.PersistentClient")
@patch("model.rag.embeddings.SentenceTransformer")
def test_pipeline_idempotence(mock_transformer: MagicMock, mock_chroma: MagicMock) -> None:
    EmbeddingModel._instance = None
    mock_transformer_inst = MagicMock()
    mock_transformer_inst.encode.return_value = np.zeros((1, 384))
    mock_transformer.return_value = mock_transformer_inst

    mock_client = MagicMock()
    mock_collection = MagicMock()
    mock_chroma.return_value = mock_client
    mock_client.get_or_create_collection.return_value = mock_collection

    pipeline = RAGPipeline()
    
    doc = Document(id="news_article", text="Fast news report text.", source="news")

    # Mock collection.get to simulate the document does not exist yet
    mock_collection.get.return_value = {"ids": []}
    
    result = pipeline.ingest(doc)
    assert result["skipped"] is False
    assert result["chunks_added"] > 0

    # Mock collection.get to simulate the document already exists (idempotency check)
    mock_collection.get.return_value = {"ids": ["news_article_0"]}
    
    result_dup = pipeline.ingest(doc)
    assert result_dup["skipped"] is True
    assert result_dup["reason"] == "duplicate_content"


# 6. RealtimeClient Backoff Retries Test
@pytest.mark.asyncio
async def test_realtime_client_retry() -> None:
    client = RealtimeClient(retries=2, backoff_factor=0.1)

    with patch("httpx.AsyncClient.get") as mock_get:
        mock_response = MagicMock()
        mock_response.json.return_value = {"status": "ok"}
        
        import httpx
        mock_get.side_effect = [
            httpx.HTTPStatusError("ServerError", request=MagicMock(), response=MagicMock()),
            mock_response
        ]

        result = await client.get_json("https://mock-url.invalid")
        assert result == {"status": "ok"}
        assert mock_get.call_count == 2
