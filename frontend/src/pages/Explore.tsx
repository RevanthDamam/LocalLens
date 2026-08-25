/** Cartographic Editorial: a field-desk discovery route that combines live shop records, proximity, and decisive filtering. */
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowUpRight, Compass, Map, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { ShopCard } from "@/components/ShopCard";
import { CATEGORIES, DEFAULT_CENTER, getDistance, type Category, type Shop } from "@/data/mockData";
import { shopToMap, useShops } from "@/hooks/useShops";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<Category | null>((searchParams.get("category") as Category | null) || null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { position, permissionDenied } = useGeolocation();
  const { shops: records, loading, error } = useShops();
  const shops = useMemo<Shop[]>(() => records.map((shop) => shopToMap(shop, position[0] || DEFAULT_CENTER[0], position[1] || DEFAULT_CENTER[1])), [records, position]);
  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return shops.filter((shop) => {
      const matchesCategory = !category || shop.category === category;
      const matchesSearch = !normalized || [shop.name, shop.category, shop.address, shop.description].filter(Boolean).join(" ").toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => getDistance(position[0], position[1], a.lat, a.lng) - getDistance(position[0], position[1], b.lat, b.lng));
  }, [category, position, search, shops]);

  const reset = () => { setCategory(null); setSearch(""); };
  const filters = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Field filters</p>
        <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-white">Set your bearing.</h2>
      </div>
      <div className="mt-6">
        <label className="atlas-label text-white/50">Search the register</label>
        <div className="mt-2 flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-[#72d2c7]">
          <Search className="h-4 w-4 text-[#72d2c7]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, category, address…" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between"><p className="atlas-label text-white/50">Category</p>{category && <button onClick={() => setCategory(null)} className="text-[11px] font-bold text-[#72d2c7]">Clear</button>}</div>
        <div className="mt-3 grid gap-1">
          <button onClick={() => setCategory(null)} className={`flex items-center justify-between px-3 py-2.5 text-left text-xs font-bold transition ${!category ? "bg-[#72d2c7] text-[#102a31]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><span>All places</span><span className="font-mono text-[10px]">{shops.length}</span></button>
          {CATEGORIES.map((item) => <button key={item} onClick={() => setCategory(category === item ? null : item)} className={`flex items-center justify-between px-3 py-2.5 text-left text-xs font-bold transition ${category === item ? "bg-[#72d2c7] text-[#102a31]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><span>{item}</span><span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" /></button>)}
        </div>
      </div>
      <div className="mt-auto border-t border-white/10 pt-5">
        {permissionDenied ? <p className="flex gap-2 text-xs leading-5 text-[#ffd19a]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Location permission is unavailable, so distances use the default city center.</p> : <p className="flex gap-2 text-xs leading-5 text-white/55"><Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#72d2c7]" />Results are sorted by proximity when your location is available.</p>}
        <Link to="/map" className="mt-5 flex items-center justify-between border border-white/15 px-3 py-3 text-xs font-bold text-white transition hover:bg-white hover:text-[#102a31]"><span className="flex items-center gap-2"><Map className="h-4 w-4" />Open full map</span><ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );

  return (
    <main className="contour-surface min-h-[calc(100vh-70px)]">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <div className="min-h-[calc(100vh-140px)] overflow-hidden border border-border bg-card shadow-elevated lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="ink-rail hidden p-6 lg:block">{filters}</aside>
          <section className="min-w-0">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-5 sm:px-7">
              <div><p className="atlas-label text-primary">Discovery register</p><h1 className="mt-1 font-display text-3xl tracking-[-0.045em]">Explore nearby places</h1></div>
              <div className="flex items-center gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{filtered.length} {filtered.length === 1 ? "result" : "results"}</span><button onClick={() => setShowFilters(true)} className="grid h-10 w-10 place-items-center border border-border text-foreground lg:hidden" aria-label="Open filters"><SlidersHorizontal className="h-4 w-4" /></button></div>
            </header>
            <div className="p-5 sm:p-7">
              {error && <div className="mb-5 flex gap-2 border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
              {loading ? <div className="grid min-h-80 place-items-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div> : filtered.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((shop, index) => <ShopCard key={shop.id} shop={shop} index={index} distance={getDistance(position[0], position[1], shop.lat, shop.lng)} />)}</div> : <div className="grid min-h-80 place-items-center border border-dashed border-border bg-muted/25 text-center"><div><MapPin className="mx-auto h-7 w-7 text-primary" /><h2 className="mt-4 font-display text-3xl">No places match this bearing.</h2><p className="mt-2 text-sm text-muted-foreground">Try a broader search or return to the full register.</p><button onClick={reset} className="mt-5 border border-foreground px-4 py-2 text-xs font-extrabold text-foreground hover:bg-foreground hover:text-background">Reset filters</button></div></div>}
            </div>
          </section>
        </div>
      </div>

      {showFilters && <div className="fixed inset-0 z-[80] bg-[#102a31]/45 lg:hidden"><button className="absolute inset-0" onClick={() => setShowFilters(false)} aria-label="Close filters" /><aside className="absolute inset-y-0 left-0 w-[min(88vw,340px)] ink-rail p-6 shadow-2xl"><button onClick={() => setShowFilters(false)} className="absolute right-5 top-5 text-white/60"><X className="h-5 w-5" /></button>{filters}</aside></div>}
    </main>
  );
}
