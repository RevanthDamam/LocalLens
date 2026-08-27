/** Cartographic Editorial: merchant-owned shop and item management through the CornerStores API. */
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { shopsApi, type ApiShop, type ApiShopItem } from "@/lib/api";

export type MerchantShop = ApiShop;
export type MerchantItem = ApiShopItem;

export function useMerchantShop(userId: string | undefined) {
  const [shop, setShop] = useState<MerchantShop | null>(null);
  const [items, setItems] = useState<MerchantItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShop = useCallback(async () => {
    if (!userId) {
      setShop(null);
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const ownerShops = await shopsApi.list();
      const nextShop = ownerShops.find((candidate) => candidate.owner_id === userId) || null;
      setShop(nextShop);
      setItems(nextShop ? await shopsApi.items(nextShop.id) : []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load merchant data");
      setShop(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const createShop = async (payload: { name: string; category: string; address: string; description: string; latitude?: number | null; longitude?: number | null; image?: string | null }) => {
    const nextShop = await shopsApi.create(payload);
    setShop(nextShop);
    setItems([]);
    toast.success("Shop created successfully");
  };

  const updateShop = async (updates: Partial<MerchantShop>) => {
    if (!shop) return;
    const nextShop = await shopsApi.update(shop.id, updates);
    setShop(nextShop);
    toast.success("Shop details saved");
  };

  const deleteShop = async () => {
    if (!shop) return;
    await shopsApi.remove(shop.id);
    setShop(null);
    setItems([]);
    toast.success("Shop deleted");
  };

  const addItem = async (item: { name: string; price: number; description: string; image?: string | null }) => {
    if (!shop) return;
    const nextItem = await shopsApi.addItem(shop.id, item);
    setItems((current) => [...current, nextItem]);
    toast.success("Item added successfully");
  };

  const updateItem = async (itemId: string, updates: Partial<MerchantItem>) => {
    const nextItem = await shopsApi.updateItem(itemId, updates);
    setItems((current) => current.map((item) => item.id === itemId ? nextItem : item));
    toast.success("Item updated successfully");
  };

  const deleteItem = async (itemId: string) => {
    await shopsApi.removeItem(itemId);
    setItems((current) => current.filter((item) => item.id !== itemId));
    toast.success("Item deleted");
  };

  return { shop, items, loading, createShop, updateShop, deleteShop, addItem, updateItem, deleteItem, refetch: fetchShop };
}
