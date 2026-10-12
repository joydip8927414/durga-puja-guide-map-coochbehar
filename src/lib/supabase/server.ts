import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-only Supabase client factory.
 *
 * SECURITY GUARANTEES:
 * 1. Must NEVER be imported into Client Components ('use client').
 * 2. Privileged operations using SUPABASE_SERVICE_ROLE_KEY bypass RLS and must be guarded by
 *    rigorous server-side authentication and role-checking before invocation.
 * 3. Never expose SUPABASE_SERVICE_ROLE_KEY to any client response or serialized payload.
 */

function ensureServerContext() {
  if (typeof window !== "undefined") {
    throw new Error(
      "[CRITICAL SECURITY VIOLATION] Attempted to instantiate server-side Supabase client in the browser context."
    );
  }
}

export function createServerSupabaseClient() {
  ensureServerContext();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Privileged Admin Supabase Client.
 * Restricted to administrative operations, background tasks, and data synchronization.
 */
export function createAdminSupabaseClient() {
  ensureServerContext();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for administrative client."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
