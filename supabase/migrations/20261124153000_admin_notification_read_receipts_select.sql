drop policy if exists user_notification_reads_admin_select on public.user_notification_reads;
create policy user_notification_reads_admin_select
on public.user_notification_reads
for select to authenticated
using (public.is_smartprep_admin());