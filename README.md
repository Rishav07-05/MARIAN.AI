# MARIAN.AI — Production AI Platform

MARIAN.AI is an AI assistant platform built with a modern Next.js 16 App Router frontend and a Python FastAPI backend.

## Workspace Architecture

```
MARIAN-AI/
├── frontend/             # Next.js 16 App Router (TypeScript + Tailwind CSS)
│   ├── src/             # App components, pages, hooks, services
│   ├── public/          # Static assets & brand media
│   ├── package.json     # Node dependencies
│   └── .env.local       # Frontend environment variables
│
├── backend/              # Python FastAPI Clean Architecture
│   ├── app/             # API routes, services, repositories, DB models
│   ├── tests/           # Pytest unit, integration, and security test suites
│   ├── Dockerfile       # Production non-root backend container
│   ├── docker-compose.yml # Postgres 16 & Redis 7 stack
│   ├── requirements.txt # Python dependencies
│   └── .env             # Backend environment variables
│
└── package.json         # Workspace root execution scripts
```

## Quick Start Guide

### 1. Launch Backend Services & Database
```bash
# Start PostgreSQL 16 & Redis 7
cd backend
docker compose up -d postgres redis

# Launch FastAPI Server
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Launch Next.js Frontend
```bash
npm run dev:frontend
```

### 3. Run Backend Verification Tests
```bash
npm run test:backend
```
