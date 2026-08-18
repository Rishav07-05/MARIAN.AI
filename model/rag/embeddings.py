import threading
import logging
from sentence_transformers import SentenceTransformer
from .config import EMBEDDING_MODEL

logger = logging.getLogger(__name__)


class EmbeddingModel:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(EmbeddingModel, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        
        # Lazy initialization
        try:
            import torch
            device = "cuda" if torch.cuda.is_available() else "cpu"
        except ImportError:
            device = "cpu"
            
        logger.info(f"Initializing embedding model '{EMBEDDING_MODEL}' on device '{device}'...")
        self.model = SentenceTransformer(EMBEDDING_MODEL, device=device)
        self._initialized = True

    def encode(self, texts):
        if isinstance(texts, str):
            texts = [texts]
        
        return self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=False,
            convert_to_numpy=True
        )