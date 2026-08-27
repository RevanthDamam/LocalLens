/** CornerStores API: profile operations use the authenticated Supabase user and retain the merchant settings response shape. */
import { Router } from "express";
import { z } from "zod";
import { assertSupabase } from "../supabase/client.js";
import { asyncHandler } from "../lib/http.js";
import { serializeUser } from "../lib/serializers.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const profile = assertSupabase(await req.supabase.from("profiles").select("*").eq("user_id", req.auth.userId).maybeSingle());
  const user = serializeUser({ ...req.auth.user, display_name: profile?.display_name, avatar_url: profile?.avatar_url });
  res.json({ profile: profile || null, user });
}));

router.put("/me", requireAuth, asyncHandler(async (req, res) => {
  const payload = z.object({ display_name: z.string().trim().min(1).max(120), avatar_url: z.string().url().max(2048).nullable().optional() }).parse(req.body);
  const profile = assertSupabase(await req.supabase.from("profiles").upsert({ user_id: req.auth.userId, display_name: payload.display_name, avatar_url: payload.avatar_url ?? null }, { onConflict: "user_id" }).select().single());
  assertSupabase(await req.supabase.auth.updateUser({ data: { display_name: payload.display_name, avatar_url: payload.avatar_url ?? undefined } }));
  res.json({ profile, user: serializeUser({ ...req.auth.user, display_name: profile.display_name, avatar_url: profile.avatar_url }) });
}));

export default router;
