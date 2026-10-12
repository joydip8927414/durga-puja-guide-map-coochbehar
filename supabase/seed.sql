-- ==============================================================================
-- Seed: seed.sql (Idempotent seed data for Cooch Behar Durga Puja Guide)
-- Description: Initial verified landmark and candidate development fixtures.
-- Verification Notice:
--   - Boro Debi Temple (Madan Mohan / Debibari) has historic geographic coordinates.
--   - Candidate club locations are clearly flagged as development fixtures
--     with '[DEV-CANDIDATE: Requires Field Verification]' in entry_gate_desc.
--   - Does NOT blindly duplicate the 26.3239, 89.4510 center point.
-- Safe to rerun: Uses ON CONFLICT (code_name) DO UPDATE.
-- ==============================================================================

-- -----------------------------------------------------------------------------
-- 1. SEED PANDALS
-- -----------------------------------------------------------------------------
INSERT INTO public.pandals (
    code_name,
    name,
    zone,
    tier,
    milestone_year,
    latitude,
    longitude,
    vehicle_allowed,
    entry_gate_desc,
    avg_rating
) VALUES
(
    'boro-debi-bari',
    'Boro Debi Temple (Debibari)',
    'Cooch Behar Town (Madan Mohan Bari Ward)',
    'top_5',
    'Est. 1510 (500+ Years Heritage)',
    26.324500,
    89.452200,
    'two_wheeler_only',
    'Main Debibari Gate, N.N. Road. Strict pedestrian zone during Ashtami/Navami rituals. [Verified Cultural Landmark]',
    4.95
),
(
    'subhash-pally-club',
    'Subhash Pally Sarbojanin Durga Puja',
    'Subhash Pally / Ward 10',
    'top_10',
    '50th Year Golden Jubilee',
    26.328800,
    89.445500,
    'two_wheeler_only',
    '[DEV-CANDIDATE: Requires Field Verification] Near Subhash Pally Community Hall, designated one-way pedestrian queue.',
    4.70
),
(
    'guriahati-club',
    'Guriahati Netaji Sangha & Club',
    'Guriahati Gram Panchayat',
    'top_10',
    '40+ Years Tradition',
    26.312200,
    89.467800,
    'all_vehicles',
    '[DEV-CANDIDATE: Requires Field Verification] Guriahati Main Road approach with designated fairground entry.',
    4.55
),
(
    'khagrabari-club',
    'Khagrabari Milan Sangha',
    'Khagrabari Bypass Zone',
    'top_20',
    '35 Years Tradition',
    26.345600,
    89.431200,
    'all_vehicles',
    '[DEV-CANDIDATE: Requires Field Verification] Bypass connector road gate, spacious vehicle parking available.',
    4.40
),
(
    'rocky-club',
    'Rocky Club Sarbojanin Durgotsav',
    'New Town / Kalighat Road',
    'top_10',
    '45+ Years Theme Puja',
    26.319500,
    89.442100,
    'two_wheeler_only',
    '[DEV-CANDIDATE: Requires Field Verification] Kalighat Road entrance, senior citizen & wheelchair accessible ramp on East Gate.',
    4.65
)
ON CONFLICT (code_name) DO UPDATE SET
    name = EXCLUDED.name,
    zone = EXCLUDED.zone,
    tier = EXCLUDED.tier,
    milestone_year = EXCLUDED.milestone_year,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    vehicle_allowed = EXCLUDED.vehicle_allowed,
    entry_gate_desc = EXCLUDED.entry_gate_desc,
    avg_rating = EXCLUDED.avg_rating,
    updated_at = timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 2. SEED AMENITIES (Verified Essential Services)
-- -----------------------------------------------------------------------------
INSERT INTO public.amenities (
    name,
    category,
    latitude,
    longitude,
    helpline_number,
    is_24x7
) VALUES
(
    'Kotwali Police Station (Cooch Behar Sadar)',
    'POLICE',
    26.326200,
    89.448500,
    '03582-222303 / 112',
    true
),
(
    'Maharaja Jitendra Narayan Medical College & Hospital (MJN Hospital)',
    'HOSPITAL',
    26.329100,
    89.443900,
    '03582-222238 / 102',
    true
),
(
    'Cooch Behar Fire Emergency & Rescue Station',
    'FIRE_STATION',
    26.322800,
    89.456100,
    '03582-222201 / 101',
    true
),
(
    'Madan Mohan Bari Public Drinking Water Facility',
    'WATER',
    26.324100,
    89.451800,
    NULL,
    true
),
(
    'Central Bus Terminus Sanitized Restrooms & Toilet Block',
    'TOILET',
    26.331500,
    89.459000,
    NULL,
    true
)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. SEED INITIAL BASELINE CROWD REPORT (Sample baseline verification)
-- -----------------------------------------------------------------------------
INSERT INTO public.crowd_reports (
    pandal_id,
    crowd_level,
    reported_at,
    submission_ip_hash
)
SELECT
    id,
    'MED'::crowd_level_status,
    timezone('utc'::text, now()),
    'seed_baseline'
FROM public.pandals
WHERE code_name = 'boro-debi-bari'
ON CONFLICT DO NOTHING;
