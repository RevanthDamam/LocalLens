export type Category = "Bakery" | "Grocery" | "Cafe" | "Florist" | "Artisan" | "Restaurant" | "Electronics";

export interface Shop {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  image: string;
  description: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  waitTime: string;
  phone: string;
  website: string;
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  isOpen: boolean;
  merchantId: string;
}

export interface ShopItem {
  id: string;
  shopId: string;
  name: string;
  image: string;
  price: number;
  description: string;
  available: boolean;
}

export interface Review {
  id: string;
  shopId: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
}

// Default center: New York City
export const DEFAULT_CENTER: [number, number] = [40.7128, -74.006];

export const CATEGORIES: Category[] = ["Bakery", "Grocery", "Cafe", "Florist", "Artisan", "Restaurant", "Electronics"];

export const CATEGORY_ICONS: Record<Category, string> = {
  Bakery: "🥐",
  Grocery: "🛒",
  Cafe: "☕",
  Florist: "🌸",
  Artisan: "✨",
  Restaurant: "🍽️",
  Electronics: "📱",
};

export const getShops = (): Shop[] => {
  try {
    const data = localStorage.getItem("localLens_shop");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((s: any) => ({
      id: s.id,
      name: s.name,
      category: s.category || "Cafe",
      lat: s.latitude || 40.7128,
      lng: s.longitude || -74.006,
      image: s.image || "",
      description: s.description || "",
      address: s.address || "",
      rating: s.rating || 5,
      reviewCount: 1,
      priceLevel: s.price_level || "$",
      waitTime: "No wait",
      phone: s.phone || "",
      website: "",
      hours: { weekday: "9:00 AM - 8:00 PM", saturday: "10:00 AM - 9:00 PM", sunday: "10:00 AM - 6:00 PM" },
      isOpen: s.is_open ?? true,
      merchantId: s.owner_id
    }));
  } catch (e) {
    return [];
  }
};

export const getShopItems = (): ShopItem[] => {
  try {
    const data = localStorage.getItem("localLens_items");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((i: any) => ({
      id: i.id,
      shopId: i.shop_id,
      name: i.name,
      image: i.image || "",
      price: i.price || 0,
      description: i.description || "",
      available: true
    }));
  } catch (e) {
    return [];
  }
};

export const getReviews = (): Review[] => {
  return [];
};

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
