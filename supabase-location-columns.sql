ALTER TABLE public.worker_profiles ADD COLUMN IF NOT EXISTS location_type text;
ALTER TABLE public.worker_profiles ADD COLUMN IF NOT EXISTS location_name text;
