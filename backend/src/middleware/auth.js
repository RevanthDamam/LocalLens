import { createSupabaseClient } from "../supabase/client.js";

export async function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) {
    const error = new Error("Authentication is required");
    error.status = 401;
    error.expose = true;
    return next(error);
  }

  const client = createSupabaseClient(token);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) {
    const error = new Error("Your session is invalid or has expired");
    error.status = 401;
    error.expose = true;
    return next(error);
  }
  req.auth = { userId: data.user.id, accessToken: token, user: data.user };
  req.supabase = client;
  return next();
}
