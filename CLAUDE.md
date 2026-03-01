# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev            # Start development server
bun build          # Production build
bun lint           # ESLint

bun db:generate    # Generate migrations from schema changes
bun db:migrate     # Run migrations (reads .env)
bun db:migrate:ci  # Run migrations in CI (reads .env.local)
bun db:studio      # Open Drizzle Studio
```

## Environment Variables

All env vars are validated at startup via Zod in `src/lib/env.ts`. Always import `env` from there — never use `process.env` directly.

Local dev uses `.env`, CI/migrations use `.env.local`. Required vars:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — Auth.js secret
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

## Architecture

**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Drizzle ORM, Neon (serverless Postgres), Auth.js v5, Bun.

**Key files:**
- `src/db/schema.ts` — all tables: Auth.js tables (`user`, `account`, `session`, `verificationToken`) + app table `note`
- `src/db/index.ts` — Drizzle client via Neon serverless HTTP driver
- `src/lib/auth.ts` — Auth.js config: Google OAuth, database sessions, Drizzle adapter
- `src/lib/env.ts` — Zod-validated env vars
- `src/actions/notes.ts` — server actions `createNote` / `deleteNote`, both guarded by session check
- `src/app/notes/` — notes page + client components (`NoteForm`, `DeleteButton`, `SignOutButton`)
- `src/app/api/auth/` — Auth.js route handler

**Auth:** Google OAuth only, database sessions (not JWT). Call `auth()` from `src/lib/auth.ts` in server actions and server components to get the current session and user ID.

**Data access:** Server actions in `src/actions/` get the user ID from the session, then query the DB directly via Drizzle. All note operations filter by `userId` to enforce ownership.

**Two Drizzle configs:** `drizzle.config.ts` (reads `.env`, for local `db:migrate`) and `drizzle.migrate.config.ts` (reads `.env.local`, for CI `db:migrate:ci`). Migrations live in `./migrations/`.
