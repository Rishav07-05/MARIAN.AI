from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.calendar import CalendarEventsResponse, CalendarListResponse
from app.services.google_oauth_service import GoogleOAuthService

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.get("/calendars", response_model=CalendarListResponse, status_code=status.HTTP_200_OK)
async def list_user_calendars(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve connected Google Calendars for current user."""
    service = GoogleOAuthService(db)
    calendars = await service.fetch_calendars(current_user)
    return CalendarListResponse(calendars=calendars)


@router.get("/events", response_model=CalendarEventsResponse, status_code=status.HTTP_200_OK)
async def list_calendar_events(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve upcoming Google Calendar events for current user."""
    service = GoogleOAuthService(db)
    events = await service.fetch_events(current_user)
    return CalendarEventsResponse(events=events)
