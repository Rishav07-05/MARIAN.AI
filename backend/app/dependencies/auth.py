from typing import Optional

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnauthorizedException
from app.core.security import verify_clerk_token
from app.db.models.user import User
from app.db.session import get_db
from app.repositories.user_repository import UserRepository


async def get_current_user(
    authorization: Optional[str] = Header(None, description="Bearer <clerk_token>"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract, verify Clerk Bearer token, and return authenticated local User model."""
    if not authorization:
        raise UnauthorizedException("Authorization header missing")

    if not authorization.startswith("Bearer "):
        raise UnauthorizedException("Invalid Authorization header format. Expected 'Bearer <token>'")

    token = authorization.split(" ")[1]
    claims = await verify_clerk_token(token)

    clerk_user_id = claims.get("sub")
    email = claims.get("email") or f"{clerk_user_id}@marian.ai"
    name = claims.get("name") or claims.get("first_name") or email.split("@")[0]
    avatar_url = claims.get("picture") or claims.get("image_url")

    # Sync or provision local user record
    repo = UserRepository(db)
    user = await repo.create_or_sync_user(
        clerk_user_id=clerk_user_id,
        email=email,
        name=name,
        avatar_url=avatar_url,
    )

    if user.status != "active":
        raise UnauthorizedException("User account is inactive or suspended")

    return user
