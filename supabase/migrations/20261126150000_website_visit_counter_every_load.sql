-- Count every full website load, including repeat visits from the same browser.
-- Keep the existing parameter with a default for backwards-compatible RPC calls.
create or replace function public.register_website_visitor(p_visitor_id uuid default null)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  current_total bigint;
begin
  update public.website_stats
    set total_aspirants = total_aspirants + 1,
        updated_at = now()
    where id = 1
    returning total_aspirants into current_total;

  return coalesce(current_total, 9088);
end;
$function$;

revoke all on function public.register_website_visitor(uuid) from public;
grant execute on function public.register_website_visitor(uuid) to anon, authenticated;
