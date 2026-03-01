# Architecture

## Overview

notes-app is a Next.js 16 App Router application. There is no separate backend — server logic lives in React Server Components and Next.js Server Actions alongside the UI. The database is Neon (serverless Postgres), accessed via Drizzle ORM.

```
Browser → Next.js (Vercel) → Neon (Postgres)
                ↕
          Auth.js v5 (Google OAuth, database sessions)
```

## Request Flow

### Page load (`/notes`)

1. RSC renders `src/app/notes/page.tsx` on the server
2. `auth()` is called — reads the session from the `session` table in Postgres
3. If no session → redirect to `/login`
4. Notes are fetched from the `note` table filtered by `userId`
5. HTML is streamed to the browser; client components (`NoteForm`, `DeleteButton`, `SignOutButton`) hydrate

### Create / delete a note

1. Client component calls a Server Action (`createNote` / `deleteNote` from `src/actions/notes.ts`)
2. Server Action calls `auth()` to get the current user ID — ownership is enforced server-side
3. Drizzle executes the query against Neon over HTTP
4. `revalidatePath("/notes")` invalidates the RSC cache → page re-renders with fresh data

### Authentication

1. User clicks "Sign in with Google" → redirected to `/api/auth/signin`
2. Auth.js handles the Google OAuth flow and creates a session row in Postgres
3. Session token is stored in a cookie; subsequent requests look up the session in the DB
4. On sign-out, the session row is deleted

## Key Design Decisions

**Server Actions instead of an API layer.** There are no `/api/` routes for data — mutations go through Server Actions. This eliminates a layer of boilerplate (no fetch calls, no request parsing, no route handlers) while keeping server-only code out of the client bundle.

**Database sessions, not JWT.** Auth.js is configured with `strategy: "database"`. Sessions are rows in Postgres, not signed tokens. This makes session revocation instant (delete the row) at the cost of one extra DB read per request.

**Zod env validation at startup.** `src/lib/env.ts` parses `process.env` through a Zod schema on import. The app throws immediately on startup if any required variable is missing, rather than failing silently at runtime.

**Two Drizzle configs.** `drizzle.config.ts` reads from `.env` (local dev). `drizzle.migrate.config.ts` reads from `.env.local` (CI, where GitLab CI injects vars into `.env.local`). Both point to the same schema and migrations directory.

**Neon serverless HTTP driver.** `src/db/index.ts` uses `drizzle-orm/neon-http` rather than a persistent TCP connection. This is the correct driver for serverless/edge environments (Vercel functions) where connections are not kept alive between requests.

## Module Map

```
src/
  lib/
    env.ts        Zod-validated env vars — import from here, never process.env
    auth.ts       Auth.js config: Google provider, Drizzle adapter, session callback
  db/
    index.ts      Drizzle client (Neon HTTP driver)
    schema.ts     All table definitions: Auth.js tables + note
  actions/
    notes.ts      createNote, deleteNote — auth-guarded server actions
  app/
    page.tsx              Root: redirects to /notes or /login based on session
    login/page.tsx        Sign-in page
    notes/
      page.tsx            RSC: fetches and lists notes
      NoteForm.tsx        Client component: create note form
      DeleteButton.tsx    Client component: delete button per note
      SignOutButton.tsx   Client component: sign-out button
    api/auth/[...nextauth]/
      route.ts            Auth.js route handler (GET + POST)
```

## CI/CD Pipeline

```
push to any branch
  └── test (lint)

push to main
  ├── test (lint)
  ├── build  →  .vercel/output/ artifact
  ├── migrate  →  bun db:migrate:ci against production DB
  └── deploy  →  Vercel (prebuilt artifact)
```

Migration runs before deploy, so the schema is always up to date before new code goes live.
