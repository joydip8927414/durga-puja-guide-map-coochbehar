/**
 * Abuse Prevention & Rate Limiting Architectural Contracts
 *
 * MANDATORY SECURITY PRINCIPLES:
 * 1. Client-supplied IP addresses (e.g. X-Forwarded-For headers) CANNOT be trusted blindly.
 *    Use trusted reverse proxy headers or server-side session tokens.
 * 2. Never rely solely on client-side state (such as localStorage) for rate limiting.
 * 3. Public write operations (e.g. crowd reporting) must be capped by both IP and time window.
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
}

/**
 * In-memory token bucket rate limiter for development and local testing.
 * In production, this should be backed by Redis / Upstash to handle distributed instances.
 */
class InMemoryRateLimiter implements RateLimiter {
  private map = new Map<string, { count: number; expiresAt: number }>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.map.get(identifier);

    if (!entry || entry.expiresAt <= now) {
      this.map.set(identifier, {
        count: 1,
        expiresAt: now + this.windowMs,
      });
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        resetMs: this.windowMs,
      };
    }

    if (entry.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetMs: entry.expiresAt - now,
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - entry.count,
      resetMs: entry.expiresAt - now,
    };
  }
}

// Default limiter for crowd report submissions: maximum 5 reports per minute per client
export const crowdReportRateLimiter = new InMemoryRateLimiter(5, 60 * 1000);
