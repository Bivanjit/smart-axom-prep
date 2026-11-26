-- CEE intelligence system: additive, versioned schema. No existing tables are dropped or rewritten.
create table if not exists public.analytics_dataset_versions (
 id uuid primary key default gen_random_uuid(),
 dataset_key text not null,
 version text not null,
 label text not null,
 status text not null default 'draft' check(status in ('draft','published','archived')),
 source_description text,
 source_url text,
 verified_at timestamptz,
 published_at timestamptz,
 created_at timestamptz not null default now(),
 created_by uuid references auth.users(id),
 unique(dataset_key,version)
);
create table if not exists public.exam_papers (
 id uuid primary key default gen_random_uuid(),
 exam_name text not null default 'Assam CEE',
 exam_year int not null check(exam_year between 2000 and 2100),
 paper_name text,
 subject_id uuid references public.subjects(id),
 total_marks numeric,
 total_questions int,
 source_url text,
 dataset_version_id uuid references public.analytics_dataset_versions(id),
 status text not null default 'draft' check(status in ('draft','published','archived')),
 created_at timestamptz not null default now(),
 unique(exam_name,exam_year,paper_name,subject_id)
);
create table if not exists public.exam_questions (
 id uuid primary key default gen_random_uuid(),
 exam_paper_id uuid not null references public.exam_papers(id) on delete cascade,
 question_id uuid references public.questions(id),
 subject_id uuid not null references public.subjects(id),
 chapter_id uuid references public.chapters(id),
 topic_id uuid references public.topics(id),
 question_number int,
 difficulty text check(difficulty in ('easy','moderate','hard')),
 source_reference text,
 verified boolean not null default false,
 created_at timestamptz not null default now(),
 unique(exam_paper_id,question_number)
);
create table if not exists public.chapter_aliases (
 id uuid primary key default gen_random_uuid(),
 chapter_id uuid not null references public.chapters(id) on delete cascade,
 alias text not null,
 source text,
 created_at timestamptz not null default now(),
 unique(chapter_id,alias)
);
create table if not exists public.chapter_year_stats (
 id uuid primary key default gen_random_uuid(),
 dataset_version_id uuid not null references public.analytics_dataset_versions(id) on delete cascade,
 exam_year int not null check(exam_year between 2000 and 2100),
 subject_id uuid not null references public.subjects(id),
 chapter_id uuid not null references public.chapters(id),
 question_count int not null check(question_count>=0),
 classified_easy int not null default 0 check(classified_easy>=0),
 classified_moderate int not null default 0 check(classified_moderate>=0),
 classified_hard int not null default 0 check(classified_hard>=0),
 verified boolean not null default false,
 source_url text,
 unique(dataset_version_id,exam_year,chapter_id)
);
create table if not exists public.reference_chapter_counts (
 id uuid primary key default gen_random_uuid(),
 dataset_version_id uuid not null references public.analytics_dataset_versions(id) on delete cascade,
 subject_slug text not null check(subject_slug in ('physics','mathematics','chemistry')),
 chapter_name text not null,
 question_count int not null check(question_count>=0),
 source_label text not null default 'User-supplied SmartPrep Axom reference poster',
 verified_against_questions boolean not null default false,
 unique(dataset_version_id,subject_slug,chapter_name)
);
create table if not exists public.prediction_versions (
 id uuid primary key default gen_random_uuid(),
 version text not null unique,
 label text not null,
 model_type text not null check(model_type in ('reference_baseline','weighted_historical')),
 weights jsonb not null default '{"recent_3_year":0.40,"recent_5_year":0.35,"historical":0.25}'::jsonb,
 status text not null default 'draft' check(status in ('draft','published','archived')),
 source_description text,
 published_at timestamptz,
 created_at timestamptz not null default now(),
 created_by uuid references auth.users(id)
);
create table if not exists public.chapter_predictions (
 id uuid primary key default gen_random_uuid(),
 prediction_version_id uuid not null references public.prediction_versions(id) on delete cascade,
 subject_slug text not null check(subject_slug in ('physics','mathematics','chemistry')),
 chapter_name text not null,
 predicted_questions int not null check(predicted_questions>=0),
 likelihood text not null check(likelihood in ('high','moderate','lower','very_low')),
 confidence numeric check(confidence between 0 and 1),
 rationale text,
 unique(prediction_version_id,subject_slug,chapter_name)
);
create table if not exists public.prediction_model_settings (
 id uuid primary key default gen_random_uuid(),
 setting_key text not null unique,
 setting_value jsonb not null,
 updated_at timestamptz not null default now(),
 updated_by uuid references auth.users(id)
);
create table if not exists public.engineering_institutions (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 name text not null,
 city text,
 is_active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.engineering_branches (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 name text not null unique,
 is_active boolean not null default true
);
create table if not exists public.institution_branch_intakes (
 id uuid primary key default gen_random_uuid(),
 admission_year int not null check(admission_year between 2000 and 2100),
 institution_id uuid not null references public.engineering_institutions(id),
 branch_id uuid not null references public.engineering_branches(id),
 intake int check(intake>=0),
 quota text,
 source_document_id uuid,
 verification_status text not null default 'pending' check(verification_status in ('pending','verified','rejected')),
 unique(admission_year,institution_id,branch_id,quota)
);
create table if not exists public.admission_categories (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 name text not null
);
create table if not exists public.counselling_rounds (
 id uuid primary key default gen_random_uuid(),
 admission_year int not null check(admission_year between 2000 and 2100),
 round_code text not null,
 round_name text not null,
 unique(admission_year,round_code)
);
create table if not exists public.admission_source_documents (
 id uuid primary key default gen_random_uuid(),
 admission_year int check(admission_year between 2000 and 2100),
 title text not null,
 source_url text not null,
 storage_path text,
 document_type text not null check(document_type in ('cutoff','seat_matrix','allotment','merit_list','score_rank','other')),
 source_authority text not null default 'DTE Assam',
 verification_status text not null default 'pending' check(verification_status in ('pending','verified','rejected')),
 checksum text,
 notes text,
 created_at timestamptz not null default now(),
 verified_at timestamptz,
 verified_by uuid references auth.users(id)
);
create table if not exists public.admission_cutoffs (
 id uuid primary key default gen_random_uuid(),
 admission_year int not null check(admission_year between 2000 and 2100),
 institution_id uuid not null references public.engineering_institutions(id),
 branch_id uuid not null references public.engineering_branches(id),
 category_id uuid not null references public.admission_categories(id),
 counselling_round_id uuid not null references public.counselling_rounds(id),
 quota_code text not null default 'regular',
 opening_rank int check(opening_rank>0),
 closing_rank int check(closing_rank>0),
 seat_intake int check(seat_intake>=0),
 source_document_id uuid not null references public.admission_source_documents(id),
 verification_status text not null default 'pending' check(verification_status in ('pending','verified','rejected')),
 created_at timestamptz not null default now(),
 unique(admission_year,institution_id,branch_id,category_id,counselling_round_id,quota_code)
);
create table if not exists public.cee_score_rank_points (
 id uuid primary key default gen_random_uuid(),
 exam_year int not null check(exam_year between 2000 and 2100),
 total_marks numeric not null check(total_marks>0),
 score numeric not null check(score>=0 and score<=total_marks),
 merit_rank int not null check(merit_rank>0),
 percentile numeric check(percentile between 0 and 100),
 candidate_count int check(candidate_count>0),
 difficulty_context text,
 source_document_id uuid not null references public.admission_source_documents(id),
 verification_status text not null default 'pending' check(verification_status in ('pending','verified','rejected')),
 unique(exam_year,score,merit_rank)
);
create index if not exists idx_exam_questions_paper on public.exam_questions(exam_paper_id);
create index if not exists idx_exam_questions_chapter on public.exam_questions(chapter_id,subject_id);
create index if not exists idx_chapter_year_stats_subject_year on public.chapter_year_stats(subject_id,exam_year);
create index if not exists idx_admission_cutoffs_lookup on public.admission_cutoffs(admission_year,institution_id,branch_id,category_id,counselling_round_id);
create index if not exists idx_score_rank_year_score on public.cee_score_rank_points(exam_year,score desc);
create index if not exists idx_reference_chapter_subject on public.reference_chapter_counts(dataset_version_id,subject_slug);
create index if not exists idx_predictions_version_subject on public.chapter_predictions(prediction_version_id,subject_slug);
alter table public.analytics_dataset_versions enable row level security;
alter table public.exam_papers enable row level security;
alter table public.exam_questions enable row level security;
alter table public.chapter_aliases enable row level security;
alter table public.chapter_year_stats enable row level security;
alter table public.reference_chapter_counts enable row level security;
alter table public.prediction_versions enable row level security;
alter table public.chapter_predictions enable row level security;
alter table public.prediction_model_settings enable row level security;
alter table public.engineering_institutions enable row level security;
alter table public.engineering_branches enable row level security;
alter table public.institution_branch_intakes enable row level security;
alter table public.admission_categories enable row level security;
alter table public.counselling_rounds enable row level security;
alter table public.admission_source_documents enable row level security;
alter table public.admission_cutoffs enable row level security;
alter table public.cee_score_rank_points enable row level security;
do $$
declare t text;
begin
 foreach t in array array['analytics_dataset_versions','exam_papers','exam_questions','chapter_aliases','chapter_year_stats','reference_chapter_counts','prediction_versions','chapter_predictions','prediction_model_settings','engineering_institutions','engineering_branches','institution_branch_intakes','admission_categories','counselling_rounds','admission_source_documents','admission_cutoffs','cee_score_rank_points'] loop
  execute format('drop policy if exists %I on public.%I',t||'_admin_manage',t);
  execute format('create policy %I on public.%I for all to authenticated using (public.is_smartprep_admin()) with check (public.is_smartprep_admin())',t||'_admin_manage',t);
 end loop;
end $$;
drop policy if exists published_analytics_versions_read on public.analytics_dataset_versions;
create policy published_analytics_versions_read on public.analytics_dataset_versions for select to anon,authenticated using(status='published');
drop policy if exists published_exam_papers_read on public.exam_papers;
create policy published_exam_papers_read on public.exam_papers for select to anon,authenticated using(status='published');
drop policy if exists verified_exam_questions_read on public.exam_questions;
create policy verified_exam_questions_read on public.exam_questions for select to anon,authenticated using(verified and exists(select 1 from public.exam_papers p where p.id=exam_paper_id and p.status='published'));
drop policy if exists published_chapter_stats_read on public.chapter_year_stats;
create policy published_chapter_stats_read on public.chapter_year_stats for select to anon,authenticated using(verified and exists(select 1 from public.analytics_dataset_versions v where v.id=dataset_version_id and v.status='published'));
drop policy if exists published_reference_counts_read on public.reference_chapter_counts;
create policy published_reference_counts_read on public.reference_chapter_counts for select to anon,authenticated using(exists(select 1 from public.analytics_dataset_versions v where v.id=dataset_version_id and v.status='published'));
drop policy if exists published_prediction_versions_read on public.prediction_versions;
create policy published_prediction_versions_read on public.prediction_versions for select to anon,authenticated using(status='published');
drop policy if exists published_chapter_predictions_read on public.chapter_predictions;
create policy published_chapter_predictions_read on public.chapter_predictions for select to anon,authenticated using(exists(select 1 from public.prediction_versions v where v.id=prediction_version_id and v.status='published'));
drop policy if exists published_institutions_read on public.engineering_institutions;
create policy published_institutions_read on public.engineering_institutions for select to anon,authenticated using(is_active);
drop policy if exists published_branches_read on public.engineering_branches;
create policy published_branches_read on public.engineering_branches for select to anon,authenticated using(is_active);
drop policy if exists published_categories_read on public.admission_categories;
create policy published_categories_read on public.admission_categories for select to anon,authenticated using(true);
drop policy if exists published_rounds_read on public.counselling_rounds;
create policy published_rounds_read on public.counselling_rounds for select to anon,authenticated using(true);
drop policy if exists verified_intakes_read on public.institution_branch_intakes;
create policy verified_intakes_read on public.institution_branch_intakes for select to anon,authenticated using(verification_status='verified');
drop policy if exists verified_cutoffs_read on public.admission_cutoffs;
create policy verified_cutoffs_read on public.admission_cutoffs for select to anon,authenticated using(verification_status='verified' and exists(select 1 from public.admission_source_documents d where d.id=source_document_id and d.verification_status='verified'));
drop policy if exists verified_source_docs_read on public.admission_source_documents;
create policy verified_source_docs_read on public.admission_source_documents for select to anon,authenticated using(verification_status='verified');
drop policy if exists verified_score_rank_read on public.cee_score_rank_points;
create policy verified_score_rank_read on public.cee_score_rank_points for select to anon,authenticated using(verification_status='verified' and exists(select 1 from public.admission_source_documents d where d.id=source_document_id and d.verification_status='verified'));
-- Baseline data is intentionally tagged as reference-only and is not presented as measured live analytics.
insert into public.analytics_dataset_versions(dataset_key,version,label,status,source_description)
values('chapter_reference','poster-v1','SmartPrep Axom supplied PYQ analysis poster','published','User-provided chapter count posters. Counts are reference inputs and are not yet reconciled against question-level database records.')
on conflict(dataset_key,version) do nothing;
insert into public.prediction_versions(version,label,model_type,status,source_description)
values('cee-2027-baseline-v1','Supplied CEE 2027 prediction poster baseline','reference_baseline','published','User-provided forecast poster. This is not a verified or independently calculated prediction.')
on conflict(version) do nothing;
insert into public.prediction_model_settings(setting_key,setting_value)
values('default_historical_weights','{"recent_3_year":0.40,"recent_5_year":0.35,"historical":0.25}'::jsonb)
on conflict(setting_key) do nothing;
