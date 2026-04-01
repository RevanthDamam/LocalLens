import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, AlertTriangle, Map as MapIcon, ArrowRight, LayoutGrid, SlidersHorizontal, ChevronLeft } from "lucide-react";
import { ShopCard } from "@/components/ShopCard";
import { ShopCardSkeleton } from "@/components/LoadingSkeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useShops, shopToMap } from "@/hooks/useShops";
import { CATEGORIES, DEFAULT_CENTER, getDistance, type Category } from "@/data/mockData";
import type { Shop } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { HeroAiEcommerce } from "@/components/hero-ai-ecommerce";
import { TimelineAnimation } from "@/components/timeline-animation";
import { ThemeToggle } from "@/components/ThemeToggle";
import MotionDrawer from "@/components/motion-drawer";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const { position, loading: geoLoading, permissionDenied } = useGeolocation();
  const { shops: shopsFromDb, loading: shopsLoading, error: shopsError } = useShops();
  const exploreRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
  }, [selectedCategory, searchQuery, shops, position]);

  const FiltersContent = () => (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-8 group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-orange-500/30">
          <LayoutGrid className="text-white w-5 h-5" />
        </div>
        <span className="font-display font-black text-xl tracking-tight text-foreground uppercase italic">Filters</span>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 mb-4">Search</div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-orange-600 transition-colors" />
            <input
              type="text"
              placeholder="Shop name or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-muted border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-foreground focus:bg-card focus:ring-4 focus:ring-orange-600/5 transition-all outline-hidden"
            />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 mb-4">Categories</div>
          <div className="space-y-2">
            <button
              onClick={() => { setSelectedCategory(null); setMobileFiltersOpen(false); }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${!selectedCategory
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
            >
              All Categories
              {!selectedCategory && <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>}
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setMobileFiltersOpen(false); }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                    ? "bg-orange-50 text-orange-600 shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
              >
                {cat}
                {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>}
              </button>
            ))}
          </div>
        </div>

        {permissionDenied && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6 text-[10px] font-black uppercase tracking-widest text-orange-600 leading-relaxed">
            <AlertTriangle className="h-5 w-5 mb-3" />
            Enable location services for distance sorting.
          </div>
        )}
      </nav>

      <div className="pt-8 mt-auto">
        <Link to="/map" className="flex items-center justify-center gap-3 bg-foreground text-background rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-orange-600 transition-all hover:scale-105 active:scale-95">
          <MapIcon className="h-4 w-4" />
          Full Map Mode
        </Link>
      </div>
    </div>
  );

  return (
    <HeroAiEcommerce showHero={false}>
      <div className="pt-24 md:pt-32 px-4 md:px-0">
        <div className="flex min-h-[85vh] overflow-hidden rounded-3xl md:rounded-[40px] bg-card shadow-2xl border border-border mb-10">
          {/* Sidebar - Filters (Desktop) */}
          <aside className="hidden lg:flex w-80 border-r border-border bg-card p-8 flex-col shrink-0">
            <FiltersContent />
          </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
          {/* Header */}
          <header className="h-20 md:h-24 flex items-center justify-between px-6 md:px-10 bg-card border-b border-border shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="font-display text-xl md:text-3xl font-black text-foreground tracking-tight flex items-baseline gap-3 uppercase italic">
                Explore <span className="text-[10px] md:text-sm font-black text-muted-foreground not-italic tracking-[0.2em]">{filteredShops.length} <span className="hidden sm:inline">Found</span></span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <MotionDrawer
                  direction="right"
                  width={320}
                  isOpen={mobileFiltersOpen}
                  onToggle={setMobileFiltersOpen}
                  showToggleButton={false}
                  backgroundColor="hsl(var(--card))"
                  clsBtnClassName="top-4 right-4"
                >
                  <div className="pt-4">
                    <FiltersContent />
                  </div>
                </MotionDrawer>
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="p-3 bg-muted rounded-xl text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Results Grid */}
          <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {shopsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => <ShopCardSkeleton key={i} />)}
                </div>
              ) : filteredShops.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20 text-center"
                >
                  <div className="w-24 h-24 bg-muted rounded-[32px] flex items-center justify-center mb-8 border-4 border-card shadow-sm">
                    <MapPin className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-4xl font-black text-foreground leading-none uppercase italic">No listings found</h3>
                  <p className="text-lg text-neutral-500 font-medium mt-4 max-w-sm mx-auto">We couldn't find any shops matching your current selection.</p>
                  <button
                    onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                    className="mt-10 bg-orange-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 hover:scale-110 transition-all font-display"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              ) : (
                <TimelineAnimation animationNum={1} timelineRef={hasEntered ? { current: document.body } : exploreRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredShops.map((shop, i) => (
                    <ShopCard
                      key={shop.id}
                      shop={shop}
                      distance={getDistance(position[0], position[1], shop.lat, shop.lng)}
                      index={i}
                    />
                  ))}
                </TimelineAnimation>
              )}
            </AnimatePresence>
          </div>
        </main>
        </div>
      </div>
    </HeroAiEcommerce>
  );
};

export default Explore;
