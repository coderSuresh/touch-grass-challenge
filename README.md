# Touch Grass Challenge

This project is the Touch Grass Challenge for the Hacktoberfest 2026 `#### Week 1 DEV Challenge`.

Touch Grass Challenge creates personalized outdoor plans with AI. The project contains a Next.js frontend and a NestJS API backed by PostgreSQL and Prisma.

## Prerequisites

- Node.js 20 or newer
- PostgreSQL
- Ollama with the configured model available locally

## Setup

Install dependencies in both packages:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/touch_grass"
PORT=3001
FRONTEND_URL="http://localhost:3000"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="gemma4:7.5b"
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Make sure the PostgreSQL database exists, then generate Prisma Client, apply migrations, and optionally seed sample data:

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

If using Ollama locally, pull the configured model before starting the API:

```powershell
ollama pull gemma4:7.5b
```

## Run locally

Start the backend and frontend in separate terminals:

```powershell
cd backend
npm run start:dev
```

```powershell
cd frontend
npm run dev
```

The frontend is available at [http://localhost:3000](http://localhost:3000). The API runs at [http://localhost:3001](http://localhost:3001), with a health check at [http://localhost:3001/health](http://localhost:3001/health).

## Useful commands

### Backend

```powershell
npm run build
npm run lint
npm test
npm run test:e2e
```

### Frontend

```powershell
npm run build
npm run lint
```

Run these commands from the corresponding `backend` or `frontend` directory.

## Project structure

```text
backend/   NestJS API, Prisma schema, migrations, and AI integration
frontend/  Next.js application and client-side state
```
