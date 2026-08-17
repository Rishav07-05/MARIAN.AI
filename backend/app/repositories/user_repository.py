import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_clerk_id(self, clerk_user_id: str) -> Optional[User]:
        stmt = select(User).where(User.clerk_user_id == clerk_user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_or_sync_user(
        self,
        clerk_user_id: str,
        email: str,
        name: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ) -> User:
        user = await self.get_by_clerk_id(clerk_user_id)

        now = datetime.now(timezone.utc)
        if not user:
            user = User(
                clerk_user_id=clerk_user_id,
                email=email,
                name=name or email.split("@")[0],
                avatar_url=avatar_url,
                status="active",
                last_login_at=now,
            )
            self.db.add(user)
        else:
            # Sync user details if updated
            user.last_login_at = now
            if email and user.email != email:
                user.email = email
            if name and user.name != name:
                user.name = name
            if avatar_url and user.avatar_url != avatar_url:
                user.avatar_url = avatar_url

        await self.db.commit()
        await self.db.refresh(user)
        return user
