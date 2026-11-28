-- Keep the public SELECT policy independent from the private admin-check RPC.
drop policy if exists "Public can read published CEE calendar events" on public.cee_calendar_events;
create policy "Anyone can read published CEE calendar events"
on public.cee_calendar_events for select to anon
using (status = 'published');
create policy "Signed-in users read published events or admin drafts"
on public.cee_calendar_events for select to authenticated
using (status = 'published' or (select public.is_smartprep_admin()));
