import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.conversation import (
    ConversationCreate,
    ConversationDetailRead,
    ConversationRead,
    PaginatedConversations,
    PaginatedMessages,
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("", response_model=PaginatedConversations, status_code=status.HTTP_200_OK)
async def list_conversations(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List paginated conversations belonging strictly to current user."""
    repo = ConversationRepository(db)
    items, total = await repo.list_user_conversations(
        user_id=current_user.id, limit=limit, offset=offset
    )

    return PaginatedConversations(
        items=[ConversationRead.model_validate(c) for c in items],
        limit=limit,
        offset=offset,
        total=total,
        has_next=(offset + limit) < total,
    )


@router.post("", response_model=ConversationRead, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    payload: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new conversation thread for current user."""
    repo = ConversationRepository(db)
    conv = await repo.create(
        user_id=current_user.id,
        title=payload.title or "New Conversation",
    )
    return ConversationRead.model_validate(conv)


@router.get("/{conversation_id}", response_model=ConversationDetailRead, status_code=status.HTTP_200_OK)
async def get_conversation(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve specific conversation detail strictly belonging to current user."""
    repo = ConversationRepository(db)
    conv = await repo.get_by_id(
        conversation_id=conversation_id,
        user_id=current_user.id,
        include_messages=True,
    )
    if not conv:
        raise NotFoundException("Conversation not found")

    return ConversationDetailRead.model_validate(conv)


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a conversation belonging strictly to current user."""
    repo = ConversationRepository(db)
    deleted = await repo.delete(conversation_id=conversation_id, user_id=current_user.id)
    if not deleted:
        raise NotFoundException("Conversation not found")
    return None


@router.get("/{conversation_id}/messages", response_model=PaginatedMessages, status_code=status.HTTP_200_OK)
async def list_messages(
    conversation_id: uuid.UUID,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List messages for a conversation, verifying user ownership first."""
    conv_repo = ConversationRepository(db)
    conv = await conv_repo.get_by_id(conversation_id=conversation_id, user_id=current_user.id)
    if not conv:
        raise NotFoundException("Conversation not found")

    msg_repo = MessageRepository(db)
    items, total = await msg_repo.list_messages_for_conversation(
        conversation_id=conversation_id, limit=limit, offset=offset
    )

    return PaginatedMessages(
        items=items,
        limit=limit,
        offset=offset,
        total=total,
        has_next=(offset + limit) < total,
    )
