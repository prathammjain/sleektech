-- ============================================================
-- SleekTech — admin dashboard schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run: uses IF NOT EXISTS / idempotent guards.
-- ============================================================

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------- status enums ----------
do $$ begin
  create type application_status as enum ('new','reviewing','accepted','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new','contacted','qualified','won','lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type client_status as enum ('active','paused','churned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('discovery','building','review','shipped','on_hold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type deliverable_status as enum ('todo','in_progress','blocked','done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type call_status as enum ('scheduled','completed','cancelled','no_show');
exception when duplicate_object then null; end $$;

-- ---------- applications (engineers) ----------
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null,
  role        text,
  linkedin    text,
  github      text,
  shipped     text,
  message     text,
  resume_url  text,
  status      application_status not null default 'new',
  notes       text
);

-- ---------- leads (companies / project briefs) ----------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null,
  email       text,
  phone       text,
  need        text,
  message     text,
  status      lead_status not null default 'new',
  notes       text
);

-- ---------- clients ----------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null,
  company     text,
  contact     text,
  status      client_status not null default 'active',
  lead_id     uuid references public.leads(id) on delete set null,
  notes       text
);

-- ---------- projects ----------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  title       text not null,
  client_id   uuid references public.clients(id) on delete cascade,
  status      project_status not null default 'discovery',
  start_date  date,
  due_date    date,
  notes       text
);

-- ---------- deliverables ----------
create table if not exists public.deliverables (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  title       text not null,
  project_id  uuid references public.projects(id) on delete cascade,
  status      deliverable_status not null default 'todo',
  due_date    date,
  notes       text
);

-- ---------- calls ----------
create table if not exists public.calls (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  client_id   uuid references public.clients(id) on delete set null,
  scheduled_at timestamptz,
  purpose     text,
  outcome     text,
  status      call_status not null default 'scheduled',
  notes       text
);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['applications','leads','clients','projects','deliverables','calls']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- Row Level Security ----------
-- RLS is enabled with NO policies. The anon/public key therefore cannot
-- read or write any row. All access is performed by the app's server code
-- using the SERVICE ROLE key, which bypasses RLS. This keeps every table
-- private behind the admin password gate.
alter table public.applications  enable row level security;
alter table public.leads         enable row level security;
alter table public.clients       enable row level security;
alter table public.projects      enable row level security;
alter table public.deliverables  enable row level security;
alter table public.calls         enable row level security;

-- ---------- Storage bucket for resumes (private) ----------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- ============================================================
-- Done. No public policies are created on purpose — the service
-- role key (server-only) is the single way in.
-- ============================================================
