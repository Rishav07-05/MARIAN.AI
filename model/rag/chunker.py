import hashlib
from typing import List
from .schemas import Document, Chunk
from .config import CHUNK_SIZE, CHUNK_OVERLAP


def chunk_document(document: Document) -> List[Chunk]:
    text = document.text
    if not text or not text.strip():
        return []

    separators = ["\n\n", "\n", ". ", " ", ""]
    
    def _split_text(text_to_split: str, limit: int, overlap: int) -> List[str]:
        if len(text_to_split) <= limit:
            return [text_to_split]
            
        for sep in separators:
            if not sep:
                parts = []
                idx = 0
                while idx < len(text_to_split):
                    parts.append(text_to_split[idx : idx + limit])
                    idx += limit - overlap if limit - overlap > 0 else limit
                return parts
                
            parts = text_to_split.split(sep)
            if len(parts) > 1:
                split_result = []
                current_chunk = []
                current_length = 0
                for part in parts:
                    if len(part) > limit:
                        if current_chunk:
                            split_result.append(sep.join(current_chunk))
                            current_chunk = []
                            current_length = 0
                        sub_parts = _split_text(part, limit, overlap)
                        split_result.extend(sub_parts)
                    elif current_length + (len(sep) if current_length > 0 else 0) + len(part) <= limit:
                        current_chunk.append(part)
                        current_length += (len(sep) if current_length > 0 else 0) + len(part)
                    else:
                        if current_chunk:
                            split_result.append(sep.join(current_chunk))
                        current_chunk = [part]
                        current_length = len(part)
                if current_chunk:
                    split_result.append(sep.join(current_chunk))
                return split_result
        return [text_to_split]

    raw_chunks = _split_text(text, CHUNK_SIZE, CHUNK_OVERLAP)

    chunks = []
    doc_hash = document.content_hash or hashlib.sha256(text.encode("utf-8")).hexdigest()[:32]
    
    for idx, chunk_text in enumerate(raw_chunks):
        chunk_text_stripped = chunk_text.strip()
        if not chunk_text_stripped:
            continue
        chunk_id = f"{doc_hash}_{idx}"
        
        meta = dict(document.metadata) if document.metadata else {}
        meta["doc_hash"] = doc_hash
        
        chunks.append(
            Chunk(
                id=chunk_id,
                doc_id=doc_hash,
                text=chunk_text_stripped,
                source=document.source,
                title=document.title,
                timestamp=document.timestamp,
                user_id=document.user_id,
                metadata=meta
            )
        )
    return chunks