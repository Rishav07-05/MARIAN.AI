import uuid

import pytest
from httpx import AsyncClient

from app.db.models.conversation import Conversation
from app.db.models.user import User


@pytest.mark.asyncio
async def test_unauthenticated_request_rejected(client: AsyncClient):
    """Verify endpoints reject requests missing authorization headers."""
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401

    resp = await client.get("/api/v1/conversations")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_user_cannot_access_other_user_conversation(
    client: AsyncClient,
    db_session,
    user_a: User,
    user_b: User,
    auth_headers_user_a: dict,
    auth_headers_user_b: dict,
):
    """IDOR SECURITY TEST: User B cannot view User A's conversation."""
    # User A creates a conversation
    conv_a = Conversation(id=uuid.uuid4(), user_id=user_a.id, title="User A Secret Architecture")
    db_session.add(conv_a)
    await db_session.commit()

    # User A accesses own conversation -> HTTP 200
    resp_a = await client.get(
        f"/api/v1/conversations/{conv_a.id}",
        headers={"Authorization": f"Bearer mock_token_{user_a.clerk_user_id}"},
    )
    assert resp_a.status_code == 200
    assert resp_a.json()["title"] == "User A Secret Architecture"

    # User B attempts to access User A's conversation -> HTTP 404 (Prevent resource existence leakage)
    resp_b = await client.get(
        f"/api/v1/conversations/{conv_a.id}",
        headers={"Authorization": f"Bearer mock_token_{user_b.clerk_user_id}"},
    )
    assert resp_b.status_code == 404
    assert resp_b.json()["error"]["code"] == "NOT_FOUND"


@pytest.mark.asyncio
async def test_user_cannot_delete_other_user_conversation(
    client: AsyncClient,
    db_session,
    user_a: User,
    user_b: User,
):
    """IDOR SECURITY TEST: User B cannot delete User A's conversation."""
    conv_a = Conversation(id=uuid.uuid4(), user_id=user_a.id, title="User A Private Thread")
    db_session.add(conv_a)
    await db_session.commit()

    # User B attempts to delete User A's conversation
    resp = await client.delete(
        f"/api/v1/conversations/{conv_a.id}",
        headers={"Authorization": f"Bearer mock_token_{user_b.clerk_user_id}"},
    )
    assert resp.status_code == 404
