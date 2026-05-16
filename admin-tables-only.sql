-- Admin profiles (links to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email text NOT NULL,
    name text,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT admin_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT admin_profiles_user_id_key UNIQUE (user_id)
);
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read own profile" ON public.admin_profiles;
CREATE POLICY "Admins can read own profile" ON public.admin_profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can insert own profile" ON public.admin_profiles;
CREATE POLICY "Admins can insert own profile" ON public.admin_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_profiles;
CREATE POLICY "Admins can update own profile" ON public.admin_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    name text,
    phone text,
    source text DEFAULT 'newsletter'::text,
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone,
    is_active boolean DEFAULT true,
    CONSTRAINT subscribers_pkey PRIMARY KEY (id),
    CONSTRAINT subscribers_email_key UNIQUE (email)
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can read subscribers" ON public.subscribers;
CREATE POLICY "Admins can read subscribers" ON public.subscribers FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.subscribers;
CREATE POLICY "Admins can update subscribers" ON public.subscribers FOR UPDATE USING (auth.role() = 'authenticated');

-- Service pricing
CREATE TABLE IF NOT EXISTS public.pricing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_name text NOT NULL,
    price_from numeric NOT NULL,
    price_to numeric,
    unit text DEFAULT 'item'::text,
    turnaround_time text,
    category text DEFAULT 'general'::text,
    is_active boolean DEFAULT true,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pricing_pkey PRIMARY KEY (id),
    CONSTRAINT pricing_service_name_key UNIQUE (service_name)
);
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read pricing" ON public.pricing;
CREATE POLICY "Anyone can read pricing" ON public.pricing FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.pricing;
CREATE POLICY "Admins can insert pricing" ON public.pricing FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins can update pricing" ON public.pricing;
CREATE POLICY "Admins can update pricing" ON public.pricing FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.pricing;
CREATE POLICY "Admins can delete pricing" ON public.pricing FOR DELETE USING (auth.role() = 'authenticated');

INSERT INTO public.pricing (service_name, price_from, price_to, unit, turnaround_time, category) VALUES
    ('Dry Cleaning', 350, 1500, 'item', '24-48 hours', 'general'),
    ('Laundry Service', 250, 800, 'kg', '24 hours', 'general'),
    ('Steam Pressing', 150, 500, 'item', '2 hours', 'general'),
    ('Wash Dry Fold', 300, 1200, 'kg', '24 hours', 'general'),
    ('Wedding Gown', 3500, 8000, 'item', '3-5 days', 'specialty'),
    ('Leather Jacket', 1500, 3000, 'item', '3-5 days', 'specialty'),
    ('Curtains & Drapes', 500, 2500, 'item', '2-3 days', 'specialty'),
    ('Duvets & Beddings', 800, 2000, 'item', '2-3 days', 'specialty'),
    ('Suit (2-piece)', 600, 1200, 'set', '24-48 hours', 'general'),
    ('Shirt', 200, 400, 'item', '24 hours', 'general'),
    ('Trousers', 250, 500, 'item', '24 hours', 'general'),
    ('Carpet Cleaning', 2000, 5000, 'item', '3-5 days', 'specialty')
ON CONFLICT (service_name) DO NOTHING;

-- Worker portal tables
CREATE TABLE IF NOT EXISTS public.worker_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    stations text[] DEFAULT '{}',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT worker_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT worker_profiles_user_id_key UNIQUE (user_id)
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS assigned_to uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS assigned_name text;

ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Workers can read own profile" ON public.worker_profiles;
CREATE POLICY "Any authenticated user can read workers" ON public.worker_profiles FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Workers can insert own profile" ON public.worker_profiles;
CREATE POLICY "Any authenticated user can insert workers" ON public.worker_profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Workers can update own profile" ON public.worker_profiles;
CREATE POLICY "Any authenticated user can update workers" ON public.worker_profiles FOR UPDATE USING (auth.role() = 'authenticated');
