--
-- Supabase Migration for United Dry Cleaners
-- Adapted from database.sql
-- Uses public schema + built-in Supabase Auth & Storage
-- Run this in: Supabase Dashboard > SQL Editor
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- 1. TABLES (must come before functions that reference them)
--

CREATE TABLE IF NOT EXISTS public.crm_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    subject text,
    html_body text,
    text_body text,
    status text DEFAULT 'draft'::text,
    list_id uuid,
    filter_query jsonb,
    list_ids jsonb,
    style_preset text,
    images jsonb,
    scheduled_at timestamp with time zone,
    sent_at timestamp with time zone,
    total_recipients integer DEFAULT 0,
    total_sent integer DEFAULT 0,
    total_opened integer DEFAULT 0,
    total_clicked integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_campaigns_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'scheduled'::text, 'sending'::text, 'sent'::text, 'failed'::text])))
);

CREATE TABLE IF NOT EXISTS public.crm_flow_step_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    flow_id uuid NOT NULL,
    contact_id uuid NOT NULL,
    resume_step_order integer NOT NULL,
    run_at timestamp with time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 5 NOT NULL,
    last_error text,
    event_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    locked_at timestamp with time zone,
    locked_by text,
    finished_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.crm_appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    calendar_id uuid,
    contact_id uuid,
    contact_email text NOT NULL,
    contact_name text,
    contact_phone text,
    title text,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    status text DEFAULT 'confirmed'::text,
    notes text,
    source text DEFAULT 'manual'::text,
    google_event_id text,
    calendly_event_id text,
    assigned_user_id text,
    assigned_membership_id uuid,
    participant_count integer DEFAULT 1,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_appointments_source_check CHECK ((source = ANY (ARRAY['manual'::text, 'public_link'::text, 'google'::text, 'calendly'::text]))),
    CONSTRAINT crm_appointments_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'cancelled'::text, 'completed'::text, 'no_show'::text, 'rescheduled'::text])))
);

CREATE TABLE IF NOT EXISTS public.crm_availability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    calendar_id uuid,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_availability_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);

CREATE TABLE IF NOT EXISTS public.crm_calendar_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    calendar_id uuid,
    user_id text NOT NULL,
    user_google_calendar_id text,
    priority integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_calendars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text DEFAULT 'Default Calendar'::text NOT NULL,
    slug text,
    description text,
    calendar_type text DEFAULT 'personal'::text,
    owner_user_id text,
    max_participants integer DEFAULT 1,
    date_range_days integer,
    slot_duration integer DEFAULT 30,
    slot_interval integer DEFAULT 0,
    max_bookings_per_day integer,
    min_notice_hours integer DEFAULT 1,
    buffer_before integer DEFAULT 0,
    buffer_after integer DEFAULT 0,
    timezone text DEFAULT 'America/New_York'::text,
    is_active boolean DEFAULT true,
    meeting_location_type text DEFAULT 'custom'::text,
    meeting_location_value text,
    google_calendar_id text,
    google_refresh_token text,
    calendly_user_uri text,
    calendly_webhook_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    calendly_connection_id uuid,
    CONSTRAINT crm_calendars_calendar_type_check CHECK ((calendar_type = ANY (ARRAY['personal'::text, 'round_robin'::text, 'class'::text, 'collective'::text])))
);

CREATE TABLE IF NOT EXISTS public.crm_calendly_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    calendly_user_uri text NOT NULL,
    calendly_user_email text,
    calendly_user_name text,
    calendly_org_uri text,
    encrypted_access_token text NOT NULL,
    signing_key text NOT NULL,
    webhook_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_contact_lists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contact_id uuid NOT NULL,
    list_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    name text,
    phone text,
    sms_opt_in boolean DEFAULT false,
    address jsonb,
    source text DEFAULT 'manual'::text,
    tags text[] DEFAULT '{}'::text[],
    metadata jsonb DEFAULT '{}'::jsonb,
    ecom_customer_id uuid,
    total_orders integer DEFAULT 0,
    total_spent integer DEFAULT 0,
    last_order_at timestamp with time zone,
    subscribed boolean DEFAULT true,
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contact_id uuid,
    campaign_id uuid,
    event_type text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_events_event_type_check CHECK ((event_type = ANY (ARRAY['sent'::text, 'opened'::text, 'clicked'::text, 'bounced'::text, 'unsubscribed'::text])))
);

CREATE TABLE IF NOT EXISTS public.crm_flow_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    flow_id uuid,
    step_id uuid,
    contact_id uuid,
    trigger_event text NOT NULL,
    status text DEFAULT 'executed'::text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_flow_logs_status_check CHECK ((status = ANY (ARRAY['executed'::text, 'failed'::text, 'skipped'::text])))
);

CREATE TABLE IF NOT EXISTS public.crm_flow_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    flow_id uuid,
    step_order integer NOT NULL,
    action_type text NOT NULL,
    action_config jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_flow_steps_action_type_check CHECK ((action_type = ANY (ARRAY['send_email'::text, 'add_tag'::text, 'add_to_list'::text, 'wait'::text])))
);

CREATE TABLE IF NOT EXISTS public.crm_flows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    trigger_type text NOT NULL,
    trigger_config jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    cron_job_name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT crm_flows_trigger_type_check CHECK ((trigger_type = ANY (ARRAY[(('contact'::text || chr(46)) || 'subscribed'::text), (('order'::text || chr(46)) || 'placed'::text), (('contact'::text || chr(46)) || 'tagged'::text), (('user'::text || chr(46)) || 'registered'::text), (('appointment'::text || chr(46)) || 'booked'::text), (('schedule'::text || chr(46)) || 'cron'::text)])))
);

CREATE TABLE IF NOT EXISTS public.crm_lists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    filter_query jsonb,
    is_dynamic boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id text NOT NULL,
    customer_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    service text NOT NULL,
    scheduled_date date,
    scheduled_slot text,
    notes text,
    items jsonb DEFAULT '[]'::jsonb,
    total_amount numeric DEFAULT 0,
    status text DEFAULT 'received'::text NOT NULL,
    current_stage integer DEFAULT 0 NOT NULL,
    timeline jsonb DEFAULT '[]'::jsonb,
    eta text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

--
-- 2. FUNCTIONS (after tables exist)
--

CREATE OR REPLACE FUNCTION public.crm_campaigns_claim_due(p_limit integer)
 RETURNS SETOF public.crm_campaigns
 LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY UPDATE crm_campaigns
SET status = 'sending', sent_at = NULL
WHERE id IN (
SELECT due_id FROM (
SELECT id AS due_id FROM crm_campaigns
WHERE status = 'scheduled' AND scheduled_at <= NOW()
ORDER BY scheduled_at
FOR UPDATE SKIP LOCKED
LIMIT p_limit
) due_rows
)
RETURNING *;
END $$;

CREATE OR REPLACE FUNCTION public.crm_flow_queue_claim(p_limit integer, p_worker text, p_lock_seconds integer DEFAULT 300)
 RETURNS SETOF public.crm_flow_step_queue
 LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY UPDATE crm_flow_step_queue
SET locked_at = NOW(),
locked_by = p_worker,
attempts = attempts + 1
WHERE id IN (
SELECT due_id FROM (
SELECT id AS due_id FROM crm_flow_step_queue
WHERE finished_at IS NULL
AND attempts < max_attempts
AND run_at <= NOW()
AND (locked_at IS NULL OR locked_at < NOW() - make_interval(secs => p_lock_seconds))
ORDER BY run_at
FOR UPDATE SKIP LOCKED
LIMIT p_limit
) due_rows
)
RETURNING *;
END $$;

--
-- 3. DATA
--

INSERT INTO public.crm_availability (id, calendar_id, day_of_week, start_time, end_time, is_active, created_at) VALUES
('12400dd7-3e33-4763-ba99-71ccb25914a4', 'e50295ef-ff52-4e54-acc4-b56c7a88353f', 1, '09:00:00', '17:00:00', true, '2026-05-16 11:41:26.052905+00'),
('80cc86e1-5c9b-4c7c-a55f-d76ae9f899f3', 'e50295ef-ff52-4e54-acc4-b56c7a88353f', 2, '09:00:00', '17:00:00', true, '2026-05-16 11:41:26.052905+00'),
('e2c14ad0-adec-4444-ae7c-ea77bd501f8c', 'e50295ef-ff52-4e54-acc4-b56c7a88353f', 3, '09:00:00', '17:00:00', true, '2026-05-16 11:41:26.052905+00'),
('69b2bc88-b5f9-47fd-a3a1-6f9ba2a7cf25', 'e50295ef-ff52-4e54-acc4-b56c7a88353f', 4, '09:00:00', '17:00:00', true, '2026-05-16 11:41:26.052905+00'),
('16127f49-de3f-405e-a5bd-03e69d248133', 'e50295ef-ff52-4e54-acc4-b56c7a88353f', 5, '09:00:00', '17:00:00', true, '2026-05-16 11:41:26.052905+00');

INSERT INTO public.crm_calendar_members (id, calendar_id, user_id, user_google_calendar_id, priority, created_at) VALUES
('8d8fc923-7f21-4a8c-9a6a-d747914fda27', 'e50295ef-ff52-4e54-acc4-b56c7a88353f', '699c6111136bd966ef67d342', NULL, 0, '2026-05-16 11:41:25.970149+00');

INSERT INTO public.crm_calendars (id, name, slug, description, calendar_type, owner_user_id, max_participants, date_range_days, slot_duration, slot_interval, max_bookings_per_day, min_notice_hours, buffer_before, buffer_after, timezone, is_active, meeting_location_type, meeting_location_value, google_calendar_id, google_refresh_token, calendly_user_uri, calendly_webhook_id, metadata, created_at, updated_at, calendly_connection_id) VALUES
('e50295ef-ff52-4e54-acc4-b56c7a88353f', 'Default Calendar', NULL, NULL, 'personal', '699c6111136bd966ef67d342', 1, NULL, 30, 0, NULL, 1, 0, 0, 'America/New_York', true, 'custom', NULL, NULL, NULL, NULL, NULL, '{}', '2026-05-16 11:41:25.866225+00', '2026-05-16 11:41:25.866225+00', NULL);

INSERT INTO public.crm_flows (id, name, trigger_type, trigger_config, is_active, cron_job_name, created_at, updated_at) VALUES
('96c30403-4ceb-4197-8662-eb44ce7a5117', 'Welcome Email', 'contact.subscribed', '{}', false, NULL, '2026-05-16 11:41:25.032113+00', '2026-05-16 11:41:25.032113+00');

INSERT INTO public.orders (id, order_id, customer_name, email, phone, address, service, scheduled_date, scheduled_slot, notes, items, total_amount, status, current_stage, timeline, eta, created_at, updated_at) VALUES
('01e18fdc-4405-4d62-859e-fbd0bb3711aa', 'UDC-2024-8472', 'Sarah W.', 'sarah@example.com', '+254712345678', 'Westlands, Nairobi', 'Dry Cleaning', '2026-05-16', '4:00 PM - 6:00 PM', NULL, '["3x Business Shirts", "1x Navy Suit", "2x Dresses"]', 2450, 'delivery', 3, '[{"done": true, "time": "Yesterday, 9:15 AM", "label": "Order Received", "stage": 0}, {"done": true, "time": "Yesterday, 11:40 AM", "label": "Processing", "stage": 1}, {"done": true, "time": "Today, 8:20 AM", "label": "Quality Check", "stage": 2}, {"done": true, "time": "Today, 3:45 PM", "label": "Out for Delivery", "stage": 3}, {"done": false, "time": "Today, 5:30 PM", "label": "Delivered", "stage": 4}]', 'Today, 5:30 PM', '2026-05-16 11:51:06.502344+00', '2026-05-16 11:51:06.502344+00');

--
-- 4. CONSTRAINTS & INDEXES
--

ALTER TABLE ONLY public.crm_appointments ADD CONSTRAINT crm_appointments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_availability ADD CONSTRAINT crm_availability_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_calendar_members ADD CONSTRAINT crm_calendar_members_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_calendars ADD CONSTRAINT crm_calendars_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_calendly_connections ADD CONSTRAINT crm_calendly_connections_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_campaigns ADD CONSTRAINT crm_campaigns_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_contact_lists ADD CONSTRAINT crm_contact_lists_contact_id_list_id_key UNIQUE (contact_id, list_id);
ALTER TABLE ONLY public.crm_contact_lists ADD CONSTRAINT crm_contact_lists_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_contacts ADD CONSTRAINT crm_contacts_email_key UNIQUE (email);
ALTER TABLE ONLY public.crm_contacts ADD CONSTRAINT crm_contacts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_events ADD CONSTRAINT crm_events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_flow_logs ADD CONSTRAINT crm_flow_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_flow_step_queue ADD CONSTRAINT crm_flow_step_queue_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_flow_steps ADD CONSTRAINT crm_flow_steps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_flows ADD CONSTRAINT crm_flows_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.crm_lists ADD CONSTRAINT crm_lists_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orders ADD CONSTRAINT orders_order_id_key UNIQUE (order_id);
ALTER TABLE ONLY public.orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX crm_calendar_members_calendar_user_unique ON public.crm_calendar_members USING btree (calendar_id, user_id);
CREATE UNIQUE INDEX crm_calendars_slug_unique ON public.crm_calendars USING btree (slug) WHERE (slug IS NOT NULL);
CREATE UNIQUE INDEX crm_calendly_connections_user_uri_unique ON public.crm_calendly_connections USING btree (user_id, calendly_user_uri);
CREATE INDEX idx_crm_appointments_assigned_user_id ON public.crm_appointments USING btree (assigned_user_id);
CREATE INDEX idx_crm_appointments_calendar_id ON public.crm_appointments USING btree (calendar_id);
CREATE INDEX idx_crm_appointments_contact_id ON public.crm_appointments USING btree (contact_id);
CREATE INDEX idx_crm_appointments_starts_at ON public.crm_appointments USING btree (starts_at);
CREATE INDEX idx_crm_appointments_status ON public.crm_appointments USING btree (status);
CREATE INDEX idx_crm_availability_calendar_id ON public.crm_availability USING btree (calendar_id);
CREATE INDEX idx_crm_calendar_members_calendar_id ON public.crm_calendar_members USING btree (calendar_id);
CREATE INDEX idx_crm_calendar_members_user_id ON public.crm_calendar_members USING btree (user_id);
CREATE INDEX idx_crm_calendars_calendly_connection ON public.crm_calendars USING btree (calendly_connection_id) WHERE (calendly_connection_id IS NOT NULL);
CREATE INDEX idx_crm_calendars_is_active ON public.crm_calendars USING btree (is_active);
CREATE INDEX idx_crm_calendars_owner_user_id ON public.crm_calendars USING btree (owner_user_id);
CREATE INDEX idx_crm_calendly_connections_user_id ON public.crm_calendly_connections USING btree (user_id);
CREATE INDEX idx_crm_campaigns_created_at ON public.crm_campaigns USING btree (created_at);
CREATE INDEX idx_crm_campaigns_status ON public.crm_campaigns USING btree (status);
CREATE INDEX idx_crm_contact_lists_contact_id ON public.crm_contact_lists USING btree (contact_id);
CREATE INDEX idx_crm_contact_lists_list_id ON public.crm_contact_lists USING btree (list_id);
CREATE INDEX idx_crm_contacts_created_at ON public.crm_contacts USING btree (created_at);
CREATE UNIQUE INDEX idx_crm_contacts_email ON public.crm_contacts USING btree (email);
CREATE INDEX idx_crm_contacts_source ON public.crm_contacts USING btree (source);
CREATE INDEX idx_crm_contacts_subscribed ON public.crm_contacts USING btree (subscribed);
CREATE INDEX idx_crm_contacts_tags ON public.crm_contacts USING gin (tags);
CREATE INDEX idx_crm_events_campaign_id ON public.crm_events USING btree (campaign_id);
CREATE INDEX idx_crm_events_contact_id ON public.crm_events USING btree (contact_id);
CREATE INDEX idx_crm_events_created_at ON public.crm_events USING btree (created_at);
CREATE INDEX idx_crm_events_event_type ON public.crm_events USING btree (event_type);
CREATE INDEX idx_crm_flow_logs_contact_id ON public.crm_flow_logs USING btree (contact_id);
CREATE INDEX idx_crm_flow_logs_created_at ON public.crm_flow_logs USING btree (created_at);
CREATE INDEX idx_crm_flow_logs_flow_id ON public.crm_flow_logs USING btree (flow_id);
CREATE INDEX idx_crm_flow_step_queue_due ON public.crm_flow_step_queue USING btree (run_at) WHERE ((finished_at IS NULL) AND (attempts < max_attempts));
CREATE INDEX idx_crm_flow_steps_flow_id ON public.crm_flow_steps USING btree (flow_id);
CREATE INDEX idx_crm_flows_is_active ON public.crm_flows USING btree (is_active);
CREATE INDEX idx_crm_flows_trigger_type ON public.crm_flows USING btree (trigger_type);
CREATE INDEX idx_orders_email ON public.orders USING btree (email);
CREATE INDEX idx_orders_order_id ON public.orders USING btree (order_id);
CREATE INDEX idx_orders_phone ON public.orders USING btree (phone);

--
-- 5. FOREIGN KEYS
--

ALTER TABLE ONLY public.crm_appointments ADD CONSTRAINT crm_appointments_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.crm_calendars(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_appointments ADD CONSTRAINT crm_appointments_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.crm_availability ADD CONSTRAINT crm_availability_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.crm_calendars(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_calendar_members ADD CONSTRAINT crm_calendar_members_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.crm_calendars(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_calendars ADD CONSTRAINT crm_calendars_calendly_connection_id_fkey FOREIGN KEY (calendly_connection_id) REFERENCES public.crm_calendly_connections(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.crm_campaigns ADD CONSTRAINT crm_campaigns_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.crm_lists(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.crm_contact_lists ADD CONSTRAINT crm_contact_lists_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_contact_lists ADD CONSTRAINT crm_contact_lists_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.crm_lists(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_events ADD CONSTRAINT crm_events_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.crm_campaigns(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_events ADD CONSTRAINT crm_events_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_flow_logs ADD CONSTRAINT crm_flow_logs_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_flow_logs ADD CONSTRAINT crm_flow_logs_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES public.crm_flows(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_flow_logs ADD CONSTRAINT crm_flow_logs_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.crm_flow_steps(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.crm_flow_step_queue ADD CONSTRAINT crm_flow_step_queue_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.crm_contacts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_flow_step_queue ADD CONSTRAINT crm_flow_step_queue_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES public.crm_flows(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.crm_flow_steps ADD CONSTRAINT crm_flow_steps_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES public.crm_flows(id) ON DELETE CASCADE;

--
-- 6. ROW LEVEL SECURITY POLICIES
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

ALTER TABLE public.crm_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM appointments deletable" ON public.crm_appointments FOR DELETE USING (true);
CREATE POLICY "CRM appointments insertable" ON public.crm_appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM appointments readable" ON public.crm_appointments FOR SELECT USING (true);
CREATE POLICY "CRM appointments updatable" ON public.crm_appointments FOR UPDATE USING (true);

ALTER TABLE public.crm_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM availability deletable" ON public.crm_availability FOR DELETE USING (true);
CREATE POLICY "CRM availability insertable" ON public.crm_availability FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM availability readable" ON public.crm_availability FOR SELECT USING (true);
CREATE POLICY "CRM availability updatable" ON public.crm_availability FOR UPDATE USING (true);

ALTER TABLE public.crm_calendar_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM calendar members deletable" ON public.crm_calendar_members FOR DELETE USING (true);
CREATE POLICY "CRM calendar members insertable" ON public.crm_calendar_members FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM calendar members readable" ON public.crm_calendar_members FOR SELECT USING (true);
CREATE POLICY "CRM calendar members updatable" ON public.crm_calendar_members FOR UPDATE USING (true);

ALTER TABLE public.crm_calendars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM calendars deletable" ON public.crm_calendars FOR DELETE USING (true);
CREATE POLICY "CRM calendars insertable" ON public.crm_calendars FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM calendars readable" ON public.crm_calendars FOR SELECT USING (true);
CREATE POLICY "CRM calendars updatable" ON public.crm_calendars FOR UPDATE USING (true);

ALTER TABLE public.crm_calendly_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Calendly connections service only" ON public.crm_calendly_connections USING (false) WITH CHECK (false);

ALTER TABLE public.crm_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM campaigns deletable" ON public.crm_campaigns FOR DELETE USING (true);
CREATE POLICY "CRM campaigns insertable" ON public.crm_campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM campaigns readable" ON public.crm_campaigns FOR SELECT USING (true);
CREATE POLICY "CRM campaigns updatable" ON public.crm_campaigns FOR UPDATE USING (true);

ALTER TABLE public.crm_contact_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM contact lists deletable" ON public.crm_contact_lists FOR DELETE USING (true);
CREATE POLICY "CRM contact lists insertable" ON public.crm_contact_lists FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM contact lists readable" ON public.crm_contact_lists FOR SELECT USING (true);

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM contacts deletable" ON public.crm_contacts FOR DELETE USING (true);
CREATE POLICY "CRM contacts insertable" ON public.crm_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM contacts readable" ON public.crm_contacts FOR SELECT USING (true);
CREATE POLICY "CRM contacts updatable" ON public.crm_contacts FOR UPDATE USING (true);

ALTER TABLE public.crm_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM events insertable" ON public.crm_events FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM events readable" ON public.crm_events FOR SELECT USING (true);

ALTER TABLE public.crm_flow_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM flow logs insertable" ON public.crm_flow_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM flow logs readable" ON public.crm_flow_logs FOR SELECT USING (true);

ALTER TABLE public.crm_flow_step_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM flow queue deletable" ON public.crm_flow_step_queue FOR DELETE USING (true);
CREATE POLICY "CRM flow queue insertable" ON public.crm_flow_step_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM flow queue readable" ON public.crm_flow_step_queue FOR SELECT USING (true);
CREATE POLICY "CRM flow queue updatable" ON public.crm_flow_step_queue FOR UPDATE USING (true);

ALTER TABLE public.crm_flow_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM flow steps deletable" ON public.crm_flow_steps FOR DELETE USING (true);
CREATE POLICY "CRM flow steps insertable" ON public.crm_flow_steps FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM flow steps readable" ON public.crm_flow_steps FOR SELECT USING (true);
CREATE POLICY "CRM flow steps updatable" ON public.crm_flow_steps FOR UPDATE USING (true);

ALTER TABLE public.crm_flows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM flows deletable" ON public.crm_flows FOR DELETE USING (true);
CREATE POLICY "CRM flows insertable" ON public.crm_flows FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM flows readable" ON public.crm_flows FOR SELECT USING (true);
CREATE POLICY "CRM flows updatable" ON public.crm_flows FOR UPDATE USING (true);

ALTER TABLE public.crm_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CRM lists deletable" ON public.crm_lists FOR DELETE USING (true);
CREATE POLICY "CRM lists insertable" ON public.crm_lists FOR INSERT WITH CHECK (true);
CREATE POLICY "CRM lists readable" ON public.crm_lists FOR SELECT USING (true);
CREATE POLICY "CRM lists updatable" ON public.crm_lists FOR UPDATE USING (true);

--
-- 7. ADMIN TABLES
--

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
CREATE POLICY "Admins can read own profile" ON public.admin_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert own profile" ON public.admin_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
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
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read subscribers" ON public.subscribers FOR SELECT USING (auth.role() = 'authenticated');
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
CREATE POLICY "Anyone can read pricing" ON public.pricing FOR SELECT USING (true);
CREATE POLICY "Admins can insert pricing" ON public.pricing FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update pricing" ON public.pricing FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete pricing" ON public.pricing FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default pricing data
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
