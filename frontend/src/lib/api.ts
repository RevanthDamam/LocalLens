/** Cartographic Editorial: transport layer for the repository-native Node/PostgreSQL API. */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "locallens.auth.token";

export interface ApiUser {
  id: string;
  email: string;
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface ApiProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiShop {
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

export interface ApiShopItem {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  is_popular: boolean | null;
}

export interface LocationSearchResult {
  display_name: string;
  latitude: number;
  longitude: number;
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("locallens-auth-change"));
}

export function clearAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("locallens-auth-change"));
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event("locallens-auth-change"));
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") || "";
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error || "The request could not be completed", response.status);
  if (!contentType.includes("application/json")) throw new ApiError("The CornerStores API is unavailable", 503);
  return payload as T;
}

export const authApi = {
  async register(payload: { email: string; password: string; display_name: string }) {
    const response = await apiRequest<{ token: string; user: ApiUser }>("/auth/register", { method: "POST", body: payload });
    setAuthToken(response.token);
    return response.user;
  },
  async login(payload: { email: string; password: string }) {
    const response = await apiRequest<{ token: string; user: ApiUser }>("/auth/login", { method: "POST", body: payload });
    setAuthToken(response.token);
    return response.user;
  },
  async me() {
    const response = await apiRequest<{ user: ApiUser }>("/auth/me");
    return response.user;
  },
  signOut() {
    clearAuthToken();
  },
};

export const profileApi = {
  async get() {
    const response = await apiRequest<{ profile: ApiProfile | null; user: ApiUser | null }>("/profiles/me");
    return response;
  },
  async update(payload: { display_name: string; avatar_url?: string | null }) {
    const response = await apiRequest<{ profile: ApiProfile; user: ApiUser }>("/profiles/me", { method: "PUT", body: payload });
    notifyAuthChanged();
    return response;
  },
};

export const locationsApi = {
  async search(query: string) {
    const params = new URLSearchParams({ q: query });
    const response = await apiRequest<{ results: LocationSearchResult[] }>(`/locations/search?${params}`);
    return Array.isArray(response.results) ? response.results : [];
  },
};

export const shopsApi = {
  async list(filters?: { category?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.search) params.set("search", filters.search);
    const query = params.size ? `?${params}` : "";
    const response = await apiRequest<{ shops: ApiShop[] }>(`/shops${query}`);
    return Array.isArray(response.shops) ? response.shops : [];
  },
  async get(shopId: string) {
    const response = await apiRequest<{ shop: ApiShop }>(`/shops/${shopId}`);
    return response.shop;
  },
  async items(shopId: string) {
    const response = await apiRequest<{ items: ApiShopItem[] }>(`/shops/${shopId}/items`);
    return Array.isArray(response.items) ? response.items : [];
  },
  async create(payload: Pick<ApiShop, "name" | "category" | "address" | "description" | "image" | "latitude" | "longitude">) {
    const response = await apiRequest<{ shop: ApiShop }>("/shops", { method: "POST", body: payload });
    return response.shop;
  },
  async update(shopId: string, payload: Partial<ApiShop>) {
    const response = await apiRequest<{ shop: ApiShop }>(`/shops/${shopId}`, { method: "PATCH", body: payload });
    return response.shop;
  },
  async remove(shopId: string) {
    return apiRequest<void>(`/shops/${shopId}`, { method: "DELETE" });
  },
  async addItem(shopId: string, payload: Pick<ApiShopItem, "name" | "description" | "price" | "image">) {
    const response = await apiRequest<{ item: ApiShopItem }>(`/shops/${shopId}/items`, { method: "POST", body: payload });
    return response.item;
  },
  async updateItem(itemId: string, payload: Partial<ApiShopItem>) {
    const response = await apiRequest<{ item: ApiShopItem }>(`/shops/items/${itemId}`, { method: "PATCH", body: payload });
    return response.item;
  },
  async removeItem(itemId: string) {
    return apiRequest<void>(`/shops/items/${itemId}`, { method: "DELETE" });
  },
};
