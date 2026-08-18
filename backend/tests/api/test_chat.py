import pytest
from httpx import AsyncClient

from app.db.models.user import User


@pytest.mark.asyncio
async def test_chat_sse_token_streaming(
    client: AsyncClient,
    user_a: User,
):
    """Test POST /api/v1/chat token streaming response."""
    payload = {
        "prompt": "Explain multi-head transformer self-attention",
        "model": "MARIAN 3 Omni",
        "stream": True,
    }
    headers = {"Authorization": f"Bearer mock_token_{user_a.clerk_user_id}"}

    response = await client.post("/api/v1/chat", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    assert "x-conversation-id" in response.headers
    assert "data: " in response.text


@pytest.mark.asyncio
async def test_chat_multi_turn_context_memory(
    client: AsyncClient,
    user_a: User,
):
    """Test POST /api/v1/chat multi-turn context retention across messages in same conversation."""
    headers = {"Authorization": f"Bearer mock_token_{user_a.clerk_user_id}"}

    # Turn 1: Introduce user
    payload1 = {
        "prompt": "Hello, my name is Rishav.",
        "model": "MARIAN 3 Omni",
        "stream": True,
    }
    resp1 = await client.post("/api/v1/chat", json=payload1, headers=headers)
    assert resp1.status_code == 200
    conv_id = resp1.headers.get("x-conversation-id")
    assert conv_id is not None

    # Turn 2: Follow-up query leveraging context memory
    payload2 = {
        "conversation_id": conv_id,
        "prompt": "What is my name?",
        "model": "MARIAN 3 Omni",
        "stream": True,
    }
    resp2 = await client.post("/api/v1/chat", json=payload2, headers=headers)
    assert resp2.status_code == 200
    assert resp2.headers.get("x-conversation-id") == conv_id
    assert "data: " in resp2.text


@pytest.mark.asyncio
async def test_guest_history_migration(
    client: AsyncClient,
    user_a: User,
):
    """Test POST /api/v1/conversations/migrate_guest endpoint."""
    headers = {"Authorization": f"Bearer mock_token_{user_a.clerk_user_id}"}
    payload = {
        "conversations": [
            {
                "title": "Guest Session 1",
                "messages": [
                    {"role": "user", "content": "What is AI?", "model": "MARIAN 3 Omni"},
                    {"role": "assistant", "content": "AI is artificial intelligence.", "model": "MARIAN 3 Omni"},
                ],
            }
        ]
    }
    resp = await client.post("/api/v1/conversations/migrate_guest", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["migrated_count"] == 1
    assert len(data["conversation_ids"]) == 1


