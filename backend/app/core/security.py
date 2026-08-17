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

        if not kid:
            raise UnauthorizedException("Invalid token header: missing key ID")

        # Get public keys from Clerk
        jwks = await fetch_clerk_jwks()
        keys = jwks.get("keys", [])

        matching_key = next((k for k in keys if k.get("kid") == kid), None)
        if not matching_key:
            raise UnauthorizedException("Unknown token signing key")

        # Convert JWK to RSA public key
        public_key = RSAAlgorithm.from_jwk(matching_key)

        # Decode & verify payload
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
