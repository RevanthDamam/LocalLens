/** CornerStores API: compact, dependency-free safeguards for the public Node service. */
const buckets = new Map();

export function apiSecurity(req, res, next) {
  res.set({
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
  if (req.path.startsWith("/api/auth") || req.path.startsWith("/api/profiles")) res.set("Cache-Control", "no-store");
  next();
}

export function rateLimit({ limit, windowMs }) {
  return (req, res, next) => {
    const now = Date.now();
    if (buckets.size > 5000) {
      for (const [entryKey, entry] of buckets) if (entry.resetAt <= now) buckets.delete(entryKey);
      if (buckets.size > 5000) buckets.delete(buckets.keys().next().value);
    }
    const key = `${req.ip || "unknown"}:${req.baseUrl}${req.path}`;
    const current = buckets.get(key);
    const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1;
    buckets.set(key, bucket);

    res.set({ "RateLimit-Limit": String(limit), "RateLimit-Remaining": String(Math.max(0, limit - bucket.count)), "RateLimit-Reset": String(Math.ceil(bucket.resetAt / 1000)) });
    if (bucket.count > limit) return res.status(429).set("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000))).json({ error: "Too many requests. Please try again shortly." });
    return next();
  };
}
