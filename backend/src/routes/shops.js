import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { asyncHandler, badRequest } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const optionalText = z.string().trim().max(5000).nullable().optional();
const shopCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(500),
  description: optionalText,
  image: z.string().url().max(2048).nullable().optional(),
  latitude: z.coerce.number().gte(-90).lte(90).nullable().optional(),
  longitude: z.coerce.number().gte(-180).lte(180).nullable().optional(),
});
const shopUpdateSchema = shopCreateSchema.partial().extend({
  rating: z.coerce.number().min(0).max(5).nullable().optional(),
  price_level: z.string().trim().max(8).nullable().optional(),
  is_open: z.boolean().nullable().optional(),
  phone: z.string().trim().max(80).nullable().optional(),
});
const itemSchema = z.object({
  name: z.string().trim().min(1).max(180),
  description: optionalText,
  price: z.coerce.number().min(0).max(1000000),
  image: z.string().url().max(2048).nullable().optional(),
  is_popular: z.boolean().optional(),
});

function updateStatement(table, idColumn, idValue, values, allowed) {
  const entries = Object.entries(values).filter(([key, value]) => allowed.includes(key) && value !== undefined);
  if (!entries.length) throw badRequest("Provide at least one field to update");
  const assignments = entries.map(([key], index) => `${key} = $${index + 2}`);
  return {
    text: `UPDATE ${table} SET ${assignments.join(", ")} WHERE ${idColumn} = $1 RETURNING *`,
    values: [idValue, ...entries.map(([, value]) => value)],
  };
}

async function ownedShop(shopId, userId) {
  const { rows } = await query("SELECT * FROM shops WHERE id = $1 AND owner_id = $2", [shopId, userId]);
  if (!rows[0]) {
    const error = new Error("That shop was not found or you do not have access to it");
    error.status = 404;
    error.expose = true;
    throw error;
  }
  return rows[0];
}

router.get("/", asyncHandler(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const filters = [];
  const values = [];
  if (category) {
    values.push(category);
    filters.push(`category = $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    filters.push(`(name ILIKE $${values.length} OR category ILIKE $${values.length} OR address ILIKE $${values.length})`);
  }
  const { rows } = await query(
    `SELECT * FROM shops ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""} ORDER BY created_at DESC`,
    values,
  );
  res.json({ shops: rows });
}));

router.get("/:shopId", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM shops WHERE id = $1", [req.params.shopId]);
  if (!rows[0]) {
    const error = new Error("Shop not found");
    error.status = 404;
    error.expose = true;
    throw error;
  }
  res.json({ shop: rows[0] });
}));

router.get("/:shopId/items", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM shop_items WHERE shop_id = $1 ORDER BY created_at DESC", [req.params.shopId]);
  res.json({ items: rows });
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const payload = shopCreateSchema.parse(req.body);
  const { rows } = await query(
    `INSERT INTO shops (owner_id, name, category, address, description, image, latitude, longitude, is_open, price_level, rating)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, '$', 0) RETURNING *`,
    [req.auth.userId, payload.name, payload.category, payload.address, payload.description || null, payload.image || null, payload.latitude ?? null, payload.longitude ?? null],
  );
  res.status(201).json({ shop: rows[0] });
}));

router.patch("/:shopId", requireAuth, asyncHandler(async (req, res) => {
  await ownedShop(req.params.shopId, req.auth.userId);
  const payload = shopUpdateSchema.parse(req.body);
  const statement = updateStatement("shops", "id", req.params.shopId, payload, ["name", "category", "address", "description", "image", "latitude", "longitude", "rating", "price_level", "is_open", "phone"]);
  const { rows } = await query(statement.text, statement.values);
  res.json({ shop: rows[0] });
}));

router.delete("/:shopId", requireAuth, asyncHandler(async (req, res) => {
  await ownedShop(req.params.shopId, req.auth.userId);
  await query("DELETE FROM shops WHERE id = $1", [req.params.shopId]);
  res.status(204).end();
}));

router.post("/:shopId/items", requireAuth, asyncHandler(async (req, res) => {
  await ownedShop(req.params.shopId, req.auth.userId);
  const payload = itemSchema.parse(req.body);
  const { rows } = await query(
    `INSERT INTO shop_items (shop_id, name, description, price, image, is_popular)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.params.shopId, payload.name, payload.description || null, payload.price, payload.image || null, payload.is_popular ?? false],
  );
  res.status(201).json({ item: rows[0] });
}));

router.patch("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
  const { rows: ownedItems } = await query(
    `SELECT i.* FROM shop_items i INNER JOIN shops s ON s.id = i.shop_id
     WHERE i.id = $1 AND s.owner_id = $2`,
    [req.params.itemId, req.auth.userId],
  );
  if (!ownedItems[0]) {
    const error = new Error("That item was not found or you do not have access to it");
    error.status = 404;
    error.expose = true;
    throw error;
  }
  const payload = itemSchema.partial().parse(req.body);
  const statement = updateStatement("shop_items", "id", req.params.itemId, payload, ["name", "description", "price", "image", "is_popular"]);
  const { rows } = await query(statement.text, statement.values);
  res.json({ item: rows[0] });
}));

router.delete("/items/:itemId", requireAuth, asyncHandler(async (req, res) => {
  const { rowCount } = await query(
    `DELETE FROM shop_items WHERE id = $1 AND shop_id IN (SELECT id FROM shops WHERE owner_id = $2)`,
    [req.params.itemId, req.auth.userId],
  );
  if (!rowCount) {
    const error = new Error("That item was not found or you do not have access to it");
    error.status = 404;
    error.expose = true;
    throw error;
  }
  res.status(204).end();
}));

export default router;
