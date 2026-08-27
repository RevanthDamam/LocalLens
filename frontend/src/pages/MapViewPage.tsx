/** Cartographic Editorial: a compact legend rail and broad map canvas give the category pins primary visual focus. */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, MapPin } from "lucide-react";
import { MapView } from "@/components/MapView";
import { CATEGORY_CATALOG, DEFAULT_CENTER, type Category, type Shop } from "@/data/catalog";
import { shopToMap, useShops } from "@/hooks/useShops";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function MapViewPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const { position } = useGeolocation();
  const { shops: records, loading } = useShops();
  const shops = useMemo<Shop[]>(() => records.map((shop) => shopToMap(shop, position[0] || DEFAULT_CENTER[0], position[1] || DEFAULT_CENTER[1])), [records, position]);
  const visible = category ? shops.filter((shop) => shop.category === category) : shops;

  return <main className="contour-surface min-h-[calc(100vh-70px)] px-4 py-7 sm:px-8 lg:px-10 lg:py-8"><div className="mx-auto max-w-[1540px]"><header className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><Link to="/explore" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" />Return to register</Link><h1 className="mt-2 font-display text-4xl tracking-[-0.045em] sm:text-5xl">The local map</h1></div><div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-bold"><MapPin className="h-4 w-4 text-primary" />{loading ? "Mapping places" : `${visible.length} mapped places`}</div></header><div className="grid gap-5 xl:grid-cols-[268px_minmax(0,1fr)]"><aside className="ink-rail min-h-[560px] p-5"><p className="atlas-label text-white/50">Map filter</p><div className="mt-5 grid gap-1"><button onClick={() => setCategory(null)} className={`flex items-center justify-between px-3 py-3 text-left text-xs font-bold transition ${!category ? "bg-[#72d2c7] text-[#102a31]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><span>All categories</span><span>{shops.length}</span></button>{CATEGORY_CATALOG.map(({ name, Icon, color }) => <button key={name} onClick={() => setCategory(category === name ? null : name)} className={`flex items-center gap-3 px-3 py-2.5 text-left text-xs font-bold transition ${category === name ? "bg-[#72d2c7] text-[#102a31]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4 shrink-0" style={{ color: category === name ? "#102a31" : color }} strokeWidth={2.15} />{name}</button>)}</div><div className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-white/55"><Compass className="mb-2 h-4 w-4 text-[#72d2c7]" />Icons in the rail and on the map are the same. Filter the map by category or select a pin to open its listing.</div></aside><section className="relative min-h-[560px] overflow-hidden border border-border bg-card shadow-elevated">{loading ? <div className="grid min-h-[560px] place-items-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div> : <MapView center={position} shops={visible} className="h-[clamp(560px,calc(100vh-190px),720px)]" />}</section></div></div></main>;
}
