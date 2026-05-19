CREATE TABLE public.pttp_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  session_analytics BOOLEAN NOT NULL DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pttp_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read pttp_accounts"
  ON public.pttp_accounts FOR SELECT
  USING (true);

CREATE POLICY "Public insert pttp_accounts"
  ON public.pttp_accounts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update pttp_accounts"
  ON public.pttp_accounts FOR UPDATE
  USING (true);

CREATE POLICY "Public delete pttp_accounts"
  ON public.pttp_accounts FOR DELETE
  USING (true);

CREATE OR REPLACE FUNCTION public.update_pttp_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_pttp_accounts_updated_at
  BEFORE UPDATE ON public.pttp_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_pttp_accounts_updated_at();