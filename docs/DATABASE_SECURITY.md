# Database Security Architecture & Row Level Security (RLS) Specification

## 1. Overview & Threat Model

The **Cooch Behar Durga Puja Interactive Guide & Navigation App** utilizes Supabase PostgreSQL as its primary persistent datastore and Supabase Auth as the identity provider.

Because clients interact with PostgreSQL via Supabase's auto-generated PostgREST Data API, the primary line of defense against unauthorized modification, privilege escalation, and data theft is **PostgreSQL Row Level Security (RLS)** coupled with **Server-Side Validation**.

### Untrusted Client Environment
- All client-side JavaScript (browser) executing with the `NEXT_PUBLIC_SUPABASE_ANON_KEY` is completely untrusted.
- Attackers can issue raw PostgREST queries directly against `/rest/v1/*`.
- Client-side route protections, hidden buttons, or disabled forms offer zero security protection against API calls.
- Every privilege check must be evaluated inside the PostgreSQL engine or in server-only Server Actions.

---

## 2. Table-by-Table Access Control & RLS Matrix

| Table | Operation | Allowed Roles | Enforcement Mechanism / Condition | Justification |
|---|---|---|---|---|
| **`pandals`** | `SELECT` | `anon`, `authenticated` | `USING (true)` | Public directory of Durga Puja pandals must be universally accessible to all visitors. |
| **`pandals`** | `INSERT` | `authenticated` (Admin only) | `WITH CHECK (public.is_admin())` | Visitors must not create rogue pandal listings. |
| **`pandals`** | `UPDATE` | `authenticated` (Admin only) | `USING/CHECK (public.is_admin())` | Pandal metadata, themes, and coordinates are official records. |
| **`pandals`** | `DELETE` | `authenticated` (Admin only) | `USING (public.is_admin())` | Only verified administrators can delist pandals. |
| **`crowd_reports`** | `SELECT` | `anon`, `authenticated` | `USING (true)` | Required to display real-time crowd heatmaps and trends to visitors. |
| **`crowd_reports`** | `INSERT` | `authenticated` / Server | `WITH CHECK ((reporter_id IS NULL OR reporter_id = auth.uid()))` | Prevents spoofing arbitrary reporter IDs. Unauthenticated reports go through server action with rate-limiting. |
| **`crowd_reports`** | `UPDATE` | *None* | *No policy defined* | Crowd reports are immutable time-series data; updates are strictly prohibited. |
| **`crowd_reports`** | `DELETE` | `authenticated` (Admin only) | `USING (public.is_admin())` | Ordinary users cannot delete reports; admins can purge abusive reports. |
| **`pandal_photos`** | `SELECT` | `anon`, `authenticated` | `USING (is_approved = true)` | Public visitors can only view moderation-approved photos. |
| **`pandal_photos`** | `SELECT` | `authenticated` (Uploader) | `USING (uploader_id = auth.uid())` | Uploaders can view their own pending/rejected photos. |
| **`pandal_photos`** | `SELECT` | `authenticated` (Admin) | `USING (public.is_admin())` | Administrators can view the unapproved moderation queue. |
| **`pandal_photos`** | `INSERT` | `authenticated` | `WITH CHECK (uploader_id = auth.uid() AND is_approved = false)` | Users can submit photos, but cannot self-approve (`is_approved` must be `false`). |
| **`pandal_photos`** | `UPDATE` | `authenticated` (Admin only) | `USING/CHECK (public.is_admin())` | Only administrators can change `is_approved = true`. |
| **`pandal_photos`** | `DELETE` | `authenticated` (Admin only) | `USING (public.is_admin())` | Prevents unauthorized photo deletion. |
| **`amenities`** | `SELECT` | `anon`, `authenticated` | `USING (true)` | Police booths, hospitals, drinking water, and restrooms must be publicly visible. |
| **`amenities`** | `INSERT/UPDATE/DELETE` | `authenticated` (Admin only) | `USING/CHECK (public.is_admin())` | Emergency facilities can only be managed by administrators. |
| **`app_admins`** | `SELECT` | `authenticated` (Admin only) | `USING (public.is_admin())` | Roster of administrators is protected from normal visitors. |
| **`app_admins`** | `ALL` | `authenticated` (Super Admin) | `USING/CHECK (public.is_super_admin())` | Only super administrators can assign or revoke moderator roles. |

---

## 3. Administrator Role Strategy & Provisioning

### Why Not JWT User Metadata?
Supabase Auth allows storing user metadata (e.g. `raw_user_meta_data->>'is_admin'`). However, by default, users can update their own user metadata via client-side `supabase.auth.updateUser({ data: { is_admin: true } })`. Relying on user metadata for authorization creates a critical privilege escalation vulnerability.

### Server-Verifiable Strategy: `public.app_admins` Table
1. Administrator roles are stored in a dedicated table `public.app_admins (user_id, role)`.
2. Normal users have **zero write access** to `public.app_admins`.
3. The helper functions `public.is_admin()` and `public.is_super_admin()` are declared `SECURITY DEFINER` with fixed `search_path = public, auth` to query this table securely without search-path hijacking.

### Initial Super Admin Provisioning Process
To bootstrap the first administrator without backdoors:
1. The administrator registers an account through normal Supabase Auth (or is created via Supabase Dashboard Auth tab).
2. The initial super administrator role is assigned directly via PostgreSQL migration or the Supabase SQL editor using database superuser credentials:
   ```sql
   INSERT INTO public.app_admins (user_id, role)
   VALUES ('<USER-UUID-FROM-AUTH.USERS>', 'super_admin');
   ```
3. Once provisioned, that super administrator can grant `moderator` or `police_liaison` roles to other team members.

---

## 4. Crowd Reporting Abuse Prevention & 45-Minute Window

### Attack Vectors on Crowd Reporting
1. **Scripted Rating Bombing**: Flooding a pandal with fake 'HIGH' or 'LOW' crowd reports.
2. **Reporter Identity Spoofing**: Submitting reports claiming to be another user.
3. **Stale Data Skewing**: Historical reports from hours ago dominating the real-time average.

### Mitigations Implemented
1. **Server-Side Submission Boundary**: Unauthenticated submissions must pass through a Next.js Server Action where:
   - Input fields are sanitized.
   - An in-memory/Redis rate limiter verifies the request frequency per client token or IP.
   - A cryptographic hash of the client identifier is recorded into `submission_ip_hash` for audit purposes.
2. **Reporter ID Verification**: RLS ensures that if `reporter_id` is supplied, it strictly matches `auth.uid()`.
3. **45-Minute Real-Time Calculation**: The `active_pandal_crowd` database view explicitly restricts calculation to:
   ```sql
   WHERE reported_at >= (timezone('utc'::text, now()) - INTERVAL '45 minutes')
   ```
   Older reports are retained for historical audit and traffic trend analysis, but are dynamically excluded from live user guidance.

---

## 5. Photo Moderation Workflow

1. A community member submits a photo with `image_url` and their authenticated `uploader_id`.
2. The RLS check constraint enforces `is_approved = false`. Any attempt to send `is_approved: true` will immediately fail the check policy.
3. The photo is invisible to anonymous visitors because the public `SELECT` policy requires `is_approved = true`.
4. Only members verified by `public.is_admin()` can view the moderation queue and toggle `is_approved = true`.

---

## 6. Geographic Constraint Boundaries

To prevent malicious or anomalous location entries (e.g. coordinates in other continents), the database schema enforces:
- `latitude CHECK (latitude >= 25.800000 AND latitude <= 26.700000)`
- `longitude CHECK (longitude >= 88.600000 AND longitude <= 90.100000)`

These constraints cover the entirety of Cooch Behar District (including Tufanganj, Dinhata, Mathabhanga, Mekhliganj, and Haldibari). Any insert or update outside this envelope is rejected by PostgreSQL.
