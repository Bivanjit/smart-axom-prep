-- Prefer a different Daily 10 question set from the immediately previous Assam-local day.
create or replace function public.get_website_daily_challenge(p_date date default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_date date := coalesce(p_date, (now() at time zone 'Asia/Kolkata')::date);
  v_id uuid;
  v_count_physics int;
  v_count_chemistry int;
  v_count_math int;
begin
  perform pg_advisory_xact_lock(hashtext('smartprep-daily10-' || v_date::text));
  select id into v_id from public.website_daily_challenges where challenge_date=v_date and status='published' limit 1;
  if v_id is null then
    select count(*) filter(where s.name='Physics'),count(*) filter(where s.name='Chemistry'),count(*) filter(where s.name='Mathematics')
    into v_count_physics,v_count_chemistry,v_count_math
    from public.questions q join public.chapters c on c.id=q.chapter_id join public.subjects s on s.id=c.subject_id
    where q.is_published=true and jsonb_typeof(q.options)='array' and jsonb_array_length(q.options)=4
      and upper(coalesce(q.answer_key,'')) in ('A','B','C','D','0','1','2','3') and s.name in ('Physics','Chemistry','Mathematics');
    if v_count_physics<4 or v_count_chemistry<4 or v_count_math<2 then
      raise exception 'Daily 10 needs at least 4 published Physics, 4 Chemistry and 2 Mathematics MCQs with verified answer keys';
    end if;
    insert into public.website_daily_challenges(challenge_date,title,description,status,duration_seconds)
    values(v_date,'Daily 10','A fresh mixed-subject practice set from the SmartPrep Axom question bank: 4 Physics, 4 Chemistry and 2 Mathematics questions.','published',600)
    on conflict(challenge_date) do nothing;
    select id into v_id from public.website_daily_challenges where challenge_date=v_date and status='published' limit 1;
    if v_id is null then return null; end if;
    if not exists(select 1 from public.website_daily_challenge_questions where challenge_id=v_id) then
      with eligible as (
        select q.prompt,q.options,q.answer_key,q.explanation,c.name chapter,s.name subject
        from public.questions q join public.chapters c on c.id=q.chapter_id join public.subjects s on s.id=c.subject_id
        where q.is_published=true and jsonb_typeof(q.options)='array' and jsonb_array_length(q.options)=4
          and upper(coalesce(q.answer_key,'')) in ('A','B','C','D','0','1','2','3')
          and s.name in ('Physics','Chemistry','Mathematics')
          and not exists(select 1 from public.website_daily_challenge_questions pq
            join public.website_daily_challenges pc on pc.id=pq.challenge_id
            where pc.challenge_date=v_date-1 and pq.prompt=q.prompt)
      ), picked as (
        select *,row_number() over(partition by subject order by random()) subject_position from eligible
      ), selected as (
        select * from picked where (subject='Physics' and subject_position<=4)
          or (subject='Chemistry' and subject_position<=4) or (subject='Mathematics' and subject_position<=2)
      )
      insert into public.website_daily_challenge_questions(challenge_id,position,subject,chapter,prompt,options,correct_option_index,explanation,difficulty)
      select v_id,row_number() over(order by case subject when 'Physics' then 1 when 'Chemistry' then 2 else 3 end,subject_position)::int,
        subject,chapter,prompt,options,
        case when upper(answer_key) in ('0','1','2','3') then answer_key::int else strpos('ABCD',upper(answer_key))-1 end,
        nullif(explanation,''),'moderate' from selected;
    end if;
  end if;
  return (select jsonb_build_object('id',c.id,'challenge_date',c.challenge_date,'title',c.title,'description',c.description,
    'duration_seconds',c.duration_seconds,'questions',coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'position',q.position,
    'subject',q.subject,'chapter',q.chapter,'prompt',q.prompt,'options',q.options,'difficulty',q.difficulty) order by q.position)
    from public.website_daily_challenge_questions q where q.challenge_id=c.id),'[]'::jsonb))
    from public.website_daily_challenges c where c.id=v_id);
end;
$$;
revoke all on function public.get_website_daily_challenge(date) from public;
grant execute on function public.get_website_daily_challenge(date) to anon,authenticated;
