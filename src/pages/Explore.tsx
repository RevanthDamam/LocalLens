import { useState, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, AlertTriangle, Map as MapIcon, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopCard } from "@/components/ShopCard";
import { CategoryChip } from "@/components/CategoryChip";
import { ShopCardSkeleton } from "@/components/LoadingSkeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useShops, shopToMap } from "@/hooks/useShops";
import { CATEGORIES, DEFAULT_CENTER, getDistance, type Category } from "@/data/mockData";
import type { Shop } from "@/data/mockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const { position, loading, permissionDenied } = useGeolocation();
  const { shops: shopsFromDb, loading: shopsLoading, error: shopsError } = useShops();
  const exploreRef = useRef<HTMLDivElement>(null);

  const shops: Shop[] = useMemo(() => shopsFromDb.map((s) =>
    shopToMap(s, position[0] || DEFAULT_CENTER[0], position[1] || DEFAULT_CENTER[1])
  ), [shopsFromDb, position]);

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
    return result.sort((a, b) =>
      getDistance(position[0], position[1], a.lat, a.lng) -
      getDistance(position[0], position[1], b.lat, b.lng)
    );
  }, [selectedCategory, searchQuery, shops]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-orange-200/40 blur-[100px]"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-orange-300/20 blur-[100px]"
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 container py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
                <h1 className="text-6xl font-black font-display text-neutral-900 tracking-tight leading-none mb-4 uppercase italic">Browse Shops</h1>
                <p className="text-xl text-neutral-500 font-medium max-w-lg">Discover curated local experiences around your location.</p>
            </div>
            
            <Link to="/map" className="group flex items-center gap-4 bg-orange-600 text-white rounded-2xl px-8 py-5 font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/30 hover:bg-orange-700 transition-all hover:scale-[1.05] active:scale-95">
                <MapIcon className="h-5 w-5" />
                <span>View Full Map Mode</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
             {/* Left Column - Controls & Filtering */}
             <div className="space-y-10 lg:sticky lg:top-24">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm transition-colors group-focus-within:bg-orange-100">
                      <Search className="h-4 w-4 text-neutral-400 group-focus-within:text-orange-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Keyword search..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl py-5 pl-16 pr-4 text-sm font-bold text-neutral-900 focus:bg-white focus:ring-4 focus:ring-orange-600/5 transition-all shadow-xl shadow-orange-900/5"
                    />
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase px-1">Quick Filters</h3>
                   <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`rounded-xl border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                            !selectedCategory
                              ? "border-orange-200 bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                              : "border-white/40 bg-white/60 text-neutral-500 hover:bg-white hover:border-orange-200"
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
                </div>

                {permissionDenied && (
                  <div className="flex items-center gap-4 rounded-3xl border border-orange-200 bg-white/60 backdrop-blur-sm p-6 text-sm font-bold text-orange-600 shadow-sm animate-pulse">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <span>Enable location services for the most accurate results in your area.</span>
                  </div>
                )}
             </div>

             {/* Right Column - Results Grid */}
             <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <h2 className="font-display text-4xl font-black text-neutral-900 tracking-tight leading-none uppercase italic">
                      {filteredShops.length} Found
                    </h2>
                    <div className="h-px flex-1 bg-neutral-200 opacity-30"></div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {(loading || shopsLoading) ? (
                    <>
                      {[1, 2, 4, 5, 6].map(i => <ShopCardSkeleton key={i} />)}
                    </>
                  ) : filteredShops.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-[48px] border-4 border-dashed border-white/20 bg-white/10 py-32 text-center">
                      <MapPin className="mb-6 h-16 w-16 text-neutral-300" />
                      <h3 className="font-display text-3xl font-black text-neutral-900 leading-none">NO LISTINGS</h3>
                      <p className="text-lg text-neutral-500 font-medium mt-3">Try choosing a different perspective or category.</p>
                      <button onClick={() => { setSelectedCategory(null); setSearchQuery(""); }} className="mt-8 text-orange-600 font-black uppercase tracking-widest text-xs underline underline-offset-8">Reset All Filters</button>
                    </div>
                  ) : (
                    <>
                      {filteredShops.map((shop, i) => (
                        <ShopCard
                          key={shop.id}
                          shop={shop}
                          distance={getDistance(position[0], position[1], shop.lat, shop.lng)}
                          index={i}
                        />
                      ))}
                    </>
                  )}
                </div>
             </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Explore;
