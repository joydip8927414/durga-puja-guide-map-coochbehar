# Cooch Behar Durga Puja Interactive Guide & Navigation App

A mobile-first, production-oriented Progressive Web App (PWA) designed to assist residents, visitors, seniors, and families navigating Durga Puja pandals, routes, amenities, and real-time crowd updates across Cooch Behar, West Bengal.

---

## Features Planned

- **Pandal Directory & Search**: Comprehensive bilingual (Bengali & English) directory with search, zones, and themes.
- **Interactive Map**: OpenStreetMap & React Leaflet integration displaying pandal locations, zones, and essential amenities.
- **Accessible Route Planning**: Curated walking and vehicle routes, optimized for senior citizens and families.
- **Live Crowd Updates**: Community crowd level reporting with abuse prevention, rate limiting, and 45-minute decay.
- **Essential Amenities Directory**: Quick access to police assistance booths, medical camps, drinking water, restrooms, and emergency contacts.
- **Offline PWA Capabilities**: High resilience with offline map caching and essential emergency contact lists.

---

## Design System Tokens

The application design is built around the cultural aesthetics of Durga Puja and Cooch Behar heritage:

| Token | Name | Hex Code | Purpose |
|---|---|---|---|
| `--color-royal-crimson` | Royal Crimson | `#881337` | Primary brand & navigation headers |
| `--color-crimson-accent`| Crimson Accent| `#9F1239` | Badges, interactive highlights |
| `--color-temple-gold`   | Temple Gold   | `#F59E0B` | Accent highlights, focus rings |
| `--color-deep-gold`     | Deep Gold     | `#D97706` | Secondary accents, icons |
| `--color-dark-bg`       | Dark Background| `#0F172A`| Dark mode background |
| `--color-light-bg`      | Light Background| `#FFFFFF`| Light mode background |

### Accessibility Standards
- Minimum **48px touch targets** (`.touch-target-min`) on all interactive buttons and navigation links.
- High-contrast visible focus indicators (`.focus-ring`).
- WCAG AA contrast compliance across light and dark themes.

---

## Prerequisites

- **Node.js**: v20+ or v24+ LTS
- **npm**: v10+ or v11+
- **Git**
- **Supabase Project** (Cloud instance or local PostgreSQL instance)

---

## Getting Started

### 1. Clone the repository and install dependencies
```bash
git clone <repository-url>
cd DURGA
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```
**CRITICAL SECURITY WARNING**: Never commit `.env.local` to Git. Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.

---

## Database Migrations & Seed Data

The project contains version-controlled SQL migrations located in `supabase/migrations/`:

- `supabase/migrations/20261012000001_create_durga_puja_schema.sql`: Tables (`pandals`, `crowd_reports`, `pandal_photos`, `amenities`, `app_admins`), check constraints, enums, geo-boundaries, and the `active_pandal_crowd` 45-minute view.
- `supabase/migrations/20261012000002_enforce_row_level_security.sql`: RLS enablement and explicit least-privilege policies.
- `supabase/seed.sql`: Idempotent seed data for initial pandal candidates and verified emergency amenities.

### Applying Migrations via Supabase CLI
If using the Supabase CLI linked to your project:
```bash
# Push migrations to remote database
npx supabase db push

# Apply seed data
npx supabase db reset  # or run seed.sql
```

### Applying Migrations via Supabase Web Dashboard
1. Open your Supabase Project Dashboard -> **SQL Editor**.
2. Run `supabase/migrations/20261012000001_create_durga_puja_schema.sql`.
3. Run `supabase/migrations/20261012000002_enforce_row_level_security.sql`.
4. Run `supabase/seed.sql` to populate initial landmarks and amenities.

---

## Database Security & Verification Tests

A comprehensive SQL test suite is available at `supabase/tests/database_security_test.sql`.

### Tested Security Guarantees:
1. **RLS Enforcement**: Verifies RLS is enabled on all 5 application tables.
2. **Geo-Boundary Constraints**: Rejects latitude/longitude coordinates outside Cooch Behar District (`25.8 - 26.7 N`, `88.6 - 90.1 E`).
3. **Rating Constraints**: Rejects invalid ratings (> 5.0 or < 0.0).
4. **Enum Integrity**: Rejects invalid crowd density statuses.
5. **Anonymous Write Denial**: Verifies unauthenticated visitors cannot insert or update pandals.
6. **Photo Moderation Isolation**: Verifies visitors cannot self-approve photo records, and unapproved photos are invisible to public visitors.
7. **Privilege Escalation Denial**: Verifies users cannot self-assign administrator roles.
8. **45-Minute Window**: Verifies that crowd reports older than 45 minutes are excluded from real-time calculations.

To execute the test suite in `psql` or the Supabase SQL editor:
```sql
-- Paste and run supabase/tests/database_security_test.sql
-- The suite runs within a transaction and automatically rolls back.
```

---

## How Administrator Authorization Works

- **No Self-Assignment**: Administrator status is NOT determined by user metadata or client JWT claims.
- **Server-Verifiable Roster**: Verified administrators are stored in `public.app_admins (user_id, role)`.
- **First Admin Provisioning**: Bootstrapping the first super administrator must be performed by a database administrator using the Supabase SQL editor:
  ```sql
  INSERT INTO public.app_admins (user_id, role)
  VALUES ('<USER-UUID-FROM-AUTH.USERS>', 'super_admin');
  ```
- Detailed security documentation is available in [DATABASE_SECURITY.md](docs/DATABASE_SECURITY.md).

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the production bundle.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint analysis.
- `npx tsc --noEmit`: Runs TypeScript strict type checking.

---

## Deployment to Vercel

The application is optimized for deployment on **Vercel** with Next.js App Router, Turbopack, and Supabase integration.

- **Quick Deploy via Dashboard**: Import repository `joydip8927414/durga-puja-guide-map-coochbehar` on [vercel.com](https://vercel.com).
- **Environment Variables**: Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- **Full Guide**: See [docs/DEPLOYMENT_VERCEL.md](docs/DEPLOYMENT_VERCEL.md) for step-by-step instructions, CLI deployment, custom domain setup, and pre-flight checklists.

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages and layout
  components/             # Shared UI components (TouchButton, etc.)
  features/               # Domain-specific modules
    pandals/              # Pandal directory and filters
    maps/                 # Map coordinates and tile configurations
    routes/               # Distance calculation and route plans
    crowd/                # Crowd severity scoring and contracts
    amenities/            # Emergency and essential facilities
  lib/
    supabase/             # Isolated browser and server Supabase clients
    security/             # Security headers, abuse prevention, and rate limits
    validation/           # Server-side input sanitization and schema checks
  types/                  # Core domain & Supabase database TypeScript definitions
supabase/
  migrations/             # Version-controlled SQL schema and RLS migrations
  seed.sql                # Idempotent seed data for pandals and amenities
  tests/                  # SQL security test suite
docs/
  DATABASE_SECURITY.md    # Detailed RLS matrix and security policy documentation
```

---

## Security Policy

Please review [SECURITY.md](SECURITY.md) and [DATABASE_SECURITY.md](docs/DATABASE_SECURITY.md) for full details on security boundaries, secret management, CSP policies, and vulnerability reporting procedures.
