import uuid
from typing import Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    conversation_id: Optional[uuid.UUID] = None
    prompt: str = Field(..., min_length=1, max_length=16000)
    model: str = Field(default="MARIAN 3 Omni")
    stream: bool = Field(default=True)


class ChatResponseSync(BaseModel):
    conversation_id: uuid.UUID
    user_message_id: uuid.UUID
    assistant_message_id: uuid.UUID
    content: str
    model: str
    token_count: int
