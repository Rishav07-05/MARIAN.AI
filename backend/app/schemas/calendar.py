from typing import List, Optional

from pydantic import BaseModel


class CalendarItem(BaseModel):
    id: str
    summary: str
    description: Optional[str] = None
    timeZone: Optional[str] = None
    primary: Optional[bool] = False


class CalendarEventItem(BaseModel):
    id: str
    summary: str
    description: Optional[str] = None
    start: dict
    end: dict
    location: Optional[str] = None
    status: Optional[str] = None


class CalendarListResponse(BaseModel):
    calendars: List[CalendarItem]


class CalendarEventsResponse(BaseModel):
    events: List[CalendarEventItem]
