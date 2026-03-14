import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Shop } from "@/data/mockData";

interface ShopCardProps {
  shop: Shop;
  distance?: number;
  index?: number;
}

export function ShopCard({ shop, distance, index = 0 }: ShopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        to={`/shop/${shop.id}`}
        className="group block overflow-hidden rounded-lg border bg-card transition-all hover:card-shadow-hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={shop.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=70"}
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            <Star className="h-3 w-3 fill-current" />
            {shop.rating}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight">{shop.name}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                shop.isOpen
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {shop.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{shop.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {distance !== undefined && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                {distance.toFixed(1)} mi
              </span>
            )}
            <span>💰 {shop.priceLevel}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
