
-- Remove the public SELECT policy
DROP POLICY "Allow anon select" ON public.session_logs;
