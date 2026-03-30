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

const MOCK_SHOPS: ShopRecord[] = [
  // Cafe
  {
    id: "m-1",
    owner_id: "demo",
    name: "Avenue Cafe",
    category: "Cafe",
    address: "742 Evergreen Terrace, Springfield",
    description: "Brewing the finest artisanal coffee since 1998. Relax in our glass-walled lounge and enjoy the community vibe.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    rating: 4.8,
    price_level: "$$",
    is_open: true,
    phone: "(555) 123-4567",
    latitude: 40.7128,
    longitude: -74.006
  },
  {
    id: "m-4",
    owner_id: "demo",
    name: "Daily Roast",
    category: "Cafe",
    address: "21 Jump St, Manhattan",
    description: "Your morning start line. We source beans directly from farmers to ensure the boldest flavor in every cup.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    rating: 4.6,
    price_level: "$",
    is_open: true,
    phone: "(555) 234-5678",
    latitude: 40.7158,
    longitude: -74.008
  },
  {
    id: "m-5",
    owner_id: "demo",
    name: "Moonlit Mocha",
    category: "Cafe",
    address: "42 Galaxy Way, Brooklyn",
    description: "A late-night sanctuary for thinkers and dreamers. Specializing in dark roasts and decadent desserts.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    rating: 4.7,
    price_level: "$$",
    is_open: true,
    phone: "(555) 345-6789",
    latitude: 40.7028,
    longitude: -73.996
  },
  {
    id: "m-6",
    owner_id: "demo",
    name: "Espresso Express",
    category: "Cafe",
    address: "500 Velocity Ave, Queens",
    description: "Fast, fresh, and firing on all cylinders. The perfect pit stop for your busy commute.",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
    rating: 4.5,
    price_level: "$",
    is_open: true,
    phone: "(555) 456-7890",
    latitude: 40.7428,
    longitude: -73.956
  },
  {
    id: "m-7",
    owner_id: "demo",
    name: "Urban Sip",
    category: "Cafe",
    address: "101 Skyline Dr, Manhattan",
    description: "Elevated coffee with a view. Experience the city's pulse from our rooftop patio.",
    image: "https://images.unsplash.com/photo-1442512595334-71bc397554c6?w=800&q=80",
    rating: 4.9,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 567-8901",
    latitude: 40.7528,
    longitude: -73.986
  },

  // Florist
  {
    id: "m-2",
    owner_id: "demo",
    name: "Bloom & Basil",
    category: "Florist",
    address: "12 Artisan Way, New York",
    description: "A boutique florist and herb shop offering exotic blooms and fresh-cut herbs for your culinary adventures.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    rating: 4.9,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 987-6543",
    latitude: 40.7228,
    longitude: -74.016
  },
  {
    id: "m-8",
    owner_id: "demo",
    name: "Petal Pushers",
    category: "Florist",
    address: "55 Garden Lane, Brooklyn",
    description: "Spreading joy, one bouquet at a time. We specialize in seasonal arrangements and custom gifts.",
    image: "https://images.unsplash.com/photo-1522673607200-164883efcdf1?w=800&q=80",
    rating: 4.7,
    price_level: "$$",
    is_open: true,
    phone: "(555) 678-9012",
    latitude: 40.6828,
    longitude: -73.976
  },
  {
    id: "m-9",
    owner_id: "demo",
    name: "Rose & Thistle",
    category: "Florist",
    address: "89 Briar Court, Staten Island",
    description: "Classic elegance meets wild beauty. Your local source for premium roses and unique thistles.",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80",
    rating: 4.8,
    price_level: "$$$",
    is_open: false,
    phone: "(555) 789-0123",
    latitude: 40.5628,
    longitude: -74.126
  },
  {
    id: "m-10",
    owner_id: "demo",
    name: "Gardenia Grove",
    category: "Florist",
    address: "200 Terrace Blvd, Manhattan",
    description: "An urban jungle in the heart of the city. Find your perfect indoor plant companion here.",
    image: "https://images.unsplash.com/photo-1487070183335-b8285e753479?w=800&q=80",
    rating: 4.6,
    price_level: "$$",
    is_open: true,
    phone: "(555) 890-1234",
    latitude: 40.7628,
    longitude: -73.966
  },
  {
    id: "m-11",
    owner_id: "demo",
    name: "Wildflower Wonders",
    category: "Florist",
    address: "15 Meadow View, Bronx",
    description: "Inspired by nature's untamed beauty. We bring the field to your front door.",
    image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&q=80",
    rating: 4.5,
    price_level: "$",
    is_open: true,
    phone: "(555) 901-2345",
    latitude: 40.8528,
    longitude: -73.886
  },

  // Bakery
  {
    id: "m-3",
    owner_id: "demo",
    name: "Golden Grain Bakery",
    category: "Bakery",
    address: "88 Morning St, Brooklyn",
    description: "Sourdough specialists and pastry perfectionists. Our ovens never stay cool for long.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    rating: 4.7,
    price_level: "$",
    is_open: false,
    phone: "(555) 444-3333",
    latitude: 40.7328,
    longitude: -73.996
  },
  {
    id: "m-12",
    owner_id: "demo",
    name: "Crust & Crumb",
    category: "Bakery",
    address: "33 Yeast Way, Manhattan",
    description: "Artisan breads baked daily. Our signature rye is a local legend.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    rating: 4.9,
    price_level: "$$",
    is_open: true,
    phone: "(555) 012-3456",
    latitude: 40.7258,
    longitude: -74.001
  },
  {
    id: "m-13",
    owner_id: "demo",
    name: "Sweet Kneads",
    category: "Bakery",
    address: "77 Sugar Dr, Queens",
    description: "Everything you need to satisfy your sweet tooth. Cupcakes, cookies, and more.",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80",
    rating: 4.8,
    price_level: "$",
    is_open: true,
    phone: "(555) 123-0987",
    latitude: 40.7458,
    longitude: -73.946
  },
  {
    id: "m-14",
    owner_id: "demo",
    name: "Pastry Palace",
    category: "Bakery",
    address: "100 Flaky St, Bronx",
    description: "The finest French-style pastries in the borough. Experience the art of the croissant.",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80",
    rating: 4.6,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 234-1098",
    latitude: 40.8658,
    longitude: -73.816
  },
  {
    id: "m-15",
    owner_id: "demo",
    name: "Hearth & Home",
    category: "Bakery",
    address: "44 Comfort Rd, Staten Island",
    description: "Traditional recipes that make you feel at home. Our cinnamon rolls are pure bliss.",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bab0e?w=800&q=80",
    rating: 4.7,
    price_level: "$$",
    is_open: true,
    phone: "(555) 345-2109",
    latitude: 40.5758,
    longitude: -74.136
  },

  // Grocery
  {
    id: "m-16",
    owner_id: "demo",
    name: "Fresh Mart",
    category: "Grocery",
    address: "10 Main St, Manhattan",
    description: "Your daily stop for fresh produce and household essentials.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    rating: 4.4,
    price_level: "$$",
    is_open: true,
    phone: "(555) 456-3210",
    latitude: 40.7358,
    longitude: -73.991
  },
  {
    id: "m-17",
    owner_id: "demo",
    name: "Green Grocer",
    category: "Grocery",
    address: "22 Organic Way, Brooklyn",
    description: "Specially curated organic and local products for the conscious consumer.",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
    rating: 4.7,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 567-4321",
    latitude: 40.6958,
    longitude: -73.966
  },
  {
    id: "m-18",
    owner_id: "demo",
    name: "Pantry Plus",
    category: "Grocery",
    address: "88 Bulk Rd, Queens",
    description: "The best deals on bulk items and pantry staples. Save more when you buy more.",
    image: "https://images.unsplash.com/photo-1543083477-4f7f44aad226?w=800&q=80",
    rating: 4.2,
    price_level: "$",
    is_open: true,
    phone: "(555) 678-5432",
    latitude: 40.7558,
    longitude: -73.931
  },
  {
    id: "m-19",
    owner_id: "demo",
    name: "The Corner Store",
    category: "Grocery",
    address: "1 Neighborhood Pl, Bronx",
    description: "A community fixture since 1950. We know your name and your favorite snacks.",
    image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&q=80",
    rating: 4.5,
    price_level: "$",
    is_open: true,
    phone: "(555) 789-6543",
    latitude: 40.8758,
    longitude: -73.801
  },
  {
    id: "m-20",
    owner_id: "demo",
    name: "Harvest Hub",
    category: "Grocery",
    address: "55 Farm-to-Table Dr, Manhattan",
    description: "Bringing the farm direct to the city. Seasonal produce at its absolute peak.",
    image: "https://images.unsplash.com/photo-1466632311177-a35235fe8952?w=800&q=80",
    rating: 4.8,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 890-7654",
    latitude: 40.7758,
    longitude: -73.951
  },

  // Artisan
  {
    id: "m-21",
    owner_id: "demo",
    name: "Craft & Co",
    category: "Artisan",
    address: "12 Maker Lane, Brooklyn",
    description: "Handcrafted furniture and home decor from local woodworkers and artists.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    rating: 4.9,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 901-8765",
    latitude: 40.7058,
    longitude: -73.981
  },
  {
    id: "m-22",
    owner_id: "demo",
    name: "Handspun Heritage",
    category: "Artisan",
    address: "44 Loom St, Manhattan",
    description: "Authentic hand-woven textiles and traditional crafts from around the world.",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    rating: 4.7,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 012-9876",
    latitude: 40.7188,
    longitude: -74.011
  },
  {
    id: "m-23",
    owner_id: "demo",
    name: "Makers' Market",
    category: "Artisan",
    address: "100 Creative Way, Queens",
    description: "A collaborative space for local creators to showcase their unique jewelry and accessories.",
    image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ad?w=800&q=80",
    rating: 4.6,
    price_level: "$$",
    is_open: true,
    phone: "(555) 123-0987",
    latitude: 40.7388,
    longitude: -73.931
  },
  {
    id: "m-24",
    owner_id: "demo",
    name: "Artisan Alley",
    category: "Artisan",
    address: "77 Potters Rd, Bronx",
    description: "Live demonstrations and unique ceramics crafted right here in the studio.",
    image: "https://images.unsplash.com/photo-1493106641515-d9761f0c5fab?w=800&q=80",
    rating: 4.8,
    price_level: "$$",
    is_open: false,
    phone: "(555) 234-1098",
    latitude: 40.8588,
    longitude: -73.811
  },
  {
    id: "m-25",
    owner_id: "demo",
    name: "Curated Creations",
    category: "Artisan",
    address: "22 Designer Dr, Staten Island",
    description: "One-of-a-kind art pieces and custom designs for the discerning collector.",
    image: "https://images.unsplash.com/photo-1533158326339-1f3cb3240fef?w=800&q=80",
    rating: 4.9,
    price_level: "$$$$",
    is_open: true,
    phone: "(555) 345-2109",
    latitude: 40.5888,
    longitude: -74.121
  },

  // Restaurant
  {
    id: "m-26",
    owner_id: "demo",
    name: "Bistro 42",
    category: "Restaurant",
    address: "42 Culinary Rd, Manhattan",
    description: "Modern fusion cuisine in an intimate, upscale setting.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    rating: 4.8,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 456-3210",
    latitude: 40.7488,
    longitude: -73.981
  },
  {
    id: "m-27",
    owner_id: "demo",
    name: "Spice Route",
    category: "Restaurant",
    address: "100 Flavor St, Queens",
    description: "The best authentic Indian and Southeast Asian dishes in the city.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    rating: 4.6,
    price_level: "$$",
    is_open: true,
    phone: "(555) 567-4321",
    latitude: 40.7588,
    longitude: -73.911
  },
  {
    id: "m-28",
    owner_id: "demo",
    name: "The Silver Spoon",
    category: "Restaurant",
    address: "22 Elegant Ave, Brooklyn",
    description: "Classic fine dining reimagined with seasonal, local ingredients.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    rating: 4.9,
    price_level: "$$$$",
    is_open: true,
    phone: "(555) 678-5432",
    latitude: 40.6888,
    longitude: -73.971
  },
  {
    id: "m-29",
    owner_id: "demo",
    name: "Ocean Grill",
    category: "Restaurant",
    address: "55 Seaport Dr, Manhattan",
    description: "Fresh-caught seafood and stunning waterfront views.",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    rating: 4.7,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 789-6543",
    latitude: 40.7088,
    longitude: -74.001
  },
  {
    id: "m-30",
    owner_id: "demo",
    name: "Mountain Meze",
    category: "Restaurant",
    address: "88 Peak St, Bronx",
    description: "Hearty Mediterranean shared plates in a cozy, rustic atmosphere.",
    image: "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?w=800&q=80",
    rating: 4.5,
    price_level: "$$",
    is_open: true,
    phone: "(555) 890-7654",
    latitude: 40.8488,
    longitude: -73.861
  },

  // Electronics
  {
    id: "m-31",
    owner_id: "demo",
    name: "Tech Haven",
    category: "Electronics",
    address: "101 Silicon Alley, Manhattan",
    description: "The latest gadgets and high-end electronics for tech enthusiasts.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    rating: 4.6,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 901-8765",
    latitude: 40.7588,
    longitude: -73.986
  },
  {
    id: "m-32",
    owner_id: "demo",
    name: "Digital Den",
    category: "Electronics",
    address: "44 Circuit Rd, Brooklyn",
    description: "Specializing in custom builds, repairs, and hard-to-find components.",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
    rating: 4.8,
    price_level: "$$",
    is_open: true,
    phone: "(555) 012-9876",
    latitude: 40.7088,
    longitude: -73.946
  },
  {
    id: "m-33",
    owner_id: "demo",
    name: "Gadget Galaxy",
    category: "Electronics",
    address: "77 Innovation Way, Queens",
    description: "Your go-to spot for smart home tech and the newest smartphones.",
    image: "https://images.unsplash.com/photo-1526733169359-811738be7731?w=800&q=80",
    rating: 4.4,
    price_level: "$$",
    is_open: true,
    phone: "(555) 123-0987",
    latitude: 40.7488,
    longitude: -73.926
  },
  {
    id: "m-34",
    owner_id: "demo",
    name: "The Power Plug",
    category: "Electronics",
    address: "200 Ampere Ave, Bronx",
    description: "Expert advice and premium audio-visual equipment for your home theater.",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
    rating: 4.7,
    price_level: "$$$",
    is_open: true,
    phone: "(555) 234-1098",
    latitude: 40.8788,
    longitude: -73.856
  },
  {
    id: "m-35",
    owner_id: "demo",
    name: "Circuit City",
    category: "Electronics",
    address: "15 Voltage Dr, Staten Island",
    description: "Affordable tech and accessories for students and families.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    rating: 4.3,
    price_level: "$",
    is_open: true,
    phone: "(555) 345-2109",
    latitude: 40.5988,
    longitude: -74.106
  }
];

export function useShops() {
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setShops(MOCK_SHOPS);
        return;
      }

      const { data, error: e } = await supabase
        .from("shops")
        .select("*");

      if (e) throw e;
      
      const results = Array.isArray(data) ? (data as ShopRecord[]) : [];
      setShops([...results, ...MOCK_SHOPS]);
    } catch (err: any) {
      const raw = err?.message ?? "Failed to load shops";
      setError(raw);
      setShops(MOCK_SHOPS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return { shops, loading, error, refetch: fetchShops };
}

const MOCK_SHOP_ITEMS: ShopItemRecord[] = [
  // Generic items for Cafe
  { id: "i-1", shop_id: "m-1", name: "Artisan Latte", description: "Smooth espresso with steamed milk and latte art.", price: 4.50, image: "https://images.unsplash.com/photo-1541167760496-162955ed2a9f?w=200&q=80", is_popular: true },
  { id: "i-2", shop_id: "m-1", name: "Avocado Toast", description: "Sourdough bread toasted with mashed avocado and sea salt.", price: 12.00, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&q=80", is_popular: true },
  { id: "i-3", shop_id: "m-4", name: "Cold Brew", description: "24-hour slow-steeped coffee for ultimate smoothness.", price: 5.00, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=80", is_popular: false },
  // Generic items for Bakery
  { id: "i-4", shop_id: "m-3", name: "Sourdough Loaf", description: "Our signature 48-hour fermented sourdough.", price: 8.50, image: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?w=200&q=80", is_popular: true },
  { id: "i-5", shop_id: "m-3", name: "Almond Croissant", description: "Flaky buttery croissant filled with almond cream.", price: 4.75, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80", is_popular: true },
  // Generic items for Florist
  { id: "i-6", shop_id: "m-2", name: "Summer Bouquet", description: "A vibrant mix of seasonal flowers.", price: 45.00, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80", is_popular: true }
];

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

    if (!isSupabaseConfigured || shopId.startsWith("m-")) {
      // Return mock items if it's a mock shop or supabase not configured
      const mockItems = MOCK_SHOP_ITEMS.filter(i => i.shop_id === shopId);
      
      // If we don't have specific items for this mock shop, provide some generic ones based on category
      if (mockItems.length === 0) {
        const shop = MOCK_SHOPS.find(s => s.id === shopId);
        if (shop) {
          // Add some generic category-based items
          const genericItems: ShopItemRecord[] = [
            { id: `${shopId}-i1`, shop_id: shopId, name: `${shop.category} Choice A`, description: "A premium selection from our catalog.", price: 15.00, image: null, is_popular: true },
            { id: `${shopId}-i2`, shop_id: shopId, name: `${shop.category} Choice B`, description: "A local favorite, highly recommended.", price: 25.00, image: null, is_popular: false },
            { id: `${shopId}-i3`, shop_id: shopId, name: `${shop.category} Choice C`, description: "Ethically sourced and crafted with care.", price: 35.00, image: null, is_popular: true },
          ];
          setItems(genericItems);
        } else {
          setItems([]);
        }
      } else {
        setItems(mockItems);
      }
      setLoading(false);
      return;
    }

    supabase
      .from("shop_items")
      .select("*")
      .eq("shop_id", shopId)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setItems((data as ShopItemRecord[]) ?? []);
        } else {
          // Fallback to mock items if database returns nothing
          setItems(MOCK_SHOP_ITEMS.filter(i => i.shop_id === shopId));
        }
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
