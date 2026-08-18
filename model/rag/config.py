import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = Path(os.getenv("RAG_DATA_DIR", BASE_DIR / "data"))
RAW_DATA_DIR = DATA_DIR / "raw"
CLEANED_DATA_DIR = DATA_DIR / "cleaned"
VECTOR_DB_DIR = DATA_DIR / "vector_db"

EMBEDDING_MODEL = os.getenv("RAG_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

CHUNK_SIZE = int(os.getenv("RAG_CHUNK_SIZE", 500))
CHUNK_OVERLAP = int(os.getenv("RAG_CHUNK_OVERLAP", 80))

TOP_K = int(os.getenv("RAG_TOP_K", 5))

# Cosine similarity score threshold
SIMILARITY_THRESHOLD = float(os.getenv("RAG_SIMILARITY_THRESHOLD", 0.35))

RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
CLEANED_DATA_DIR.mkdir(parents=True, exist_ok=True)
VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)