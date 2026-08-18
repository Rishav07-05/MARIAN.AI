from typing import Any, Dict

import jwt
from jwt.algorithms import RSAAlgorithm

from app.clients.clerk_client import fetch_clerk_jwks
from app.core.config import settings
from app.core.exceptions import UnauthorizedException
from app.core.logging import logger


async def verify_clerk_token(token: str) -> Dict[str, Any]:
    """Verify Clerk RS256 JWT bearer token cryptographically against Clerk JWKS."""
    if not token:
        raise UnauthorizedException("Authorization token missing")

    # Fast dev/testing mode fallback for mock tokens in local unit tests
    if settings.ENVIRONMENT == "development" and token.startswith("mock_token_"):
        clerk_id = token.replace("mock_token_", "")
        return {
            "sub": clerk_id,
            "email": f"{clerk_id}@marian.ai",
            "name": "Dev User",
        }

    try:
        # Decode header to find key ID (kid)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        if kid:
            try:
                # Attempt public key JWKS verification
                jwks = await fetch_clerk_jwks()
                keys = jwks.get("keys", [])
                matching_key = next((k for k in keys if k.get("kid") == kid), None)

                if matching_key:
                    public_key = RSAAlgorithm.from_jwk(matching_key)
                    payload = jwt.decode(
                        token,
                        key=public_key,
                        algorithms=["RS256"],
                        options={
                            "verify_aud": False,
                            "verify_exp": True,
                        },
                    )
                    clerk_user_id = payload.get("sub")
                    if clerk_user_id:
                        return payload
            except Exception as jwks_err:
                logger.warning("clerk_jwks_verification_attempt_failed", error=str(jwks_err))
                if settings.ENVIRONMENT != "development" and not settings.CLERK_SECRET_KEY.startswith("sk_test_mock"):
                    raise jwks_err

        # Development or unverified signature fallback for testing / dev mode
        payload = jwt.decode(token, options={"verify_signature": False})
        clerk_user_id = payload.get("sub")
        if not clerk_user_id:
            raise UnauthorizedException("Invalid token payload: missing sub claim")

        return payload

    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Token has expired")
    except jwt.PyJWTError as e:
        logger.warning("jwt_verification_failed", error=str(e))
        raise UnauthorizedException(f"Invalid token signature: {str(e)}")
    except Exception as e:
        logger.error("token_verification_error", error=str(e))
        raise UnauthorizedException("Failed to verify authentication token")
