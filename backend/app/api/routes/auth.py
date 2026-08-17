from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.schemas.user import AuthMeResponse, UserRead

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=AuthMeResponse, status_code=status.HTTP_200_OK)
async def get_auth_me(current_user: User = Depends(get_current_user)):
    """Retrieve currently authenticated user session details."""
    return AuthMeResponse(
        user=UserRead.model_validate(current_user),
        authenticated=True,
    )
