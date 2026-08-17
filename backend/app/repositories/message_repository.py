import uuid
from typing import List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.message import Message


class MessageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_messages_for_conversation(
        self, conversation_id: uuid.UUID, limit: int = 50, offset: int = 0
    ) -> Tuple[List[Message], int]:
        count_stmt = (
            select(func.count())
            .select_from(Message)
            .where(Message.conversation_id == conversation_id)
        )
        total = (await self.db.execute(count_stmt)).scalar() or 0

        items_stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
            .offset(offset)
        )
        items = (await self.db.execute(items_stmt)).scalars().all()
        return list(items), total

    async def create_message(
        self,
        conversation_id: uuid.UUID,
        role: str,
        content: str,
        model: Optional[str] = None,
        token_count: Optional[int] = None,
    ) -> Message:
        msg = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            model=model,
            token_count=token_count,
        )
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)
        return msg
