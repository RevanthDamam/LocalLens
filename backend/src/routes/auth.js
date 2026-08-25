/** LocalLens API: merchant authentication delegates credentials to Supabase Auth while preserving the frontend response contract. */
import { Router } from "express";
import { z } from "zod";
import { createSupabaseClient, assertSupabase } from "../supabase/client.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, badRequest } from "../lib/http.js";
import { serializeUser } from "../lib/serializers.js";

const router = Router();
const credentialsSchema = z.object({ email: z.string().trim().email().max(320), password: z.string().min(6).max(128) });

router.post("/register", asyncHandler(async (req, res) => {
  const { email, password } = credentialsSchema.extend({ display_name: z.string().trim().min(1).max(120).optional() }).parse(req.body);
  const client = createSupabaseClient();
  const displayName = req.body.display_name?.trim() || email.split("@")[0];
  const data = assertSupabase(await client.auth.signUp({ email: email.toLowerCase(), password, options: { data: { display_name: displayName } } }));
  if (!data.user) throw badRequest("Could not create the merchant account");
  res.status(201).json({ token: data.session?.access_token || null, user: serializeUser(data.user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = credentialsSchema.parse(req.body);
  const client = createSupabaseClient();
  const data = assertSupabase(await client.auth.signInWithPassword({ email: email.toLowerCase(), password }));
  if (!data.user || !data.session) throw badRequest("Could not start a merchant session");
  res.json({ token: data.session.access_token, user: serializeUser(data.user) });
}));

router.get("/me", requireAuth, asyncHandler(async (req, res) => res.json({ user: serializeUser(req.auth.user) })));

export default router;
