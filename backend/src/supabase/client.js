/** CornerStores API: request-scoped Supabase clients keep JWTs on the server and apply existing PostgreSQL RLS policies. */
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
  const statusByCode = { PGRST116: 404, PGRST301: 401, "23505": 409, "42501": 403 };
  const status = statusByCode[result.error.code] || 400;
  const message = status === 404 ? "The requested record was not found" : status === 401 ? "Your session is invalid or has expired" : status === 403 ? "You do not have access to that record" : status === 409 ? "A record with that value already exists" : "The database request could not be completed";
  const error = new Error(message);
  error.status = status;
  error.expose = true;
  throw error;
}
