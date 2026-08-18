import re
import unicodedata
from .schemas import Document


def clean_text(text: str) -> str:
    if not text:
        return ""

    # NFC unicode normalization
    text = unicodedata.normalize("NFC", text)

    # HTML tags removal
    text = re.sub(r"<[^>]+>", " ", text)

    # URL patterns removal
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)

    # Double/extra spaces and line breaks normalization
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def clean_document(document: Document) -> Document:
    cleaned_title = clean_text(document.title) if document.title else None
    
    cleaned_metadata = {}
    if document.metadata:
        for k, v in document.metadata.items():
            if isinstance(v, str):
                cleaned_metadata[k] = clean_text(v)
            else:
                cleaned_metadata[k] = v

    return Document(
        id=document.id,
        text=clean_text(document.text),
        source=document.source,
        title=cleaned_title,
        timestamp=document.timestamp,
        source_url=document.source_url,
        ingestion_timestamp=document.ingestion_timestamp,
        doc_type=document.doc_type,
        language=document.language,
        content_hash=document.content_hash,
        version=document.version,
        user_id=document.user_id,
        metadata=cleaned_metadata
    )