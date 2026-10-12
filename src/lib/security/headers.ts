/**
 * Security Headers & Content Security Policy definitions
 * Centralized reference for Next.js headers and middleware enforcement
 */

export interface SecurityHeaderRule {
  key: string;
  value: string;
}

export const BASE_SECURITY_HEADERS: SecurityHeaderRule[] = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];
