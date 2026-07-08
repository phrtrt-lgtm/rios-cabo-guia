CREATE TABLE public.place_illustrations (
  slug TEXT PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'place',
  descriptor TEXT,
  illustration_url TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.place_illustrations TO anon, authenticated;
GRANT ALL ON public.place_illustrations TO service_role;

ALTER TABLE public.place_illustrations ENABLE ROW LEVEL SECURITY;

-- Public read (guide is public)
CREATE POLICY "Illustrations are readable by everyone"
  ON public.place_illustrations
  FOR SELECT
  USING (true);

-- Writes only via service_role (edge functions with ADMIN_TOKEN gate)
-- No INSERT/UPDATE/DELETE policies for anon/authenticated on purpose.

CREATE OR REPLACE FUNCTION public.tg_place_illustrations_touch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_place_illustrations_touch
BEFORE UPDATE ON public.place_illustrations
FOR EACH ROW EXECUTE FUNCTION public.tg_place_illustrations_touch();