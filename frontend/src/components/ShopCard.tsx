/** Cartographic Editorial: a compact business field card with real discovery metadata and decisive map-like hierarchy. */
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Shop } from "@/data/mockData";

interface ShopCardProps {
  shop: Shop;
  distance?: number;
  index?: number;
}

const fallbackImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=82";

export function ShopCard({ shop, distance, index = 0 }: ShopCardProps) {
  const rating = typeof shop.rating === "number" && shop.rating > 0 ? shop.rating.toFixed(1) : "Unrated";
  return (
    <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.28 }} whileHover={{ y: -2 }} className="group h-full">
      <Link to={`/shop/${shop.id}`} className="atlas-card flex h-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-200 hover:border-primary/45 hover:shadow-[0_20px_45px_-26px_hsl(var(--foreground)/0.45)]">
        <div className="relative aspect-[15/10] overflow-hidden bg-muted">
          <img src={shop.image || fallbackImage} alt={shop.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-white">
            <span className="atlas-label border border-white/30 bg-black/30 px-2 py-1 backdrop-blur-sm">{shop.category}</span>
            <span className={`atlas-label px-2 py-1 ${shop.isOpen ? "bg-primary text-primary-foreground" : "bg-black/60"}`}>{shop.isOpen ? "Open" : "Closed"}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="atlas-label text-muted-foreground">Entry {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 font-display text-[25px] leading-[0.98] tracking-[-0.035em] text-foreground transition-colors group-hover:text-primary">{shop.name}</h3>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{shop.description || "Details are being added by this local business."}</p>

          <div className="mt-auto grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 border-t border-border pt-4">
            <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-foreground"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" /><span className="truncate">{shop.address}</span></span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground"><Compass className="h-3 w-3 text-primary" />{distance === undefined ? "—" : `${distance.toFixed(1)} mi`}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-foreground"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{rating}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{shop.priceLevel || "$"}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
