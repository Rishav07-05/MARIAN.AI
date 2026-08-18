# MARIAN.AI — Production FastAPI Backend

High-performance, secure, modular Python FastAPI backend powering the **MARIAN.AI** platform.

## Key Features

- **FastAPI & Async SQLAlchemy 2.x**: Asynchronous database interaction using `asyncpg` with PostgreSQL.
- **Clerk Identity Authentication**: Cryptographic RS256 JWT verification against Clerk's JWKS endpoints.
- **Strict IDOR Protection**: Every single query enforces strict user ownership (`user_id = current_user.id`).
- **Fernet Token Encryption**: At-rest AES-128-CBC encryption for stored Google Calendar OAuth tokens.
- **LLM Service Abstraction**: SSE (Server-Sent Events) streaming token endpoint for real-time model interaction (`POST /api/v1/chat`).
- **Redis Rate Limiting**: Sliding-window rate limiter protecting API routes.
- **Docker Compose Setup**: Non-root containerization for backend, PostgreSQL, and Redis.

## Project Structure

```
backend/
├── alembic/              # Database migration scripts
├── app/
│   ├── api/             # API v1 routes (health, auth, users, chat, conversations, integrations, calendar)
│   ├── clients/         # External service clients (Clerk JWKS, MARIAN model, Redis)
│   ├── core/            # Configuration, logging, exception handlers, security
│   ├── db/              # SQLAlchemy session and models (User, Conversation, Message, Integration)
│   ├── dependencies/    # FastAPI authentication and DB dependencies
│   ├── middleware/      # Rate limiting, request ID tracking, security headers
│   ├── repositories/    # Data access layer with IDOR boundaries
│   ├── schemas/         # Pydantic schemas and DTOs
│   ├── services/        # LLM streaming and Google OAuth business services
│   └── utils/           # Fernet encryption helpers
├── tests/               # Unit, integration, and security test suites
├── Dockerfile           # Non-root production container spec
├── docker-compose.yml   # Multi-container stack definition
└── pyproject.toml       # Python dependencies and tool configuration
```

## Running Locally

### 1. Install Dependencies

```bash
python3 -m pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Launch Services with Docker Compose

```bash
docker-compose up -d --build
```

### 4. Run Pytest Test Suite & Linter

```bash
python3 -m pytest
python3 -m ruff check .
    
```
