# Deploying Cooch Behar Durga Puja Guide to Vercel

This guide provides step-by-step instructions for deploying the **Cooch Behar Durga Puja Interactive Guide & Navigation App** to **Vercel** with continuous deployment from GitHub.

---

## 1. Prerequisites

Before starting your deployment, ensure you have:

1. A [Vercel account](https://vercel.com/signup).
2. Access to the GitHub repository: [`joydip8927414/durga-puja-guide-map-coochbehar`](https://github.com/joydip8927414/durga-puja-guide-map-coochbehar).
3. Your Supabase project URL and keys (from your [Supabase Dashboard](https://supabase.com/dashboard) -> **Project Settings** -> **API**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Server-side operations only)

---

## 2. Recommended: Deployment via Vercel Dashboard (Git Integration)

This method connects directly to your GitHub repository and enables automatic deployments for every commit.

### Step 2.1 — Import Project

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Under **Import Git Repository**, locate:
   ```
   joydip8927414/durga-puja-guide-map-coochbehar
   ```
4. Click **Import**.

### Step 2.2 — Configure Project Settings

Vercel automatically detects the Next.js framework preset:

| Setting | Value | Notes |
|---|---|---|
| **Framework Preset** | `Next.js` | Auto-detected |
| **Root Directory** | `./` | Leave blank / default |
| **Build Command** | `npm run build` | Default `next build` |
| **Output Directory** | `.next` | Auto-detected |
| **Install Command** | `npm install` | Default |
| **Node.js Version** | `20.x` or `22.x` | Set in Project Settings > General if needed |

### Step 2.3 — Configure Environment Variables

Expand the **Environment Variables** section and add the following keys:

| Key | Example Value | Environments | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzproject.supabase.co` | Production, Preview, Development | Public URL for client & map data |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production, Preview, Development | Public Anon key for client queries |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Production | Server-side trusted key (never expose to client) |

> [!CAUTION]
> **Security Notice**: Never add `NEXT_PUBLIC_` prefix to `SUPABASE_SERVICE_ROLE_KEY`. Vercel automatically separates server environment variables from client bundles.

### Step 2.4 — Deploy

1. Click **Deploy**.
2. Vercel will install dependencies, compile TypeScript, run Next.js build with Turbopack, and provision edge routing.
3. Once finished, you will receive a live URL (e.g., `https://durga-puja-guide-map-coochbehar.vercel.app`).

---

## 3. Alternative: Deployment via Vercel CLI

If you prefer deploying directly from your terminal or CI runner:

### Step 3.1 — Install & Authenticate

```bash
# Log in to Vercel
npx vercel login
```

### Step 3.2 — Link the Project

Link your local repository to a Vercel project:

```bash
npx vercel link
```
Follow the interactive prompts:
- **Set up and deploy?**: `yes`
- **Which scope?**: Select your personal or team account
- **Link to existing project?**: `no` (or `yes` if previously created)
- **What's your project's name?**: `coochbehar-durga-puja-guide`
- **In which directory is your code located?**: `./`

### Step 3.3 — Set Environment Variables via CLI

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
```
*(Enter the respective values when prompted by the CLI)*

### Step 3.4 — Trigger Production Deploy

```bash
npx vercel --prod
```

The CLI will print your live deployment URL upon completion.

---

## 4. Branch & CI/CD Workflow

Once linked with GitHub, Vercel provides automated workflows:

| Branch | Environment | Behavior |
|---|---|---|
| `main` | **Production** | Automatically deployed to the live domain whenever merged or pushed. |
| `jd` or feature branches | **Preview** | Generates an isolated preview deployment URL (e.g., `*-git-jd-*.vercel.app`) with full functionality to review before merging. |

---

## 5. Domain Configuration (Optional)

To attach a custom domain (e.g., `durgapuja.coochbehar.gov.in` or `coochbehardurga.in`):

1. Go to your Vercel Project Dashboard -> **Settings** -> **Domains**.
2. Enter your custom domain name and click **Add**.
3. Configure the DNS records at your domain registrar:
   - **Apex domain (`example.com`)**: `A` record pointing to `76.76.21.21`
   - **Subdomain (`www.example.com` or `durga.example.com`)**: `CNAME` record pointing to `cname.vercel-dns.com`
4. Vercel automatically generates and renews a free **Let's Encrypt SSL/TLS certificate**.

---

## 6. Post-Deployment Verification Checklist

After deploying to Vercel, verify the following:

- [ ] **HTTPS Enforced**: Geolocation (`navigator.geolocation`) requires HTTPS to function; verify your browser prompts for location permission when clicking "My Location".
- [ ] **Map Tiles Load**: Verify OpenStreetMap tiles render without CSP blocks (checked in browser Console / Network tab).
- [ ] **Maa Durga Graphic**: Confirm `/maa-durga.jpg` loads smoothly in the floating search bar and banners.
- [ ] **Filter Chips & Interactive State**: Test switching between *Map*, *Pandals*, *Gallery*, and *Emergency* tabs.
- [ ] **Mobile Responsiveness**: Open on a mobile device or responsive emulator (ensure minimum 48px touch targets and bottom navigation bar work smoothly).
- [ ] **Security Headers**: Inspect response headers for `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.

---

## 7. Troubleshooting

### Issue: Leaflet `window is not defined`
- **Cause**: Leaflet relies on browser window APIs during server-side rendering (SSR).
- **Solution**: The application already wraps Leaflet map components with dynamic imports and SSR disabled (`next/dynamic` with `{ ssr: false }`).

### Issue: CSP Blocks OpenStreetMap Tiles or Images
- **Cause**: Strict `Content-Security-Policy` header.
- **Solution**: Handled in `next.config.ts`. The directives allow `https://*.tile.openstreetmap.org` and `https://*.supabase.co` in `img-src`.

### Issue: Build Fails on TypeScript or Lint
- **Cause**: Unchecked types or ESLint errors.
- **Solution**: Run `npx tsc --noEmit` and `npm run lint` locally before pushing. Both pass with 0 errors on `main`.
