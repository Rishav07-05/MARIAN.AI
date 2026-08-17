from typing import List

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.integration_repository import IntegrationRepository
from app.schemas.integration import (
    GoogleOAuthConnectResponse,
    IntegrationDisconnectResponse,
    IntegrationRead,
)
from app.services.google_oauth_service import GoogleOAuthService

router = APIRouter(prefix="/integrations", tags=["Integrations"])


@router.get("", response_model=List[IntegrationRead], status_code=status.HTTP_200_OK)
async def list_integrations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List active integrations connected for current user (sanitized metadata only)."""
    repo = IntegrationRepository(db)
    items = await repo.list_user_integrations(current_user.id)
    return [IntegrationRead.model_validate(i) for i in items]


@router.post("/google/connect", response_model=GoogleOAuthConnectResponse, status_code=status.HTTP_200_OK)
async def connect_google(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate Google OAuth consent authorization URL with CSRF state."""
    service = GoogleOAuthService(db)
    auth_url, state = await service.generate_authorization_url(current_user)
    return GoogleOAuthConnectResponse(authorization_url=auth_url, state=state)


@router.get("/google/callback", status_code=status.HTTP_200_OK)
async def google_callback(
    code: str = Query(...),
    state: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Handle Google OAuth callback, exchange authorization code, encrypt & save tokens."""
    service = GoogleOAuthService(db)
    return await service.handle_oauth_callback(code=code, state=state, user=current_user)


@router.delete("/google", response_model=IntegrationDisconnectResponse, status_code=status.HTTP_200_OK)
async def disconnect_google(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Disconnect Google Calendar integration for current user."""
    repo = IntegrationRepository(db)
    await repo.disconnect(current_user.id, "google_calendar")
    return IntegrationDisconnectResponse(provider="google_calendar", status="disconnected")
