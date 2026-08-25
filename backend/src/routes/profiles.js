import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { asyncHandler } from "../lib/http.js";
import { serializeUser } from "../lib/serializers.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.email, COALESCE(p.display_name, u.display_name) AS display_name,
      COALESCE(p.avatar_url, u.avatar_url) AS avatar_url, p.created_at, p.updated_at
     FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = $1`,
    [req.auth.userId],
  );
  res.json({ profile: rows[0] || null, user: rows[0] ? serializeUser(rows[0]) : null });
}));

router.put("/me", requireAuth, asyncHandler(async (req, res) => {
  const payload = z.object({
    display_name: z.string().trim().min(1).max(120),
    avatar_url: z.string().url().max(2048).nullable().optional(),
  }).parse(req.body);
  const { rows } = await query(
    `WITH updated_user AS (
        UPDATE users SET display_name = $2, avatar_url = COALESCE($3, avatar_url)
        WHERE id = $1 RETURNING id, email, display_name, avatar_url
      ), updated_profile AS (
        INSERT INTO profiles (user_id, display_name, avatar_url) VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name,
          avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url)
        RETURNING display_name, avatar_url, updated_at
      ) SELECT * FROM updated_user CROSS JOIN updated_profile`,
    [req.auth.userId, payload.display_name, payload.avatar_url ?? null],
  );
  res.json({ profile: rows[0], user: serializeUser(rows[0]) });
}));

export default router;
