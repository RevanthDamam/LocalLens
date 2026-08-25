import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { query } from "./db/pool.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import shopRoutes from "./routes/shops.js";
import { asyncHandler, errorHandler, notFound } from "./lib/http.js";

const app = express();
const origins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({ origin: origins, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", asyncHandler(async (_req, res) => {
  await query("SELECT 1");
  res.json({ status: "ok" });
}));

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/shops", shopRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`LocalLens API listening on port ${env.PORT}`);
});

