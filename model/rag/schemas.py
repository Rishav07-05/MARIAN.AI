from dataclasses import dataclass, field
from typing import Optional, Dict, Any


@dataclass
class Document:
    id: str
    text: str
    source: str
    title: Optional[str] = None
    timestamp: Optional[str] = None
    source_url: Optional[str] = None
    ingestion_timestamp: Optional[str] = None
    doc_type: Optional[str] = None
    language: Optional[str] = None
    content_hash: Optional[str] = None
    version: Optional[int] = 1
    user_id: Optional[str] = "public"  # user_id of the owner, "public" for public shared docs
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)


@dataclass
class Chunk:
    id: str
    doc_id: str
    text: str
    source: str
    title: Optional[str] = None
    timestamp: Optional[str] = None
    user_id: Optional[str] = "public"
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)