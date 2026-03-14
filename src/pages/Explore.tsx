import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapView } from "@/components/MapView";
import { ShopCard } from "@/components/ShopCard";
import { CategoryChip } from "@/components/CategoryChip";
import { ShopCardSkeleton, MapSkeleton } from "@/components/LoadingSkeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useShops, shopToMap } from "@/hooks/useShops";
import { CATEGORIES, DEFAULT_CENTER, getDistance, type Category } from "@/data/mockData";
import type { Shop } from "@/data/mockData";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const { position, loading, permissionDenied } = useGeolocation();
  const { shops: shopsFromDb, loading: shopsLoading, error: shopsError } = useShops();
  const shops: Shop[] = shopsFromDb.map((s) =>
    shopToMap(s, position[0] || DEFAULT_CENTER[0], position[1] || DEFAULT_CENTER[1])
  );

  const filteredShops = useMemo(() => {
    let result = shops;
    if (selectedCategory) {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    // Sort by distance
    return result.sort((a, b) =>
      getDistance(position[0], position[1], a.lat, a.lng) -
      getDistance(position[0], position[1], b.lat, b.lng)
    );
  }, [selectedCategory, searchQuery, position, shops]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6">
        {/* Search */}
        <div className="mb-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shops by name or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              !selectedCategory
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary"
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat}
              category={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            />
          ))}
        </div>

        {permissionDenied && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning bg-warning/10 p-3 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <span>Location permission denied. Showing default area. Enable location for better results.</span>
          </div>
        )}

        {shopsError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{shopsError}</span>
          </div>
        )}

        {/* Map + List */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Explore the Neighborhood</h2>
            </div>
            {(loading || shopsLoading) ? <MapSkeleton /> : <MapView center={position} shops={filteredShops} className="h-[400px] lg:h-[500px]" />}
          </div>
          <div>
            <h2 className="mb-4 font-display text-xl font-bold">
              {filteredShops.length} Shop{filteredShops.length !== 1 ? "s" : ""} Found
            </h2>
            {(loading || shopsLoading) ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => <ShopCardSkeleton key={i} />)}
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-16 text-center">
                <MapPin className="mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="font-display text-lg font-semibold">No shops found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredShops.map((shop, i) => (
                  <ShopCard
                    key={shop.id}
                    shop={shop}
                    distance={getDistance(position[0], position[1], shop.lat, shop.lng)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
