import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.integration import Integration


class IntegrationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_provider(
        self, user_id: uuid.UUID, provider: str = "google_calendar"
    ) -> Optional[Integration]:
        stmt = select(Integration).where(
            Integration.user_id == user_id,
            Integration.provider == provider,
            Integration.status == "active",
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_user_integrations(self, user_id: uuid.UUID) -> List[Integration]:
        stmt = select(Integration).where(Integration.user_id == user_id)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def save_integration(
        self,
        user_id: uuid.UUID,
        provider: str,
        provider_account_id: str,
        encrypted_access_token: str,
        encrypted_refresh_token: Optional[str],
        token_expires_at: Optional[datetime],
        scopes: List[str],
    ) -> Integration:
        integration = await self.get_by_provider(user_id, provider)
        if not integration:
            integration = Integration(
                user_id=user_id,
                provider=provider,
                provider_account_id=provider_account_id,
                encrypted_access_token=encrypted_access_token,
                encrypted_refresh_token=encrypted_refresh_token,
                token_expires_at=token_expires_at,
                scopes=scopes,
                status="active",
            )
            self.db.add(integration)
        else:
            integration.encrypted_access_token = encrypted_access_token
            if encrypted_refresh_token:
                integration.encrypted_refresh_token = encrypted_refresh_token
            integration.token_expires_at = token_expires_at
            integration.scopes = scopes
            integration.status = "active"

        await self.db.commit()
        await self.db.refresh(integration)
        return integration

    async def disconnect(self, user_id: uuid.UUID, provider: str) -> bool:
        integration = await self.get_by_provider(user_id, provider)
        if not integration:
            return False
        integration.status = "revoked"
        await self.db.commit()
        return True
