from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.clients.redis_client import close_redis, init_redis
from app.core.config import settings
from app.core.exceptions import MarianAPIException
from app.core.logging import logger, setup_logging
from app.db.base import Base
from app.db.session import engine
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

# Initialize logging configuration
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan manager for resource initialization and clean shutdown."""
    logger.info("marian_backend_starting", env=settings.ENVIRONMENT)

    # Auto-create tables in dev environment
    if settings.ENVIRONMENT == "development":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("database_tables_verified")

    # Initialize Redis connection
    await init_redis()

    yield

    logger.info("marian_backend_shutting_down")
    await close_redis()
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Health", "description": "Liveness & Readiness probe endpoints"},
        {"name": "Authentication", "description": "Clerk session identity endpoints"},
        {"name": "Users", "description": "User profile management"},
        {"name": "Chat", "description": "MARIAN model SSE token streaming completions"},
        {"name": "Conversations", "description": "User conversation & message persistence"},
        {"name": "Integrations", "description": "Google Calendar OAuth 2.0 integration management"},
        {"name": "Calendar", "description": "User calendar & event listing endpoints"},
    ],
)

# Configure Middleware Stack
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
app.add_middleware(RequestIDMiddleware)


# Centralized Exception Handlers
@app.exception_handler(MarianAPIException)
async def marian_api_exception_handler(request: Request, exc: MarianAPIException):
    request_id = getattr(request.state, "request_id", None)
    logger.warning(
        "api_exception",
        error_code=exc.error_code,
        status_code=exc.status_code,
        message=exc.message,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id,
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please contact support.",
                "request_id": request_id,
            }
        },
    )


# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)
