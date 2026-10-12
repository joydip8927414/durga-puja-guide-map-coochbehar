-- ==============================================================================
-- Migration: 20261012000001_create_durga_puja_schema.sql
-- Description: Core Schema for Cooch Behar Durga Puja Guide
-- Tables: pandals, crowd_reports, pandal_photos, amenities, app_admins
-- Security: Strict check constraints, domain validation, foreign keys, indexes
-- ==============================================================================

-- Enable UUID extension (standard in PostgreSQL / Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE pandal_tier AS ENUM ('top_5', 'top_10', 'top_20', 'general');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_access AS ENUM ('none', 'two_wheeler_only', 'four_wheeler_restricted', 'all_vehicles');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crowd_level_status AS ENUM ('LOW', 'MED', 'HIGH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE amenity_category AS ENUM ('POLICE', 'HOSPITAL', 'FOOD', 'TOILET', 'WATER', 'FIRE_STATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. TABLE: app_admins (Server-verifiable Administrative Access Control)
-- -----------------------------------------------------------------------------
-- Rather than trusting client claims or insecure metadata, administrators are
-- registered explicitly in this table by database superuser / initial provisioning.
CREATE TABLE IF NOT EXISTS public.app_admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'moderator' CHECK (role IN ('super_admin', 'moderator', 'police_liaison')),
    assigned_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.app_admins IS 'Server-verifiable role table for administrators and moderators. Never writable by normal visitors.';

-- -----------------------------------------------------------------------------
-- 3. TABLE: pandals
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pandals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_name TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    zone TEXT NOT NULL,
    tier pandal_tier NOT NULL DEFAULT 'general',
    milestone_year TEXT,
    -- Cooch Behar district coordinates boundary validation
    latitude NUMERIC(9,6) NOT NULL CHECK (latitude >= 25.800000 AND latitude <= 26.700000),
    longitude NUMERIC(9,6) NOT NULL CHECK (longitude >= 88.600000 AND longitude <= 90.100000),
    vehicle_allowed vehicle_access NOT NULL DEFAULT 'all_vehicles',
    entry_gate_desc TEXT,
    avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (avg_rating >= 0.00 AND avg_rating <= 5.00),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.pandals IS 'Directory of verified and candidate Durga Puja pandals with geo boundaries and accessibility metadata.';

-- Indexes for pandal discovery
CREATE INDEX IF NOT EXISTS idx_pandals_zone ON public.pandals(zone);
CREATE INDEX IF NOT EXISTS idx_pandals_tier ON public.pandals(tier);
CREATE INDEX IF NOT EXISTS idx_pandals_coordinates ON public.pandals(latitude, longitude);

-- -----------------------------------------------------------------------------
-- 4. TABLE: crowd_reports
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crowd_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    crowd_level crowd_level_status NOT NULL,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- Store client submission token or hashed IP signature on server insertions for abuse mitigation
    submission_ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.crowd_reports IS 'Time-series crowd status reports for pandals. Downweighted after 45 minutes.';

-- Indexes for rapid time-series crowd aggregation per pandal
CREATE INDEX IF NOT EXISTS idx_crowd_reports_pandal_time ON public.crowd_reports(pandal_id, reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_crowd_reports_reported_at ON public.crowd_reports(reported_at DESC);

-- -----------------------------------------------------------------------------
-- 5. TABLE: pandal_photos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pandal_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL CHECK (image_url ~* '^https?://[^\s]+$' OR image_url ~* '^[a-zA-Z0-9_\-\./]+$'),
    is_approved BOOLEAN NOT NULL DEFAULT false,
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ
);

COMMENT ON TABLE public.pandal_photos IS 'Pandal photos submitted by community or organizers. Only approved photos are publicly viewable.';

-- Indexes for photo retrieval and moderation queue
CREATE INDEX IF NOT EXISTS idx_pandal_photos_pandal_approved ON public.pandal_photos(pandal_id) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_pandal_photos_moderation_queue ON public.pandal_photos(created_at DESC) WHERE is_approved = false;

-- -----------------------------------------------------------------------------
-- 6. TABLE: amenities
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category amenity_category NOT NULL,
    latitude NUMERIC(9,6) NOT NULL CHECK (latitude >= 25.800000 AND latitude <= 26.700000),
    longitude NUMERIC(9,6) NOT NULL CHECK (longitude >= 88.600000 AND longitude <= 90.100000),
    helpline_number TEXT,
    is_24x7 BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.amenities IS 'Essential services such as Police booths, Hospitals, Drinking water, and Toilets.';

-- Indexes for amenity filtering
CREATE INDEX IF NOT EXISTS idx_amenities_category ON public.amenities(category);
CREATE INDEX IF NOT EXISTS idx_amenities_coordinates ON public.amenities(latitude, longitude);

-- -----------------------------------------------------------------------------
-- 7. CROWD AGGREGATION & EXPIRATION LOGIC (45-Minute Window)
-- -----------------------------------------------------------------------------
-- Materialized or computed view for active crowd status within recent 45 minutes
CREATE OR REPLACE VIEW public.active_pandal_crowd AS
SELECT
    pandal_id,
    MODE() WITHIN GROUP (ORDER BY crowd_level) AS current_crowd_level,
    COUNT(*) AS recent_reports_count,
    MAX(reported_at) AS last_reported_at
FROM public.crowd_reports
WHERE reported_at >= (timezone('utc'::text, now()) - INTERVAL '45 minutes')
GROUP BY pandal_id;

COMMENT ON VIEW public.active_pandal_crowd IS 'Calculates recent consensus crowd level ignoring reports older than 45 minutes.';
