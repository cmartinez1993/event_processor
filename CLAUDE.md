# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                      # install dependencies

# First-time DB setup (after filling in DATABASE_URL in .env):
npx prisma migrate dev           # create tables and apply migrations

# Development:
npm run server                   # start API server on http://127.0.0.1:3000
npm run client                   # start UI server on http://127.0.0.1:3001
```

Both processes must run simultaneously. Open http://127.0.0.1:3001 in a browser to use the UI.

## Database setup

Copy `.env` and set `DATABASE_URL` to a valid PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/events_processor?schema=public"
```

Then run `npx prisma migrate dev` to create the `events` table. The Prisma schema lives in `prisma/schema.prisma`; the generated client is written to `generated/prisma/` (gitignored, recreate with `npx prisma generate`).

## Architecture

Two independent Fastify servers, each a single file:

- **`server.js`** — REST API (port 3000). Persists events to PostgreSQL via Prisma (`prisma.event.*`). Routes: `POST /events`, `GET /events`, `GET /events/:id`, `DELETE /events`. CORS is enabled with `origin: true`. `.env` is loaded by Node's `--env-file` flag (set in the npm script).

- **`client.js`** — UI server (port 3001). Serves a single-page HTML control panel as a template literal. The page makes `fetch()` calls directly to `http://127.0.0.1:3000`. All UI markup, styles, and JS live inside the template string in this file.

## Key details

- ES modules throughout (`"type": "module"` in package.json); use `import`/`export`, not `require`.
- Event model fields: `id` (UUID), `type` (String, indexed), `payload` (Json), `timestamp` (DateTime), `receivedAt` (DateTime). Prisma returns `DateTime` fields as JS `Date` objects; Fastify serializes them to ISO strings automatically.
- **Prisma v7 connection model**: `prisma.config.ts` provides the URL to the CLI (migrations, introspection). The runtime client requires a driver adapter — `PrismaPg` from `@prisma/adapter-pg` — passed to the `PrismaClient` constructor. Neither `url` in the schema nor `datasourceUrl` in the constructor are supported in v7.
- No build step, no transpilation, no tests, no linter configured.
