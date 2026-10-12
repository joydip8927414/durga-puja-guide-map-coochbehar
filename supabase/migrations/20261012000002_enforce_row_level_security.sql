-- ==============================================================================
-- Migration: 20261012000002_enforce_row_level_security.sql
-- Description: Enable Row Level Security (RLS) and establish least-privilege policies
-- Security Scope:
--   1. pandals: Public SELECT; Admin-only INSERT/UPDATE/DELETE
--   2. crowd_reports: Public SELECT (recent crowd state); Authenticated/Server INSERT; No direct updates/deletes
--   3. pandal_photos: Public SELECT (approved only); Uploader/Admin SELECT; Admin-only approval/update/delete
--   4. amenities: Public SELECT; Admin-only INSERT/UPDATE/DELETE
--   5. app_admins: Super-admin only management; Authenticated check functions
-- ==============================================================================

-- -----------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ACROSS ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandal_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS FOR ROLE VERIFICATION (SECURITY DEFINER with strict search_path)
-- -----------------------------------------------------------------------------
-- Check if current authenticated user is registered as an admin or moderator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_admins
    WHERE user_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS 'Verifies if auth.uid() has administrative status in app_admins. Secure search_path applied.';

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_admins
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

COMMENT ON FUNCTION public.is_super_admin() IS 'Verifies if auth.uid() has super_admin privileges. Secure search_path applied.';

-- Revoke default execute permissions from public on security definer functions, grant to authenticated
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 3. POLICIES: app_admins
-- -----------------------------------------------------------------------------
-- Admins can view other admins
CREATE POLICY "Admins can view admin roster"
ON public.app_admins
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Only super admins can assign or remove admin roles
CREATE POLICY "Super admins can manage admin assignments"
ON public.app_admins
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- -----------------------------------------------------------------------------
-- 4. POLICIES: pandals
-- -----------------------------------------------------------------------------
-- Public visitors (anon and authenticated) may read all verified pandal listings
CREATE POLICY "Public visitors can view pandal directory"
ON public.pandals
FOR SELECT
TO anon, authenticated
USING (true);

-- Only verified administrators can insert, update, or delete pandal records
CREATE POLICY "Admins can insert pandals"
ON public.pandals
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update pandals"
ON public.pandals
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete pandals"
ON public.pandals
FOR DELETE
TO authenticated
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. POLICIES: crowd_reports
-- -----------------------------------------------------------------------------
-- Public visitors can read crowd reports (allows client-side view of recent crowd trends)
CREATE POLICY "Public visitors can view crowd reports"
ON public.crowd_reports
FOR SELECT
TO anon, authenticated
USING (true);

-- Submission Policy:
-- Authenticated users may insert reports for themselves.
-- Unauthenticated submissions must go through the rate-limited server action / API endpoint
-- using the service_role key OR authenticated session, preventing arbitrary spam to PostgreSQL.
CREATE POLICY "Authenticated users can submit crowd reports"
ON public.crowd_reports
FOR INSERT
TO authenticated
WITH CHECK (
    -- Ensure reporter_id matches the authenticated user's ID
    (reporter_id IS NULL OR reporter_id = auth.uid())
);

-- Deny direct client UPDATE and DELETE on crowd reports (immutable audit trail)
-- No UPDATE or DELETE policies created for anon/authenticated roles.
-- Only administrators or maintenance scripts can purge old/abusive records:
CREATE POLICY "Admins can moderate crowd reports"
ON public.crowd_reports
FOR DELETE
TO authenticated
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. POLICIES: pandal_photos
-- -----------------------------------------------------------------------------
-- Public visitors can read ONLY approved photos
CREATE POLICY "Public visitors can view approved photos"
ON public.pandal_photos
FOR SELECT
TO anon, authenticated
USING (is_approved = true);

-- Uploaders can view their own pending submissions
CREATE POLICY "Uploaders can view their pending photos"
ON public.pandal_photos
FOR SELECT
TO authenticated
USING (uploader_id = auth.uid());

-- Admins can view all photos (including unapproved moderation queue)
CREATE POLICY "Admins can view entire photo queue"
ON public.pandal_photos
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Authenticated users can submit photos, but cannot self-approve (is_approved must be false)
CREATE POLICY "Authenticated users can submit pending photos"
ON public.pandal_photos
FOR INSERT
TO authenticated
WITH CHECK (
    uploader_id = auth.uid()
    AND is_approved = false
);

-- Only admins can approve or modify photos
CREATE POLICY "Admins can moderate photo approvals"
ON public.pandal_photos
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete photos"
ON public.pandal_photos
FOR DELETE
TO authenticated
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. POLICIES: amenities
-- -----------------------------------------------------------------------------
-- Public visitors can view all amenities (police, hospitals, toilets, water, etc.)
CREATE POLICY "Public visitors can view amenities"
ON public.amenities
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage amenities
CREATE POLICY "Admins can insert amenities"
ON public.amenities
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update amenities"
ON public.amenities
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete amenities"
ON public.amenities
FOR DELETE
TO authenticated
USING (public.is_admin());
