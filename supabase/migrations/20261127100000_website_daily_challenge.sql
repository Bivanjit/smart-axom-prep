-- Website-first CEE challenge content. Public students can only read published challenges;
-- publishing and editing remain restricted to SmartPrep administrators.
create table if not exists public.website_daily_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_date date not null unique,
  title text not null default 'Daily 10',
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  duration_seconds int not null default 600 check (duration_seconds between 60 and 3600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create table if not exists public.website_daily_challenge_questions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.website_daily_challenges(id) on delete cascade,
  position int not null check (position between 1 and 10),
  subject text not null check (subject in ('Physics','Chemistry','Mathematics')),
  chapter text,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options)='array' and jsonb_array_length(options)=4),
  correct_option_index int not null check (correct_option_index between 0 and 3),
  explanation text,
  difficulty text check (difficulty in ('easy','moderate','hard')),
  created_at timestamptz not null default now(),
  unique(challenge_id,position)
);
alter table public.website_daily_challenges enable row level security;
alter table public.website_daily_challenge_questions enable row level security;
drop policy if exists website_daily_challenges_public_read on public.website_daily_challenges;
create policy website_daily_challenges_public_read on public.website_daily_challenges
  for select to anon, authenticated using (status='published');
drop policy if exists website_daily_challenges_admin_manage on public.website_daily_challenges;
create policy website_daily_challenges_admin_manage on public.website_daily_challenges
  for all to authenticated using (public.is_smartprep_admin()) with check (public.is_smartprep_admin());
drop policy if exists website_daily_questions_public_read on public.website_daily_challenge_questions;
create policy website_daily_questions_public_read on public.website_daily_challenge_questions
  for select to anon, authenticated using (
    exists (select 1 from public.website_daily_challenges c
      where c.id=challenge_id and c.status='published')
  );
drop policy if exists website_daily_questions_admin_manage on public.website_daily_challenge_questions;
create policy website_daily_questions_admin_manage on public.website_daily_challenge_questions
  for all to authenticated using (public.is_smartprep_admin()) with check (public.is_smartprep_admin());
grant select on public.website_daily_challenges, public.website_daily_challenge_questions to anon, authenticated;
grant insert, update, delete on public.website_daily_challenges, public.website_daily_challenge_questions to authenticated;
