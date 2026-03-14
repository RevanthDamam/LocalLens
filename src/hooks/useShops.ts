import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Category } from "@/data/mockData";

export interface ShopRecord {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  address: string;
  description: string | null;
  image: string | null;
  rating: number | null;
  price_level: string | null;
  is_open: boolean | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ShopItemRecord {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  is_popular: boolean | null;
}

export function useShops() {
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env");
      setShops([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error: e } = await supabase
        .from("shops")
        .select("*");

      if (e) throw e;
      setShops(Array.isArray(data) ? (data as ShopRecord[]) : []);
    } catch (err: any) {
      const raw = err?.message ?? "Failed to load shops";
      const isMissingTable = /schema cache|relation.*does not exist|could not find.*table/i.test(raw);
      const message = isMissingTable
        ? "Database not set up. In Supabase Dashboard → SQL Editor, run the script in supabase/setup.sql"
        : raw;
      setError(message);
      setShops([]);
      console.error("useShops:", raw, err);
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
    if (!shopId) {
      setItems([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("shop_items")
      .select("*")
      .eq("shop_id", shopId)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error) setItems((data as ShopItemRecord[]) ?? []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [shopId]);

  return { items, loading };
}

export function shopToMap(shop: ShopRecord, defaultLat: number, defaultLng: number) {
  return {
    id: shop.id,
    name: shop.name,
    category: (shop.category || "Cafe") as Category,
    lat: shop.latitude ?? defaultLat,
    lng: shop.longitude ?? defaultLng,
    image: shop.image || "",
    description: shop.description || "",
    address: shop.address,
    rating: shop.rating ?? 5,
    reviewCount: 1,
    priceLevel: shop.price_level || "$",
    waitTime: "—",
    phone: shop.phone || "",
    website: "",
    hours: { weekday: "9–8", saturday: "10–9", sunday: "10–6" },
    isOpen: shop.is_open ?? true,
    merchantId: shop.owner_id,
  };
}
