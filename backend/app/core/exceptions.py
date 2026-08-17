from typing import Any, Dict, Optional

from fastapi import HTTPException, status


class MarianAPIException(HTTPException):
    """Base API Exception with structured error code and request ID tracking."""

    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=message)
        self.error_code = error_code
        self.message = message
        self.details = details or {}


class UnauthorizedException(MarianAPIException):
    def __init__(self, message: str = "Unauthenticated or invalid token"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="UNAUTHORIZED",
            message=message,
        )


class ForbiddenException(MarianAPIException):
    def __init__(self, message: str = "Access forbidden"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="FORBIDDEN",
            message=message,
        )


class NotFoundException(MarianAPIException):
    def __init__(self, message: str = "Requested resource not found"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND",
            message=message,
        )


class RateLimitException(MarianAPIException):
    def __init__(self, message: str = "Rate limit exceeded. Please try again later."):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code="RATE_LIMIT_EXCEEDED",
            message=message,
        )


class ValidationException(MarianAPIException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            message=message,
            details=details,
        )


class UpstreamServiceException(MarianAPIException):
    def __init__(self, message: str = "Upstream service failure"):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            error_code="UPSTREAM_ERROR",
            message=message,
        )
