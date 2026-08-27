/** Cartographic Editorial: public discovery reads from the Node.js/PostgreSQL API. */
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CENTER, isSampleShopId, SAMPLE_SHOPS, type Shop } from "@/data/catalog";
import { shopsApi, type ApiShop, type ApiShopItem } from "@/lib/api";

export type ShopRecord = ApiShop;
export type ShopItemRecord = ApiShopItem;

function withSamples(liveShops: ApiShop[]) {
  const ids = new Set(liveShops.map((shop) => shop.id));
  return [...liveShops, ...SAMPLE_SHOPS.filter((shop) => !ids.has(shop.id))];
}

export function useShops() {
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setShops(withSamples(await shopsApi.list()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shops");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return { shops, loading, error, refetch: fetchShops };
}

export function useShopItems(shopId: string | null) {
  const [items, setItems] = useState<ShopItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId || isSampleShopId(shopId)) {
      setItems([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    shopsApi.items(shopId)
      .then((nextItems) => active && setItems(nextItems))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [shopId]);

  return { items, loading };
}

export function shopToMap(shop: ShopRecord, defaultLat = DEFAULT_CENTER[0], defaultLng = DEFAULT_CENTER[1]): Shop {
  return {
    id: shop.id,
    name: shop.name,
    category: shop.category || "Cafe",
    lat: shop.latitude ?? defaultLat,
    lng: shop.longitude ?? defaultLng,
    image: shop.image || "",
    description: shop.description || "",
    address: shop.address,
    rating: shop.rating ?? 0,
    priceLevel: shop.price_level,
    phone: shop.phone || "",
    website: "",
    hours: { weekday: "See storefront", saturday: "See storefront", sunday: "See storefront" },
    isOpen: shop.is_open,
    isSample: isSampleShopId(shop.id),
    merchantId: shop.owner_id,
  };
}
