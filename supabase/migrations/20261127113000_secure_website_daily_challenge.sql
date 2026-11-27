-- Secure the website Daily 10 answer key and make publishing atomic.
-- Public clients receive question text only; scoring and answer review happen server-side.

drop policy if exists website_daily_questions_public_read on public.website_daily_challenge_questions;
drop policy if exists website_daily_challenges_public_read on public.website_daily_challenges;

revoke all on public.website_daily_challenges from anon;
revoke all on public.website_daily_challenge_questions from anon;
grant select, insert, update, delete on public.website_daily_challenges to authenticated;
grant select, insert, update, delete on public.website_daily_challenge_questions to authenticated;

create or replace function public.get_website_daily_challenge(p_date date default null)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case when c.id is null then null else jsonb_build_object(
    'id', c.id,
    'challenge_date', c.challenge_date,
    'title', c.title,
    'description', c.description,
    'duration_seconds', c.duration_seconds,
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id, 'position', q.position, 'subject', q.subject,
        'chapter', q.chapter, 'prompt', q.prompt, 'options', q.options,
        'difficulty', q.difficulty
      ) order by q.position)
      from public.website_daily_challenge_questions q
      where q.challenge_id = c.id
    ), '[]'::jsonb)
  ) end
  from public.website_daily_challenges c
  where c.challenge_date = coalesce(p_date, (now() at time zone 'Asia/Kolkata')::date)
    and c.status = 'published'
  limit 1;
$$;

create or replace function public.submit_website_daily_challenge(p_challenge_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_total int;
  v_correct int;
  v_wrong int;
  v_unanswered int;
  v_score int;
  v_review jsonb;
begin
  if jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;
  if not exists (
    select 1 from public.website_daily_challenges
    where id = p_challenge_id and status = 'published'
  ) then
    raise exception 'Challenge is not available';
  end if;
  if exists (
    select 1 from jsonb_each(p_answers) a
    where a.key !~* '^[0-9a-f-]{36}$'
       or jsonb_typeof(a.value) <> 'number'
       or a.value::text not in ('0','1','2','3')
       or not exists (
         select 1 from public.website_daily_challenge_questions q
         where q.id::text = a.key and q.challenge_id = p_challenge_id
       )
  ) then
    raise exception 'One or more submitted answers are invalid';
  end if;

  select count(*),
    count(*) filter (where (p_answers ->> q.id::text)::int = q.correct_option_index),
    count(*) filter (where p_answers ? q.id::text and (p_answers ->> q.id::text)::int <> q.correct_option_index),
    count(*) filter (where not (p_answers ? q.id::text)),
    coalesce(sum(case
      when not (p_answers ? q.id::text) then 0
      when (p_answers ->> q.id::text)::int = q.correct_option_index then 4
      else -1 end), 0),
    jsonb_agg(jsonb_build_object(
      'id', q.id, 'position', q.position, 'correct_option_index', q.correct_option_index,
      'explanation', q.explanation
    ) order by q.position)
  into v_total, v_correct, v_wrong, v_unanswered, v_score, v_review
  from public.website_daily_challenge_questions q
  where q.challenge_id = p_challenge_id;

  if v_total <> 10 then raise exception 'Challenge is not fully prepared'; end if;
  return jsonb_build_object(
    'score', v_score, 'correct', v_correct, 'wrong', v_wrong,
    'unanswered', v_unanswered, 'total', v_total, 'review', coalesce(v_review, '[]'::jsonb)
  );
end;
$$;

create or replace function public.publish_website_daily_challenge(
  p_date date, p_title text, p_description text, p_duration_seconds int, p_questions jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_q jsonb;
  v_pos int := 0;
begin
  if auth.uid() is null or not public.is_smartprep_admin() then
    raise exception 'Administrator access required';
  end if;
  if p_date is null or p_duration_seconds not between 60 and 3600
     or jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) <> 10 then
    raise exception 'Provide a date, valid duration and exactly 10 questions';
  end if;
  insert into public.website_daily_challenges(challenge_date,title,description,duration_seconds,status,updated_at,created_by)
  values(p_date, coalesce(nullif(trim(p_title),''),'Daily 10'), nullif(trim(p_description),''), p_duration_seconds, 'draft', now(), auth.uid())
  on conflict(challenge_date) do update set
    title=excluded.title, description=excluded.description,
    duration_seconds=excluded.duration_seconds, status='draft', updated_at=now()
  returning id into v_id;

  delete from public.website_daily_challenge_questions where challenge_id=v_id;
  for v_q in select value from jsonb_array_elements(p_questions) loop
    v_pos := v_pos + 1;
    if v_q->>'subject' not in ('Physics','Chemistry','Mathematics')
       or nullif(trim(v_q->>'prompt'),'') is null
       or jsonb_typeof(v_q->'options') <> 'array'
       or jsonb_array_length(v_q->'options') <> 4
       or (v_q->>'correct_option_index') !~ '^[0-3]$'
       or exists (select 1 from jsonb_array_elements(v_q->'options') o where jsonb_typeof(o) <> 'string' or trim(o#>>'{}') = '') then
      raise exception 'Question % is invalid', v_pos;
    end if;
    insert into public.website_daily_challenge_questions(
      challenge_id,position,subject,chapter,prompt,options,correct_option_index,explanation,difficulty
    ) values (
      v_id,v_pos,v_q->>'subject',nullif(trim(v_q->>'chapter'),''),trim(v_q->>'prompt'),
      v_q->'options',(v_q->>'correct_option_index')::int,nullif(trim(v_q->>'explanation'),''),
      case when v_q->>'difficulty' in ('easy','moderate','hard') then v_q->>'difficulty' else null end
    );
  end loop;
  update public.website_daily_challenges set status='published',updated_at=now() where id=v_id;
  return v_id;
end;
$$;

revoke all on function public.get_website_daily_challenge(date) from public;
revoke all on function public.submit_website_daily_challenge(uuid,jsonb) from public;
revoke all on function public.publish_website_daily_challenge(date,text,text,int,jsonb) from public;
grant execute on function public.get_website_daily_challenge(date) to anon, authenticated;
grant execute on function public.submit_website_daily_challenge(uuid,jsonb) to anon, authenticated;
grant execute on function public.publish_website_daily_challenge(date,text,text,int,jsonb) to authenticated;

       or not exists (
         select 1 from public.website_daily_challenge_questions q
         where q.id::text = a.key and q.challenge_id = p_challenge_id
       )
  ) then
    raise exception 'One or more submitted answers are invalid';
  end if;

  select count(*),
    count(*) filter (where (p_answers ->> q.id::text)::int = q.correct_option_index),
    count(*) filter (where p_answers ? q.id::text and (p_answers ->> q.id::text)::int <> q.correct_option_index),
    count(*) filter (where not (p_answers ? q.id::text)),
    coalesce(sum(case
      when not (p_answers ? q.id::text) then 0
      when (p_answers ->> q.id::text)::int = q.correct_option_index then 4
      else -1 end), 0),
    jsonb_agg(jsonb_build_object(
      'id', q.id, 'position', q.position, 'correct_option_index', q.correct_option_index,
      'explanation', q.explanation
    ) order by q.position)
  into v_total, v_correct, v_wrong, v_unanswered, v_score, v_review
  from public.website_daily_challenge_questions q
  where q.challenge_id = p_challenge_id;

  if v_total <> 10 then raise exception 'Challenge is not fully prepared'; end if;
  return jsonb_build_object(
    'score', v_score, 'correct', v_correct, 'wrong', v_wrong,
    'unanswered', v_unanswered, 'total', v_total, 'review', coalesce(v_review, '[]'::jsonb)
  );
end;
$$;

create or replace function public.publish_website_daily_challenge(
  p_date date, p_title text, p_description text, p_duration_seconds int, p_questions jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_q jsonb;
  v_pos int := 0;
begin
  if auth.uid() is null or not public.is_smartprep_admin() then
    raise exception 'Administrator access required';
  end if;
  if p_date is null or p_duration_seconds not between 60 and 3600
     or jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) <> 10 then
    raise exception 'Provide a date, valid duration and exactly 10 questions';
  end if;
  insert into public.website_daily_challenges(challenge_date,title,description,duration_seconds,status,updated_at,created_by)
  values(p_date, coalesce(nullif(trim(p_title),''),'Daily 10'), nullif(trim(p_description),''), p_duration_seconds, 'draft', now(), auth.uid())
  on conflict(challenge_date) do update set
    title=excluded.title, description=excluded.description,
    duration_seconds=excluded.duration_seconds, status='draft', updated_at=now()
  returning id into v_id;

  delete from public.website_daily_challenge_questions where challenge_id=v_id;
  for v_q in select value from jsonb_array_elements(p_questions) loop
    v_pos := v_pos + 1;
    if v_q->>'subject' not in ('Physics','Chemistry','Mathematics')
       or nullif(trim(v_q->>'prompt'),'') is null
       or jsonb_typeof(v_q->'options') <> 'array'
       or jsonb_array_length(v_q->'options') <> 4
       or (v_q->>'correct_option_index') !~ '^[0-3]$'
       or exists (select 1 from jsonb_array_elements(v_q->'options') o where jsonb_typeof(o) <> 'string' or trim(o#>>'{}') = '') then
      raise exception 'Question % is invalid', v_pos;
    end if;
    insert into public.website_daily_challenge_questions(
      challenge_id,position,subject,chapter,prompt,options,correct_option_index,explanation,difficulty
    ) values (
      v_id,v_pos,v_q->>'subject',nullif(trim(v_q->>'chapter'),''),trim(v_q->>'prompt'),
      v_q->'options',(v_q->>'correct_option_index')::int,nullif(trim(v_q->>'explanation'),''),
      case when v_q->>'difficulty' in ('easy','moderate','hard') then v_q->>'difficulty' else null end
    );
  end loop;
  update public.website_daily_challenges set status='published',updated_at=now() where id=v_id;
  return v_id;
end;
$$;

revoke all on function public.get_website_daily_challenge(date) from public;
revoke all on function public.submit_website_daily_challenge(uuid,jsonb) from public;
revoke all on function public.publish_website_daily_challenge(date,text,text,int,jsonb) from public;
grant execute on function public.get_website_daily_challenge(date) to anon, authenticated;
grant execute on function public.submit_website_daily_challenge(uuid,jsonb) to anon, authenticated;
grant execute on function public.publish_website_daily_challenge(date,text,text,int,jsonb) to authenticated;
