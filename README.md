# notes-app

A minimal fullstack notes app with Google authentication. A learning project built on a modern production stack.

## Stack

- **Next.js 16** (App Router) — frontend and server logic
- **Drizzle ORM** + **Neon** (Postgres) — database and migrations
- **Auth.js v5** + Google OAuth — authentication with database sessions
- **Tailwind CSS v4** — styling
- **GitLab CI/CD** — pipeline with automatic deployment
- **Vercel** — hosting
- **Bun** — package manager and runtime

## Features

- Sign in with Google
- Create and delete notes
- Each user sees only their own notes

## Local Setup

### Prerequisites

- [Bun](https://bun.sh)
- A [Neon](https://neon.tech) account or local Postgres instance

### Install

```zsh
git clone git@gitlab.com:rozeraf/notes-app.git
cd notes-app
bun install
```

### Environment Variables

Create `.env.local` in the project root:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Generate `AUTH_SECRET`:

```zsh
openssl rand -base64 32
```

Get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs.

### Migrate and Run

```zsh
bun db:generate   # generate migrations from schema
bun db:migrate    # apply migrations (reads .env)
bun dev           # start dev server
```

Open `http://localhost:3000`.

## CI/CD

The GitLab CI pipeline has four stages:

- **test** — linting (all branches)
- **build** — build via Vercel CLI, artifact `.vercel/output/` (main only)
- **migrate** — apply migrations to the production DB (main only)
- **deploy** — deploy prebuilt artifact to Vercel (main only)

### GitLab CI Variables

Add in GitLab → Settings → CI/CD → Variables:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
DATABASE_URL
AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## Database Schema

Auth.js tables (`user`, `account`, `session`, `verificationToken`) are managed by `@auth/drizzle-adapter`. The app's own table:

```sql
CREATE TABLE note (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES user(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

For a deeper look at how the pieces fit together, see [ARCHITECTURE.md](./ARCHITECTURE.md).
