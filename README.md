# Next.js Landing & Waitlist Boilerplate

A lightweight boilerplate to ship a **landing page + waiting list** fast, with optional “real ops” integrations (storage, notifications, analytics, CMS) that **never block local/dev by default**.

## Tech stack
- **Next.js (App Router)** + Server Components
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod** (shared validation)
- Optional: **Supabase** (storage), **Discord Webhook** (notify), **PostHog** (analytics), **Sanity** (CMS)

## Quick start (step-by-step)

### 0) Prerequisites
- Node.js **LTS**
- `npm`

Verify:

```bash
node -v
npm -v
```

### 1) Install

```bash
npm install
```

Verify:

```bash
npm run lint
npm run typecheck
```

### 2) Env (optional)
All integrations are optional. You can run without any env set.

- Copy `.env.example` → `.env.local`

Verify env format + enabled/disabled flags:

```bash
npm run verify:env
```

### 3) Run locally

```bash
npm run dev
```

Verify:
- `GET /api/health` should return `{ ok: true }`
- `GET /api/diagnostics` shows which integrations are enabled
- Submit the waitlist form on `/`

### 4) One-shot verification

```bash
npm run verify
```

## Feature verification checklist
- **Waitlist API**: `POST /api/waitlist` returns `200` (or `409` for duplicates)
- **Spam prevention**:
  - Duplicate email returns `409`
  - Honeypot field is silently accepted (to reduce bot feedback)
  - Rate limit returns `429` after repeated rapid requests
- **Admin**:
  - If `ADMIN_TOKEN` unset: `/admin` shows “disabled”
  - If `ADMIN_TOKEN` set: `/admin?token=...` shows recent submissions and search

## Optional integrations

### Supabase storage (optional)
Set env:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

Recommended migration:
- Run the SQL in [`supabase/migrations/001_waitlist_submissions.sql`](/Users/seojaeyong/landingpage-boilerplate-next.js-etc/supabase/migrations/001_waitlist_submissions.sql)

Notes:
- **RLS enabled** is recommended. With **no policies**, only service role can access (service role bypasses RLS).
- This boilerplate writes server-side via `/api/waitlist` (recommended), so you typically do **not** need anon policies.

Expected table example (minimal):

```sql
create table if not exists public.waitlist_submissions (
  id uuid primary key,
  email text unique not null,
  name text,
  message text,
  created_at timestamptz not null default now(),
  metadata jsonb
);
```

Verify (table exists + write + read):

```bash
npm run verify:integrations
```

### Discord webhook (optional)
Set:
- `DISCORD_WEBHOOK_URL`

Behavior:
- A new submission posts a message to Discord (errors are ignored so core flow never breaks).

### PostHog analytics (optional)
Set:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST` (optional, defaults to `https://app.posthog.com`)

Behavior:
- Client initializes PostHog and captures `waitlist_submitted`.

Verify:
- Sends a server-side test event `verify_integrations` via PostHog capture endpoint

```bash
npm run verify:integrations
```

### Sanity CMS (optional)
Set:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`

Behavior:
- If a `landing` document exists with `heroTitle` / `heroSubtitle`, the hero section can be CMS-driven.

Schema:
- Copy [`sanity/schemaTypes/landing.ts`](/Users/seojaeyong/landingpage-boilerplate-next.js-etc/sanity/schemaTypes/landing.ts) into your Sanity Studio project schema types.

Content creation guide (minimal):
- Create a document of type `landing`
- Fill `heroTitle` and/or `heroSubtitle`

Verify (fetch):

```bash
npm run verify:integrations
```

## Deployment (Vercel)
- Deploy as a standard Next.js app
- Add the env vars you need (all are optional)

