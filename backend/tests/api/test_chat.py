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
