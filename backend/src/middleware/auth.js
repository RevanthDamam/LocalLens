import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) {
    const error = new Error("Authentication is required");
    error.status = 401;
    error.expose = true;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.auth = { userId: payload.sub };
    return next();
  } catch {
    const error = new Error("Your session is invalid or has expired");
    error.status = 401;
    error.expose = true;
    return next(error);
  }
}
