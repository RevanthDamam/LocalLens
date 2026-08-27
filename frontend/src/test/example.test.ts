import { describe, expect, it } from "vitest";
import { CATEGORY_CATALOG, SAMPLE_SHOPS } from "@/data/catalog";

describe("category catalog", () => {
  it("provides one uniquely marked sample listing for every category", () => {
    expect(SAMPLE_SHOPS).toHaveLength(CATEGORY_CATALOG.length);
    expect(new Set(CATEGORY_CATALOG.map((category) => category.markerGlyph)).size).toBe(CATEGORY_CATALOG.length);
    expect(SAMPLE_SHOPS.every((shop) => shop.id.startsWith("sample-") && shop.rating === null && shop.is_open === null)).toBe(true);
  });
});
