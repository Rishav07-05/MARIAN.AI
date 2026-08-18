import sys
from pathlib import Path

# Dynamically append workspace root to sys.path to permit importing 'model.*'
WORKSPACE_DIR = Path(__file__).resolve().parents[3]
if str(WORKSPACE_DIR) not in sys.path:
    sys.path.append(str(WORKSPACE_DIR))

from typing import Optional
from model.rag.retriever import Retriever


class RAGService:

    def __init__(self) -> None:
        self.retriever = Retriever()

    def get_context(self, query: str, top_k: int = 5, user_id: Optional[str] = None) -> str:
        results = self.retriever.retrieve(
            query=query,
            top_k=top_k,
            user_id=user_id
        )

        if not results:
            return ""

        context_parts = []
        for index, result in enumerate(results, 1):
            context_parts.append(
                f"SOURCE {index}\n"
                f"Title: {result.get('title', '') or 'Untitled'}\n"
                f"Source: {result.get('source', '') or 'Unknown'}\n"
                f"Content:\n{result.get('text', '')}\n"
            )

        return "\n".join(context_parts)