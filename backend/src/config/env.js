import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a URL").default("https://skquddkyggertfdstdxm.supabase.co"),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "SUPABASE_PUBLISHABLE_KEY is required").default("sb_publishable_1SmGuilIqHytt8hrwARaDA_e5NkRSXz"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("https://local-lens-nu.vercel.app,http://localhost:8080"),
  GEOCODER_URL: z.string().url("GEOCODER_URL must be a URL").default("https://nominatim.openstreetmap.org"),
});

export const env = environmentSchema.parse(process.env);
