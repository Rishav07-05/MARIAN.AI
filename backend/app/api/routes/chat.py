from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.chat import ChatRequest
from app.services.llm_service import LLMService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", status_code=status.HTTP_200_OK)
async def chat_completion(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """POST /api/v1/chat endpoint returning SSE streaming response."""
    llm_service = LLMService(db)
    conv_id, generator = await llm_service.handle_chat_stream(request, current_user)

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "X-Conversation-ID": str(conv_id),
        },
    )
