/** LocalLens API: request-scoped Supabase clients keep JWTs on the server and apply existing PostgreSQL RLS policies. */
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

export function createSupabaseClient(accessToken) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

export function assertSupabase(result) {
  if (!result.error) return result.data;
  const error = new Error(result.error.message || "The database request could not be completed");
  error.status = result.error.code === "PGRST116" ? 404 : 400;
  error.expose = true;
  throw error;
}
