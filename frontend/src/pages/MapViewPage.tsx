/** Cartographic Editorial: full map context for the same live discovery records used across CornerStore. */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, MapPin } from "lucide-react";
import { MapView } from "@/components/MapView";
import { CATEGORIES, DEFAULT_CENTER, type Category, type Shop } from "@/data/mockData";
import { shopToMap, useShops } from "@/hooks/useShops";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function MapViewPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const { position } = useGeolocation();
  const { shops: records, loading } = useShops();
  const shops = useMemo<Shop[]>(() => records.map((shop) => shopToMap(shop, position[0] || DEFAULT_CENTER[0], position[1] || DEFAULT_CENTER[1])), [records, position]);
  const visible = category ? shops.filter((shop) => shop.category === category) : shops;
  return <main className="contour-surface min-h-[calc(100vh-70px)] p-4 sm:p-6 lg:p-10"><div className="mx-auto max-w-[1440px]"><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><Link to="/explore" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" />Return to register</Link><h1 className="mt-2 font-display text-4xl tracking-[-0.045em]">The local map</h1></div><div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-bold"><MapPin className="h-4 w-4 text-primary" />{visible.length} mapped places</div></div><div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]"><aside className="ink-rail p-5"><p className="atlas-label text-white/50">Map filter</p><div className="mt-4 grid gap-1"><button onClick={() => setCategory(null)} className={`flex items-center justify-between px-3 py-2.5 text-left text-xs font-bold ${!category ? "bg-[#72d2c7] text-[#102a31]" : "text-white/65 hover:bg-white/10"}`}>All categories <span>{shops.length}</span></button>{CATEGORIES.map((entry) => <button key={entry} onClick={() => setCategory(category === entry ? null : entry)} className={`px-3 py-2.5 text-left text-xs font-bold ${category === entry ? "bg-[#72d2c7] text-[#102a31]" : "text-white/65 hover:bg-white/10"}`}>{entry}</button>)}</div><div className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-white/55"><Compass className="mb-2 h-4 w-4 text-[#72d2c7]" />Move around the map or choose a category to simplify the pins.</div></aside><section className="relative min-h-[560px] bg-card">{loading ? <div className="grid h-full min-h-[560px] place-items-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div> : <MapView center={position} shops={visible} className="h-[min(70vh,700px)]" />}</section></div></div></main>;
}
