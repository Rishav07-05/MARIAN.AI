import uuid
from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class IntegrationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    provider: str
    provider_account_id: str
    scopes: List[str]
    status: str
    created_at: datetime
    updated_at: datetime


class GoogleOAuthConnectResponse(BaseModel):
    authorization_url: str
    state: str


class IntegrationDisconnectResponse(BaseModel):
    provider: str
    status: str = "disconnected"
