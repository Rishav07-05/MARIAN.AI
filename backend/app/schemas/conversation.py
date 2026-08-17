import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    conversation_id: uuid.UUID
    role: str
    content: str
    model: Optional[str] = None
    token_count: Optional[int] = None
    created_at: datetime


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime


class ConversationDetailRead(ConversationRead):
    messages: List[MessageRead] = []


class PaginatedConversations(BaseModel):
    items: List[ConversationRead]
    limit: int
    offset: int
    total: int
    has_next: bool


class PaginatedMessages(BaseModel):
    items: List[MessageRead]
    limit: int
    offset: int
    total: int
    has_next: bool
