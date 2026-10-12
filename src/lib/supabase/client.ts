import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Browser-safe Supabase client initialization.
 *
 * SECURITY GUARANTEES:
 * 1. ONLY accesses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
 * 2. NEVER exposes or references `SUPABASE_SERVICE_ROLE_KEY`.
 * 3. All operations executed through this client are subject to Supabase Row Level Security (RLS) policies.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getBrowserSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Security Notice] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Real-time and database features will require these in .env.local."
      );
    }
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
