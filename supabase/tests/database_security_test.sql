-- ==============================================================================
-- Security Verification & RLS Test Suite
-- Target: Supabase PostgreSQL / Local Postgres
-- Instructions: Run in psql or Supabase SQL Editor to verify security controls.
-- ==============================================================================

\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
    v_test_pandal_id UUID;
    v_test_photo_id UUID;
    v_admin_id UUID := gen_random_uuid();
    v_visitor_id UUID := gen_random_uuid();
    v_victim_id UUID := gen_random_uuid();
    v_test_count INTEGER;
BEGIN
    RAISE NOTICE '=== STARTING DATABASE SECURITY & RLS VERIFICATION SUITE ===';

    -- -------------------------------------------------------------------------
    -- TEST 1: Verify RLS is Enabled on ALL Application Tables
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 1] Verifying RLS status on all tables...';
    
    SELECT COUNT(*) INTO v_test_count
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = 'public'
      AND t.tablename IN ('pandals', 'crowd_reports', 'pandal_photos', 'amenities', 'app_admins')
      AND c.relrowsecurity = true;

    IF v_test_count <> 5 THEN
        RAISE EXCEPTION 'TEST 1 FAILED: Not all application tables have Row Level Security enabled. Count: %', v_test_count;
    END IF;
    RAISE NOTICE '[Test 1 PASSED] All 5 core tables have RLS enabled.';

    -- -------------------------------------------------------------------------
    -- TEST 2: Schema Constraints - Rejection of Invalid Geographic Coordinates
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 2] Testing coordinate constraint boundaries...';
    
    -- Attempting insertion outside Cooch Behar District (e.g. Bangalore latitude: 12.9716)
    BEGIN
        INSERT INTO public.pandals (
            code_name, name, zone, latitude, longitude
        ) VALUES (
            'test-invalid-geo', 'Invalid Pandal', 'Test', 12.9716, 89.4510
        );
        RAISE EXCEPTION 'TEST 2 FAILED: Latitude outside Cooch Behar was erroneously allowed!';
    EXCEPTION
        WHEN check_violation THEN
            RAISE NOTICE '[Test 2.1 PASSED] Out-of-bounds latitude correctly rejected by CHECK constraint.';
    END;

    -- Attempting insertion of invalid longitude (e.g. London longitude: 0.1276)
    BEGIN
        INSERT INTO public.pandals (
            code_name, name, zone, latitude, longitude
        ) VALUES (
            'test-invalid-lon', 'Invalid Pandal', 'Test', 26.3239, 0.1276
        );
        RAISE EXCEPTION 'TEST 2 FAILED: Longitude outside Cooch Behar was erroneously allowed!';
    EXCEPTION
        WHEN check_violation THEN
            RAISE NOTICE '[Test 2.2 PASSED] Out-of-bounds longitude correctly rejected by CHECK constraint.';
    END;

    -- Attempting invalid rating (> 5.0)
    BEGIN
        INSERT INTO public.pandals (
            code_name, name, zone, latitude, longitude, avg_rating
        ) VALUES (
            'test-invalid-rating', 'Invalid Rating Pandal', 'Test', 26.3239, 89.4510, 6.50
        );
        RAISE EXCEPTION 'TEST 2 FAILED: avg_rating > 5.0 was erroneously allowed!';
    EXCEPTION
        WHEN check_violation THEN
            RAISE NOTICE '[Test 2.3 PASSED] Invalid avg_rating correctly rejected by CHECK constraint.';
    END;

    -- -------------------------------------------------------------------------
    -- TEST 3: Schema Constraints - Rejection of Invalid Crowd Levels
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 3] Testing crowd level enum constraints...';
    
    -- Insert a valid dummy pandal for foreign-key testing
    INSERT INTO public.pandals (
        code_name, name, zone, latitude, longitude
    ) VALUES (
        'sec-test-pandal', 'Security Test Pandal', 'Test Ward', 26.3239, 89.4510
    ) RETURNING id INTO v_test_pandal_id;

    BEGIN
        INSERT INTO public.crowd_reports (
            pandal_id, crowd_level
        ) VALUES (
            v_test_pandal_id, 'EXTREME'::crowd_level_status
        );
        RAISE EXCEPTION 'TEST 3 FAILED: Invalid crowd status was erroneously accepted!';
    EXCEPTION
        WHEN invalid_text_representation OR datatype_mismatch THEN
            RAISE NOTICE '[Test 3 PASSED] Non-enum crowd level correctly rejected.';
    END;

    -- -------------------------------------------------------------------------
    -- TEST 4: Anonymous Visitor Write Denial (Under Anon Role Simulation)
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 4] Verifying anonymous visitors cannot insert/update pandals...';
    
    -- Set session role to anon
    SET LOCAL ROLE anon;

    BEGIN
        INSERT INTO public.pandals (
            code_name, name, zone, latitude, longitude
        ) VALUES (
            'anon-exploit-pandal', 'Hacked Pandal', 'Test', 26.3239, 89.4510
        );
        RAISE EXCEPTION 'TEST 4 FAILED: Anonymous role was able to INSERT into public.pandals!';
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE '[Test 4.1 PASSED] Anonymous role prevented from inserting pandals.';
    END;

    BEGIN
        UPDATE public.pandals SET name = 'Defaced' WHERE id = v_test_pandal_id;
        -- In RLS, UPDATE might affect 0 rows or throw insufficient_privilege
        IF FOUND THEN
            RAISE EXCEPTION 'TEST 4 FAILED: Anonymous role was able to UPDATE pandals!';
        ELSE
            RAISE NOTICE '[Test 4.2 PASSED] Anonymous role prevented from updating pandals.';
        END IF;
    END;

    -- -------------------------------------------------------------------------
    -- TEST 5: Photo Approval Isolation - Visitors Cannot Approve Photos
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 5] Verifying visitors cannot approve photos...';
    
    -- Reset to postgres to create test photo
    RESET ROLE;
    INSERT INTO public.pandal_photos (
        pandal_id, image_url, is_approved, uploader_id
    ) VALUES (
        v_test_pandal_id, 'https://example.com/pandal1.jpg', false, v_visitor_id
    ) RETURNING id INTO v_test_photo_id;

    -- Test under simulated authenticated visitor
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claims" TO '{"sub": "00000000-0000-0000-0000-000000000001"}';

    -- Try approving photo
    UPDATE public.pandal_photos SET is_approved = true WHERE id = v_test_photo_id;
    IF FOUND THEN
        RAISE EXCEPTION 'TEST 5 FAILED: Normal authenticated user was able to approve photos!';
    ELSE
        RAISE NOTICE '[Test 5 PASSED] Normal user prevented from approving photos.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 6: Public Read Isolation - Unapproved Photos are Hidden from Anon
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 6] Verifying unapproved photos are invisible to anon...';
    
    SET LOCAL ROLE anon;
    SELECT COUNT(*) INTO v_test_count FROM public.pandal_photos WHERE id = v_test_photo_id;
    IF v_test_count <> 0 THEN
        RAISE EXCEPTION 'TEST 6 FAILED: Unapproved photo was visible to anonymous visitors!';
    ELSE
        RAISE NOTICE '[Test 6 PASSED] Unapproved photo is strictly hidden from anonymous visitors.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 7: Role Privilege Escalation Denial
    -- -------------------------------------------------------------------------
    RAISE NOTICE '[Test 7] Verifying users cannot self-assign admin roles...';
    
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claims" TO '{"sub": "00000000-0000-0000-0000-000000000001"}';

    BEGIN
        INSERT INTO public.app_admins (user_id, role)
        VALUES ('00000000-0000-0000-0000-000000000001', 'super_admin');
        RAISE EXCEPTION 'TEST 7 FAILED: Normal user was able to insert into app_admins!';
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE '[Test 7 PASSED] Privilege escalation blocked. Normal users cannot write to app_admins.';
    END;

    -- -------------------------------------------------------------------------
    -- TEST 8: 45-Minute Crowd Window Calculation Verification
    -- -------------------------------------------------------------------------
    RESET ROLE;
    RAISE NOTICE '[Test 8] Verifying active_pandal_crowd 45-minute window view...';

    -- Insert recent report (10 mins ago)
    INSERT INTO public.crowd_reports (
        pandal_id, crowd_level, reported_at
    ) VALUES (
        v_test_pandal_id, 'HIGH'::crowd_level_status, timezone('utc'::text, now()) - INTERVAL '10 minutes'
    );

    -- Insert expired report (60 mins ago)
    INSERT INTO public.crowd_reports (
        pandal_id, crowd_level, reported_at
    ) VALUES (
        v_test_pandal_id, 'LOW'::crowd_level_status, timezone('utc'::text, now()) - INTERVAL '60 minutes'
    );

    SELECT recent_reports_count INTO v_test_count
    FROM public.active_pandal_crowd
    WHERE pandal_id = v_test_pandal_id;

    IF v_test_count <> 1 THEN
        RAISE EXCEPTION 'TEST 8 FAILED: 45-minute crowd view included expired reports! Count: %', v_test_count;
    ELSE
        RAISE NOTICE '[Test 8 PASSED] Expired (>45m) reports correctly excluded from active crowd calculation.';
    END IF;

    RAISE NOTICE '=== ALL DATABASE SECURITY & RLS VERIFICATION TESTS PASSED ===';
END $$;

-- Rollback test transaction so verification doesn't pollute database
ROLLBACK;
