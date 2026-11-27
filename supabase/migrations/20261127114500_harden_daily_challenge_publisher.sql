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
  if p_date is null or p_duration_seconds is null or p_duration_seconds not between 60 and 3600
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
       or (v_q->>'correct_option_index') not in ('0','1','2','3')
       or exists (
         select 1 from jsonb_array_elements(v_q->'options') as opt(value)
         where jsonb_typeof(opt.value) <> 'string' or trim(opt.value #>> '{}') = ''
       ) then
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