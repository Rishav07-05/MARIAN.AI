import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    clerk_user_id: str
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None


class AuthMeResponse(BaseModel):
    user: UserRead
    authenticated: bool = True
