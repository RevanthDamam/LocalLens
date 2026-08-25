export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (error?.name === "ZodError") {
    return res.status(400).json({ error: "Request validation failed", issues: error.issues });
  }
  if (error?.code === "23505") {
    return res.status(409).json({ error: "A record with that value already exists" });
  }
  const status = error.status || 500;
  const message = error.expose ? error.message : "An unexpected server error occurred";
  if (status >= 500) console.error(error);
  res.status(status).json({ error: message });
}

export function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  error.expose = true;
  return error;
}
