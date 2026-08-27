/** CornerStores API: merchant-initiated address lookup is proxied with per-instance throttling and caching. */
import { Router } from "express";
import { env } from "../config/env.js";
import { asyncHandler, badRequest } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_INTERVAL_MS = 1100;
let lastProviderRequestAt = 0;
let providerQueue = Promise.resolve();

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function requestProvider(url, language) {
  const work = providerQueue.then(async () => {
    const elapsed = Date.now() - lastProviderRequestAt;
    if (elapsed < REQUEST_INTERVAL_MS) await delay(REQUEST_INTERVAL_MS - elapsed);
    lastProviderRequestAt = Date.now();

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": language || "en",
        "User-Agent": "CornerStores merchant location picker/1.0",
      },
    });

    if (!response.ok) {
      const error = new Error("Address search is temporarily unavailable. Please try again shortly.");
      error.status = 502;
      error.expose = true;
      throw error;
    }

    return response.json();
  });

  providerQueue = work.catch(() => undefined);
  return work;
}

router.get("/search", requireAuth, asyncHandler(async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim().replace(/\s+/g, " ") : "";
  if (query.length < 3) throw badRequest("Enter at least three characters to search for an address");
  if (query.length > 160) throw badRequest("Address searches must be 160 characters or fewer");

  const cacheKey = query.toLocaleLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.set("Cache-Control", "private, max-age=300").json({ results: cached.results });
  }

  const searchUrl = new URL("search", `${env.GEOCODER_URL.replace(/\/$/, "")}/`);
  searchUrl.search = new URLSearchParams({ q: query, format: "jsonv2", limit: "5", addressdetails: "0" }).toString();
  const language = typeof req.headers["accept-language"] === "string" ? req.headers["accept-language"] : "en";
  const response = await requestProvider(searchUrl, language);
  const results = Array.isArray(response) ? response
    .map((place) => ({
      display_name: typeof place?.display_name === "string" ? place.display_name : "",
      latitude: Number(place?.lat),
      longitude: Number(place?.lon),
    }))
    .filter((place) => place.display_name && Number.isFinite(place.latitude) && Number.isFinite(place.longitude))
    .slice(0, 5) : [];

  cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, results });
  return res.set("Cache-Control", "private, max-age=300").json({ results });
}));

export default router;
