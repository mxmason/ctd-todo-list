# CTD Capstone

A full-stack todo application. TypeScript monorepo with an Express API and a React frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 8, CSS Modules |
| Backend | Node 20+, Express 5, Prisma 7 |
| Database | PostgreSQL |
| Language | TypeScript 6 |
| Testing | Vitest |

## Project Structure

```
ctd-capstone/
├── client/      # React frontend (Vite)
├── server/      # Express API (Prisma + Postgres)
├── shared/      # Types and utilities shared between workspaces
└── package.json # Root workspace — dev/build/test scripts run both
```

## Prerequisites

- **Node.js** ≥ 20.19 (`node --version`)
- **PostgreSQL** 14+ (see setup below)

### PostgreSQL setup

**Install** (macOS via Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Create a user** matching the credentials in `.env.example` (`postgres` / `postgres`):
```bash
psql postgres
```
```sql
CREATE USER postgres WITH PASSWORD 'postgres' CREATEDB;
```

**Create the databases** (the test DB must be separate — the test suite truncates its tables between runs):
```sql
CREATE DATABASE ctd_capstone OWNER postgres;
CREATE DATABASE ctd_capstone_test OWNER postgres;
\q
```

## Dev Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env if your Postgres credentials differ from the defaults
   ```
   This file is read by both the Prisma CLI and the dev server (`node --env-file`).

3. **Run migrations**
   ```bash
   npm run db:migrate --workspace=server
   ```

4. **Start the dev servers**
   ```bash
   npm run dev
   ```
   - API: http://localhost:3001
   - Client: http://localhost:3000

## Environment Variables

All env vars live in `server/.env` (loaded via `node --env-file`). See [server/.env.example](server/.env.example) for the full reference.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/ctd_capstone` | Main Postgres connection string |
| `TEST_DATABASE_URL` | For tests | `postgresql://postgres:postgres@localhost:5432/ctd_capstone_test` | Separate DB used by the test suite |
| `AUTH_SECRET` | Production only | random ephemeral | Secret for signing session JWTs |
| `PORT` | No | `3001` | Port the API listens on |
| `CLIENT_ORIGIN` | No | `http://localhost:3000` | Allowed CORS origin |

## Available Scripts

All scripts run from the repo root unless noted.

| Script | Description |
|---|---|
| `npm run dev` | Start API and client in watch mode (concurrently) |
| `npm run build` | Build client for production |
| `npm test` | Run all test suites |
| `npm run typecheck` | Type-check all workspaces |
| `npm run lint` | Lint and auto-fix all workspaces |
| `npm run db:migrate --workspace=server` | Run pending Prisma migrations |
| `npm run db:generate --workspace=server` | Regenerate Prisma client after schema changes |
| `npm run db:studio --workspace=server` | Open Prisma Studio (DB browser) |
| `npm run db:deploy --workspace=server` | Apply migrations in production (no prompts) |

> **Deployment note:** `prisma` (the CLI) is a devDependency. `db:deploy` must run in an environment where devDependencies are installed, or where the `prisma` package is available by other means. A plain `npm install --omit=dev` followed by `db:deploy` will fail.

## Testing

```bash
npm test
```

Tests run with Vitest against the `TEST_DATABASE_URL` database. The suite truncates tables between tests — keep it pointed at a dedicated test database, never your main one.
