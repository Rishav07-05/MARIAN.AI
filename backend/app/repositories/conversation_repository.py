import uuid
from typing import List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.models.conversation import Conversation


class ConversationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(
        self, conversation_id: uuid.UUID, user_id: uuid.UUID, include_messages: bool = False
    ) -> Optional[Conversation]:
        """Fetch conversation by ID strictly matching user_id ownership."""
        stmt = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        if include_messages:
            stmt = stmt.options(selectinload(Conversation.messages))

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_user_conversations(
        self, user_id: uuid.UUID, limit: int = 20, offset: int = 0
    ) -> Tuple[List[Conversation], int]:
        """List conversations belonging to user_id with pagination."""
        # Total count query
        count_stmt = select(func.count()).select_from(Conversation).where(Conversation.user_id == user_id)
        total = (await self.db.execute(count_stmt)).scalar() or 0

        # Paginated items query
        items_stmt = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .limit(limit)
            .offset(offset)
        )
        items = (await self.db.execute(items_stmt)).scalars().all()
        return list(items), total

    async def create(self, user_id: uuid.UUID, title: str = "New Conversation") -> Conversation:
        conv = Conversation(user_id=user_id, title=title)
        self.db.add(conv)
        await self.db.commit()
        await self.db.refresh(conv)
        return conv

    async def delete(self, conversation_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        conv = await self.get_by_id(conversation_id, user_id)
        if not conv:
            return False
        await self.db.delete(conv)
        await self.db.commit()
        return True
