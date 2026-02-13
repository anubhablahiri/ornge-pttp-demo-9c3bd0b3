
-- Session logs table for tracking all gate logins
CREATE TABLE public.session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  ip_address TEXT,
  location TEXT,
  device TEXT,
  os TEXT,
  browser TEXT,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end_time TIMESTAMP WITH TIME ZONE,
  session_duration_seconds INTEGER
);

-- Enable RLS
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert (edge function uses anon key)
CREATE POLICY "Allow anon insert" ON public.session_logs FOR INSERT TO anon WITH CHECK (true);

-- Allow anon to select (stats page reads)
CREATE POLICY "Allow anon select" ON public.session_logs FOR SELECT TO anon USING (true);

-- Allow anon to update (for session end tracking)
CREATE POLICY "Allow anon update" ON public.session_logs FOR UPDATE TO anon USING (true) WITH CHECK (true);
