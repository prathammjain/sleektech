-- ============================================================
-- SleekTech — testimonials table
-- Run this in Supabase SQL editor (Dashboard → SQL → New query).
-- ============================================================

do $$ begin
  create type testimonial_platform as enum ('linkedin','twitter','instagram','website','other');
exception when duplicate_object then null; end $$;

create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  name           text not null,
  role           text,
  company        text,
  quote          text not null,
  caption        text,
  image_url      text,
  social_url     text,
  social_platform testimonial_platform default 'linkedin',
  display_order  integer not null default 0,
  active         boolean not null default true
);

-- updated_at trigger
drop trigger if exists set_updated_at on public.testimonials;
create trigger set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- RLS — no public reads; all access via service role through the admin
alter table public.testimonials enable row level security;

-- Public anon read policy — the landing page needs to read active testimonials
-- via server-side fetch (service role), so this is read-only for the anon key.
-- Since we only use the service-role key server-side, this stays locked down.
-- Uncomment below ONLY if you switch to a client-side anon fetch:
-- create policy "public read active" on public.testimonials
--   for select using (active = true);

-- Storage bucket for testimonial media (public — these are meant to be seen
-- by every visitor, so public URLs keep the landing page static and fast).
insert into storage.buckets (id, name, public)
values ('testimonials', 'testimonials', true)
on conflict (id) do update set public = true;

-- Allow public read of objects in the testimonials bucket.
do $$ begin
  create policy "public read testimonials media"
    on storage.objects for select
    using (bucket_id = 'testimonials');
exception when duplicate_object then null; end $$;

-- ============================================================
-- Done. After running this, add testimonials in the admin
-- dashboard at /admin/testimonials.
-- ============================================================
