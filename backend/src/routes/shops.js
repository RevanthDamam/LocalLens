/** CornerStores API: public discovery and owner-scoped shop operations use the existing Supabase PostgreSQL tables. */
import { Router } from "express";
import { z } from "zod";
import { createSupabaseClient, assertSupabase } from "../supabase/client.js";
import { asyncHandler, badRequest } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const optionalText = z.string().trim().max(5000).nullable().optional();
const shopCreateSchema = z.object({ name: z.string().trim().min(1).max(160), category: z.string().trim().min(1).max(120), address: z.string().trim().min(1).max(500), description: optionalText, image: z.string().url().max(2048).nullable().optional(), latitude: z.coerce.number().gte(-90).lte(90).nullable().optional(), longitude: z.coerce.number().gte(-180).lte(180).nullable().optional() });
const shopUpdateSchema = shopCreateSchema.partial().extend({ rating: z.coerce.number().min(0).max(5).nullable().optional(), price_level: z.string().trim().max(8).nullable().optional(), is_open: z.boolean().nullable().optional(), phone: z.string().trim().max(80).nullable().optional() });
const itemSchema = z.object({ name: z.string().trim().min(1).max(180), description: optionalText, price: z.coerce.number().min(0).max(1000000), image: z.string().url().max(2048).nullable().optional(), is_popular: z.boolean().optional() });
const publicQuerySchema = z.object({ category: z.string().trim().max(120).optional(), search: z.string().trim().max(100).optional() });

function clean(values, allowed) { return Object.fromEntries(Object.entries(values).filter(([key, value]) => allowed.includes(key) && value !== undefined)); }
function safeFilter(value) { return value.replace(/[^\p{L}\p{N}\s&'’-]/gu, "").trim(); }
async function ownedShop(client, shopId, userId) {
  const shop = assertSupabase(await client.from("shops").select("*").eq("id", shopId).eq("owner_id", userId).maybeSingle());
  if (!shop) throw badRequest("That shop was not found or you do not have access to it");
  return shop;
}

router.get("/", asyncHandler(async (req, res) => {
  const { category = "", search = "" } = publicQuerySchema.parse(req.query);
  const safeSearch = safeFilter(search);
  let request = createSupabaseClient().from("shops").select("*").order("created_at", { ascending: false });
  if (category) request = request.eq("category", category);
  if (safeSearch) request = request.or(`name.ilike.%${safeSearch}%,category.ilike.%${safeSearch}%,address.ilike.%${safeSearch}%`);
  res.json({ shops: assertSupabase(await request) || [] });
}));

router.get("/:shopId", asyncHandler(async (req, res) => {
  const shop = assertSupabase(await createSupabaseClient().from("shops").select("*").eq("id", req.params.shopId).maybeSingle());
  if (!shop) throw badRequest("Shop not found");
  res.json({ shop });
}));

router.get("/:shopId/items", asyncHandler(async (req, res) => res.json({ items: assertSupabase(await createSupabaseClient().from("shop_items").select("*").eq("shop_id", req.params.shopId).order("created_at", { ascending: false })) || [] })));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const payload = shopCreateSchema.parse(req.body);
  const shop = assertSupabase(await req.supabase.from("shops").insert({ ...payload, owner_id: req.auth.userId, description: payload.description || null, image: payload.image || null, latitude: payload.latitude ?? null, longitude: payload.longitude ?? null, is_open: true, price_level: "$", rating: 0 }).select().single());
  res.status(201).json({ shop });
}));

router.patch("/:shopId", requireAuth, asyncHandler(async (req, res) => {
  await ownedShop(req.supabase, req.params.shopId, req.auth.userId);
  const payload = clean(shopUpdateSchema.parse(req.body), ["name", "category", "address", "description", "image", "latitude", "longitude", "rating", "price_level", "is_open", "phone"]);
  if (!Object.keys(payload).length) throw badRequest("Provide at least one field to update");
  const shop = assertSupabase(await req.supabase.from("shops").update(payload).eq("id", req.params.shopId).eq("owner_id", req.auth.userId).select().single());
  res.json({ shop });
}));

router.delete("/:shopId", requireAuth, asyncHandler(async (req, res) => {
  await ownedShop(req.supabase, req.params.shopId, req.auth.userId);
  assertSupabase(await req.supabase.from("shops").delete().eq("id", req.params.shopId).eq("owner_id", req.auth.userId));
  res.status(204).end();
}));

router.post("/:shopId/items", requireAuth, asyncHandler(async (req, res) => {
  await ownedShop(req.supabase, req.params.shopId, req.auth.userId);
  const payload = itemSchema.parse(req.body);
  const item = assertSupabase(await req.supabase.from("shop_items").insert({ ...payload, shop_id: req.params.shopId, description: payload.description || null, image: payload.image || null, is_popular: payload.is_popular ?? false }).select().single());
  res.status(201).json({ item });
}));

router.patch("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
  const item = assertSupabase(await req.supabase.from("shop_items").select("*, shops!inner(owner_id)").eq("id", req.params.itemId).eq("shops.owner_id", req.auth.userId).maybeSingle());
  if (!item) throw badRequest("That item was not found or you do not have access to it");
  const payload = clean(itemSchema.partial().parse(req.body), ["name", "description", "price", "image", "is_popular"]);
  if (!Object.keys(payload).length) throw badRequest("Provide at least one field to update");
  const updated = assertSupabase(await req.supabase.from("shop_items").update(payload).eq("id", req.params.itemId).select().single());
  res.json({ item: updated });
}));

router.delete("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
  const item = assertSupabase(await req.supabase.from("shop_items").select("*, shops!inner(owner_id)").eq("id", req.params.itemId).eq("shops.owner_id", req.auth.userId).maybeSingle());
  if (!item) throw badRequest("That item was not found or you do not have access to it");
  assertSupabase(await req.supabase.from("shop_items").delete().eq("id", req.params.itemId));
  res.status(204).end();
}));

export default router;
