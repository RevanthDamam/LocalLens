/** Cartographic Editorial: a place-first landing page that turns live shop data into a concise local field guide. */
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, Map, Search, Sparkles, Store, ChevronRight, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { ShopCard } from "@/components/ShopCard";
import { BrandMark } from "@/components/BrandMark";
import { CATEGORIES, DEFAULT_CENTER, getDistance, type Shop } from "@/data/mockData";
import { shopToMap, useShops } from "@/hooks/useShops";

const heroImage = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=88";

export default function Index() {
  const { shops: records, loading } = useShops();
  const shops = useMemo<Shop[]>(() => records.map((shop) => shopToMap(shop, DEFAULT_CENTER[0], DEFAULT_CENTER[1])), [records]);
  const featured = shops.slice(0, 3);

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[610px] overflow-hidden bg-[#102a31] text-white">
        <img src={heroImage} alt="Aerial view of a dense, walkable city neighborhood" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,35,41,0.97)_0%,rgba(12,35,41,0.87)_35%,rgba(12,35,41,0.22)_70%,rgba(12,35,41,0.42)_100%)]" />
        <div className="absolute -right-20 top-10 h-[520px] w-[520px] rounded-full border border-white/15" />
        <div className="absolute -right-8 top-24 h-[380px] w-[380px] rounded-full border border-white/10" />
        <div className="relative mx-auto grid min-h-[610px] max-w-[1440px] items-end gap-10 px-5 pb-12 pt-16 sm:px-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(300px,0.42fr)] lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-8 flex items-center gap-3">
              <BrandMark inverse className="h-11 w-11" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">Local field guide / 2026</span>
            </div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#7ed9ce]">Neighborhood intelligence, made human</p>
            <h1 className="max-w-3xl font-display text-[clamp(3.4rem,7vw,6.5rem)] leading-[0.86] tracking-[-0.055em] text-balance">Find the places your neighborhood keeps returning to.</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">Search live local listings, orient yourself by category and distance, then meet the businesses that give a district its character.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/explore" className="inline-flex items-center justify-center gap-3 bg-[#72d2c7] px-5 py-3.5 text-sm font-extrabold text-[#102a31] transition hover:bg-white"><Search className="h-4 w-4" />Open the field guide<ArrowUpRight className="h-4 w-4" /></Link>
              <Link to="/map" className="inline-flex items-center justify-center gap-3 border border-white/25 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"><Map className="h-4 w-4" />See the map</Link>
            </div>
          </div>

          <aside className="border border-white/15 bg-black/20 p-5 backdrop-blur-md lg:mb-2">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Today’s index</span>
              <span className="font-mono text-[10px] text-[#7ed9ce]">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              <div className="bg-[#102a31]/80 p-4"><p className="font-display text-4xl">{loading ? "—" : shops.length}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55">Listed places</p></div>
              <div className="bg-[#102a31]/80 p-4"><p className="font-display text-4xl">{CATEGORIES.length}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55">Categories</p></div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-white/70"><Compass className="h-4 w-4 text-[#7ed9ce]" />Distance-aware discovery when location is available.</div>
          </aside>
        </div>
      </section>

      <section className="contour-surface border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="atlas-label text-primary">01 / Start nearby</p>
              <h2 className="mt-3 max-w-md font-display text-4xl leading-[0.95] tracking-[-0.04em]">A better way to decide where to go.</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">LocalLens keeps the most useful signals in the open: what a shop is, where it is, whether it is open, and how far it is from you.</p>
              <Link to="/categories" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-foreground">Browse the full index <ChevronRight className="h-4 w-4" /></Link>
            </div>
            <div className="reveal-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.slice(0, 6).map((category, index) => (
                <Link key={category} to={`/explore?category=${category}`} className="group relative min-h-32 border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                  <span className="atlas-label text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <Store className="absolute right-4 top-4 h-4 w-4 text-primary/60" />
                  <p className="mt-9 font-display text-2xl tracking-[-0.035em] group-hover:text-primary">{category}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">Explore <ArrowUpRight className="h-3 w-3" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
            <div><p className="atlas-label text-primary">02 / Selected from the register</p><h2 className="mt-2 font-display text-4xl tracking-[-0.04em]">Recently listed places</h2></div>
            <Link to="/explore" className="inline-flex items-center gap-2 border border-foreground px-4 py-2.5 text-xs font-extrabold text-foreground transition hover:bg-foreground hover:text-background">Browse all results <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          {loading ? <div className="grid min-h-64 place-items-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : featured.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-3">{featured.map((shop, index) => <ShopCard key={shop.id} shop={shop} index={index} distance={getDistance(DEFAULT_CENTER[0], DEFAULT_CENTER[1], shop.lat, shop.lng)} />)}</div>
          ) : (
            <div className="mt-7 border border-dashed border-border bg-muted/30 px-6 py-14 text-center"><Sparkles className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-display text-2xl">The register is waiting for its first listing.</p><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Create a merchant account to publish the first place in this neighborhood.</p><Link to="/merchant/auth" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Open merchant access <ArrowUpRight className="h-4 w-4" /></Link></div>
          )}
        </div>
      </section>

      <section className="bg-secondary py-14 text-secondary-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
          <div><p className="atlas-label text-[#7ed9ce]">For independent local businesses</p><h2 className="mt-3 max-w-2xl font-display text-4xl leading-none tracking-[-0.04em]">Put your storefront into the local field guide.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/65">Manage your public profile, exact location, and current offerings from one merchant desk.</p></div>
          <Link to="/merchant/auth" className="inline-flex items-center justify-center gap-2 border border-white/25 px-5 py-3.5 text-sm font-extrabold transition hover:bg-white hover:text-secondary">Merchant access <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
