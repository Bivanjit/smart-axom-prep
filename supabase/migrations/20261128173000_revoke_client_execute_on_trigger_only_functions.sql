-- These SECURITY DEFINER functions are attached to database triggers only.
-- Clients must not invoke them directly through the Supabase Data API.
revoke execute on function public.reject_blocked_email_signup() from public, anon, authenticated;
revoke execute on function public.smartprep_award_milestone_achievements() from public, anon, authenticated;
revoke execute on function public.smartprep_sync_profile_avatar() from public, anon, authenticated;
revoke execute on function public.smartprep_sync_profile_banner() from public, anon, authenticated;
