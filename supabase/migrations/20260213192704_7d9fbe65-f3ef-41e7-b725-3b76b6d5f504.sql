
-- Remove overly permissive INSERT and UPDATE policies
DROP POLICY "Allow anon insert" ON public.session_logs;
DROP POLICY "Allow anon update" ON public.session_logs;
