import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool, query } from "../db/pool.js";
import { createToken, requireAuth } from "../middleware/auth.js";
import { asyncHandler, badRequest } from "../lib/http.js";
import { serializeUser } from "../lib/serializers.js";

const router = Router();
const credentialsSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(6).max(128),
});

router.post("/register", asyncHandler(async (req, res) => {
  const { email, password } = credentialsSchema.extend({
    display_name: z.string().trim().min(1).max(120).optional(),
  }).parse(req.body);
  const displayName = req.body.display_name?.trim() || email.split("@")[0];
  const passwordHash = await bcrypt.hash(password, 12);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: users } = await client.query(
      "INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, avatar_url",
      [email.toLowerCase(), passwordHash, displayName],
    );
    const user = users[0];
    await client.query(
      "INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)",
      [user.id, displayName],
    );
    await client.query("COMMIT");
    res.status(201).json({ token: createToken(user.id), user: serializeUser(user) });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = credentialsSchema.parse(req.body);
  const { rows } = await query(
    "SELECT id, email, display_name, avatar_url, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()],
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw badRequest("Incorrect email or password");
  }
  res.json({ token: createToken(user.id), user: serializeUser(user) });
}));

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    "SELECT id, email, display_name, avatar_url FROM users WHERE id = $1",
    [req.auth.userId],
  );
  if (!rows[0]) {
    const error = new Error("User not found");
    error.status = 404;
    error.expose = true;
    throw error;
  }
  res.json({ user: serializeUser(rows[0]) });
}));

export default router;
