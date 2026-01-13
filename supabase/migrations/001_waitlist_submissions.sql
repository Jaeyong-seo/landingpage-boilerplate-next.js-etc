-- Waitlist submissions (recommended schema)
create table if not exists public.waitlist_submissions (
  id uuid primary key,
  email text unique not null,
  name text,
  message text,
  created_at timestamptz not null default now(),
  metadata jsonb
);

-- Indexes (recommended)
create index if not exists waitlist_submissions_created_at_idx
  on public.waitlist_submissions (created_at desc);

-- RLS (recommended)
-- Turn RLS on. With no policies, only service role can access (bypasses RLS).
alter table public.waitlist_submissions enable row level security;

-- Optional: allow anonymous inserts ONLY if you switch to anon key usage from the browser.
-- For this boilerplate we recommend keeping writes server-side via /api/waitlist.
--
-- create policy "allow_anon_insert"
-- on public.waitlist_submissions
-- for insert
-- to anon
-- with check (true);

