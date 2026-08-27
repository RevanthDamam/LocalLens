/** Cartographic Editorial: one compact source of truth for category labels, markers, and clearly marked examples. */
import type { LucideIcon } from "lucide-react";
import { Armchair, BookOpen, Coffee, Croissant, Flower2, Hammer, HeartPulse, PawPrint, Pill, Shirt, ShoppingBasket, Smartphone, Store, UtensilsCrossed } from "lucide-react";
import type { ApiShop } from "@/lib/api";

export const DEFAULT_CENTER: [number, number] = [40.7128, -74.006];

export const CATEGORY_CATALOG = [
  { name: "Bakery", Icon: Croissant, color: "#c8633f", tint: "#fff1e9" },
  { name: "Grocery", Icon: ShoppingBasket, color: "#3f785d", tint: "#eaf7ef" },
  { name: "Cafe", Icon: Coffee, color: "#815838", tint: "#f8efe7" },
  { name: "Florist", Icon: Flower2, color: "#b45477", tint: "#fff0f5" },
  { name: "Artisan", Icon: Hammer, color: "#6a6297", tint: "#f1efff" },
  { name: "Restaurant", Icon: UtensilsCrossed, color: "#a54a36", tint: "#fff0ec" },
  { name: "Electronics", Icon: Smartphone, color: "#3574a8", tint: "#eaf4ff" },
  { name: "Pharmacy", Icon: Pill, color: "#2d7e81", tint: "#e9f8f8" },
  { name: "Fashion", Icon: Shirt, color: "#9a5475", tint: "#fff0f7" },
  { name: "Books & Stationery", Icon: BookOpen, color: "#597b43", tint: "#f0f8e9" },
  { name: "Home & Living", Icon: Armchair, color: "#9a7142", tint: "#fff6e9" },
  { name: "Health & Beauty", Icon: HeartPulse, color: "#b84962", tint: "#fff0f2" },
  { name: "Pet Supplies", Icon: PawPrint, color: "#71593f", tint: "#f8f2ea" },
] as const;

export type Category = (typeof CATEGORY_CATALOG)[number]["name"];
export type CategoryMeta = { name: Category; Icon: LucideIcon; color: string; tint: string };
export const CATEGORIES = CATEGORY_CATALOG.map((category) => category.name) as Category[];
const fallbackCategory: CategoryMeta = { name: "Other" as Category, Icon: Store, color: "#49646c", tint: "#edf3f3" };

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_CATALOG.find((entry) => entry.name === category) || fallbackCategory;
}

export function isSampleShopId(id: string | null | undefined) {
  return Boolean(id?.startsWith("sample-"));
}

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radiusMiles = 3959;
  const latitudeDelta = (lat2 - lat1) * Math.PI / 180;
  const longitudeDelta = (lng2 - lng1) * Math.PI / 180;
  const calculation = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(longitudeDelta / 2) ** 2;
  return radiusMiles * 2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  address: string;
  rating: number | null;
  priceLevel: string | null;
  phone: string;
  isOpen: boolean | null;
  isSample: boolean;
  merchantId: string;
}

const sampleLocations: Array<[number, number]> = [
  [40.7172, -74.0019], [40.7109, -74.0128], [40.7066, -74.0045], [40.7201, -74.0087], [40.7141, -74.0160], [40.7095, -74.0006], [40.7220, -73.9984], [40.7041, -74.0100], [40.7164, -74.0136], [40.7077, -74.0152], [40.7190, -74.0050], [40.7119, -73.9990], [40.7064, -74.0083],
];

export const SAMPLE_SHOPS: ApiShop[] = CATEGORY_CATALOG.map((category, index) => ({
  id: `sample-${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  owner_id: "sample-data",
  name: `${category.name} sample listing`,
  category: category.name,
  address: "Demonstration map point · Lower Manhattan, NY",
  description: `Sample listing shown to demonstrate the ${category.name} category and map marker.`,
  image: null,
  rating: null,
  price_level: null,
  is_open: null,
  phone: null,
  latitude: sampleLocations[index][0],
  longitude: sampleLocations[index][1],
}));
