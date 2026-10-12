# Security Policy & Architecture

## Overview
The **Cooch Behar Durga Puja Interactive Guide & Navigation App** is designed with security-first engineering practices. As a mobile-first public navigation and crowd assistance application, it handles public catalog navigation, crowd report submissions, and emergency information.

---

## 1. Core Security Principles

### Least Privilege & Zero Trust
- Client-side code is considered an untrusted environment.
- No privileged secrets or administrative rights are ever conferred upon client bundles.
- All authorization checks are enforced server-side.

### Strict Secret Isolation
- Supabase database service-role keys (`SUPABASE_SERVICE_ROLE_KEY`) and third-party backend secrets are **never** prefixed with `NEXT_PUBLIC_`.
- Any environment variable starting with `NEXT_PUBLIC_` is public by design (such as the Supabase public API endpoint and the anonymous publishable key).
- `.env.local` and all actual secret configuration files are strictly excluded from source control in `.gitignore`.
- `.env.example` contains only non-sensitive placeholder values.

### Server-Side Validation & Input Sanitization
- All client-submitted payloads (e.g. crowd updates, search queries, feedback) are validated on the server.
- String inputs are stripped of HTML tags, control characters, and bounded to safe maximum lengths to prevent stored and reflected Cross-Site Scripting (XSS).
- Geographic coordinates submitted for locations or pandals are verified against the bounding box of Cooch Behar district to prevent anomalous or malicious geo-spoofing.

### Abuse Prevention & Rate Limiting
- Public write operations (e.g., submitting crowd reports) must be rate-limited using server-side token bucket limiters.
- Rate limiting does not trust client-supplied headers (e.g., untrusted client IP headers) or client-side storage (`localStorage`).
- Sensitive operations require verifiable session or cryptographic validation.

---

## 2. HTTP Security Headers & Content Security Policy (CSP)

The application enforces strict HTTP response headers configured via `next.config.ts`:

- **Content-Security-Policy (CSP)**:
  - `default-src 'self'`
  - Script execution limited to self-origin and secure inline Next.js bootstraps.
  - Image sources constrained to self-origin, data URIs, blob URIs, and official OpenStreetMap tile servers (`https://*.tile.openstreetmap.org`).
  - Network connections (`connect-src`) restricted to self-origin and official Supabase backend endpoints (`https://*.supabase.co`).
  - `frame-ancestors 'none'` prevents clickjacking attacks.
  - `object-src 'none'` disallows legacy plugin embeds.
- **X-Content-Type-Options**: `nosniff` prevents MIME-sniffing exploits.
- **X-Frame-Options**: `DENY` prohibits unauthorized embedding in iframes.
- **Referrer-Policy**: `strict-origin-when-cross-origin` restricts leakage of referrers.
- **Permissions-Policy**: Restricts access to sensitive browser hardware (`camera=()`, `microphone=()`), permitting only `geolocation=(self)` for user navigation.
- **Strict-Transport-Security (HSTS)**: Enforces TLS/HTTPS in production environments.

---

## 3. Database Security & Supabase Row Level Security (RLS)

- **Row Level Security (RLS)** will be enabled on all database tables prior to production deployment.
- **Read Access**:
  - Pandal listings, verified amenities, approved routes, and aggregated crowd statistics are publicly readable.
- **Write Access**:
  - No anonymous client can write directly to arbitrary database tables.
  - Crowd reports and user-submitted data go through server-side validation or strictly scoped Supabase RPCs/tables with audit logging.
- **No Service-Role Key in the Browser**:
  - The client-side Supabase client uses only `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 4. Planned Automated Security Checks

1. **TypeScript Strict Type Checking**: `npx tsc --noEmit` validates type safety across all components and server actions.
2. **ESLint Security Rules**: Static analysis for unsafe patterns, unescaped entities, and unsafe code execution.
3. **Dependency Auditing**: Periodic `npm audit` scans to remediate known vulnerabilities in third-party libraries.
4. **Credential Scanning**: Automated checks to ensure no `.env` secret values are committed to Git history.

---

## 5. Vulnerability Reporting

If you discover a potential security vulnerability within this project, please report it responsibly:
- **Do not open a public GitHub issue** describing the vulnerability.
- Please report security concerns through the designated private repository security advisory channels or contact the repository maintainers directly.
- Include detailed reproduction steps, proof of concept if available, and potential impact.
