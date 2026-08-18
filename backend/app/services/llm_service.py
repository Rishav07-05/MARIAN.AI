import json
import uuid
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.llm_client import MARIANLLMClient
from app.db.models.user import User
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import ChatRequest


class LLMService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.client = MARIANLLMClient()

    async def handle_chat_stream(
        self, request: ChatRequest, current_user: User
    ) -> tuple[uuid.UUID, AsyncGenerator[str, None]]:
        conv_repo = ConversationRepository(self.db)
        msg_repo = MessageRepository(self.db)

        # 1. Resolve or create conversation
        if request.conversation_id:
            conv = await conv_repo.get_by_id(request.conversation_id, current_user.id)
            if not conv:
                conv = await conv_repo.create(current_user.id, title=request.prompt[:40])
        else:
            conv = await conv_repo.create(current_user.id, title=request.prompt[:40])

        # 2. Persist user prompt message
        await msg_repo.create_message(
            conversation_id=conv.id,
            role="user",
            content=request.prompt,
            model=request.model,
            token_count=len(request.prompt.split()),
        )

        # 3. Fetch conversation history for multi-turn context memory
        past_messages, _ = await msg_repo.list_messages_for_conversation(conv.id, limit=30)
        history = [
            {"role": msg.role, "content": msg.content}
            for msg in past_messages
        ]

        # 4. Stream generator wrapper that accumulates response & persists assistant message
        async def stream_wrapper() -> AsyncGenerator[str, None]:
            full_response = []
            async for chunk_str in self.client.generate_stream(request.prompt, request.model, history=history):
                yield chunk_str
                # Parse delta content to accumulate full message
                if chunk_str.startswith("data: "):
                    try:
                        payload = json.loads(chunk_str[6:].strip())
                        if "delta" in payload:
                            full_response.append(payload["delta"])
                    except Exception:
                        pass

            accumulated_content = "".join(full_response)
            if accumulated_content.strip():
                # Create session inside stream generator completion
                async with AsyncSession(self.db.bind) as new_db:
                    new_msg_repo = MessageRepository(new_db)
                    await new_msg_repo.create_message(
                        conversation_id=conv.id,
                        role="assistant",
                        content=accumulated_content,
                        model=request.model,
                        token_count=len(accumulated_content.split()),
                    )

        return conv.id, stream_wrapper()
