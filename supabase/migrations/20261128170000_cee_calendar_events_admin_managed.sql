-- Admin-managed official and planning calendar for Assam CEE.
create table if not exists public.cee_calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('application','application_deadline','exam','admit_card','answer_key','result','counselling','choice_filling','seat_allotment','admission','other')),
  title text not null check (length(trim(title)) between 2 and 180),
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  date_label text,
  status text not null default 'draft' check (status in ('draft','published','cancelled')),
  authority text,
  official_url text,
  notify_on_publish boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cee_calendar_events_public_dates_idx on public.cee_calendar_events (status, starts_at);
alter table public.cee_calendar_events enable row level security;
revoke all on table public.cee_calendar_events from anon, authenticated;
grant select on table public.cee_calendar_events to anon, authenticated;
grant insert, update, delete on table public.cee_calendar_events to authenticated;
drop policy if exists "Public can read published CEE calendar events" on public.cee_calendar_events;
create policy "Public can read published CEE calendar events" on public.cee_calendar_events
for select to anon, authenticated
using (status = 'published' or (select public.is_smartprep_admin()));
drop policy if exists "Admins can insert CEE calendar events" on public.cee_calendar_events;
create policy "Admins can insert CEE calendar events" on public.cee_calendar_events
for insert to authenticated with check ((select public.is_smartprep_admin()));
drop policy if exists "Admins can update CEE calendar events" on public.cee_calendar_events;
create policy "Admins can update CEE calendar events" on public.cee_calendar_events
for update to authenticated using ((select public.is_smartprep_admin())) with check ((select public.is_smartprep_admin()));
drop policy if exists "Admins can delete CEE calendar events" on public.cee_calendar_events;
create policy "Admins can delete CEE calendar events" on public.cee_calendar_events
for delete to authenticated using ((select public.is_smartprep_admin()));
