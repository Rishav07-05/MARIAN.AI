from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_user_me(current_user: User = Depends(get_current_user)):
    """Retrieve full user profile for current user."""
    return UserRead.model_validate(current_user)
