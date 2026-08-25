/** LocalLens API: Node.js service layer using Supabase Auth and the connected PostgreSQL-backed data API. */
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import shopRoutes from "./routes/shops.js";
import { errorHandler, notFound } from "./lib/http.js";

const app = express();
const origins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({ origin: origins, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "2mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", database: "supabase-postgres" }));
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/shops", shopRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
