import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export interface MerchantShop {
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

export interface MerchantItem {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  is_popular: boolean | null;
}

export function useMerchantShop(userId: string | undefined) {
  const [shop, setShop] = useState<MerchantShop | null>(null);
  const [items, setItems] = useState<MerchantItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShop = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured) {
      toast.error("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: userShop, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", userId)
        .maybeSingle();

      if (shopError) throw shopError;

      setShop(userShop);

      if (userShop) {
        const { data: shopItems, error: itemsError } = await supabase
          .from("shop_items")
          .select("*")
          .eq("shop_id", userShop.id);

        if (itemsError) throw itemsError;
        setItems(Array.isArray(shopItems) ? shopItems : []);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      const raw = err?.message ?? "Error loading shop data";
      const isMissingTable = /schema cache|relation.*does not exist|could not find.*table/i.test(raw);
      const message = isMissingTable
        ? "Database not set up. In Supabase Dashboard → SQL Editor, run supabase/setup.sql"
        : raw;
      console.error("fetchShop:", raw, err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const createShop = async (shopData: { name: string; category: string; address: string; description: string; latitude?: number | null; longitude?: number | null; image?: string | null }) => {
    if (!userId) return;
    
    const { data: newShop, error } = await supabase.from('shops').insert({
      owner_id: userId,
      name: shopData.name,
      category: shopData.category,
      address: shopData.address,
      description: shopData.description || null,
      image: shopData.image || null,
      latitude: shopData.latitude || null,
      longitude: shopData.longitude || null,
      is_open: true,
      price_level: "$",
      rating: 0
    }).select().single();

    if (error) {
       toast.error(error.message);
       return;
    }

    setShop(newShop);
    toast.success("Shop created successfully!");
  };

  const updateShop = async (updates: Partial<MerchantShop>) => {
    if (!shop) return;
    
    const { data, error } = await supabase.from('shops').update(updates).eq('id', shop.id).select().single();
    
    if (error) {
       toast.error(error.message);
       return;
    }

    setShop(data);
    toast.success("Shop details saved!");
  };

  const addItem = async (item: { name: string; price: number; description: string; image?: string | null }) => {
    if (!shop) return;
    
    const { data, error } = await supabase.from('shop_items').insert({
      shop_id: shop.id,
      name: item.name,
      price: item.price,
      description: item.description || null,
      image: item.image || null,
      is_popular: false
    }).select().single();

    if (error) {
       toast.error(error.message);
       return;
    }

    setItems([...items, data]);
    toast.success("Item added successfully!");
  };

  const updateItem = async (itemId: string, updates: Partial<MerchantItem>) => {
    const { data, error } = await supabase.from('shop_items').update(updates).eq('id', itemId).select().single();
    
    if (error) {
       toast.error(error.message);
       return;
    }

    setItems(items.map(i => i.id === itemId ? data : i));
    toast.success("Item updated successfully!");
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase.from('shop_items').delete().eq('id', itemId);
    
    if (error) {
       toast.error(error.message);
       return;
    }

    setItems(items.filter(i => i.id !== itemId));
    toast.success("Item deleted!");
  };

  const deleteShop = async () => {
    if (!shop) return;
    
    const { error } = await supabase.from('shops').delete().eq('id', shop.id);
    
    if (error) {
       toast.error(error.message);
       return;
    }

    setShop(null);
    setItems([]);
    toast.success("Shop deleted successfully!");
  };

  return { shop, items, loading, createShop, updateShop, deleteShop, addItem, updateItem, deleteItem, refetch: fetchShop };
}
