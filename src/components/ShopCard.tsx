import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Shop } from "@/data/mockData";

interface ShopCardProps {
  shop: Shop;
  distance?: number;
  index?: number;
}

export function ShopCard({ shop, distance, index = 0 }: ShopCardProps) {
  // Using a more robust clipping fix for WebKit browsers
  const clipFix = { 
    maskImage: "-webkit-radial-gradient(white, black)",
    isolation: "isolate" as const
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
      }}
      className="group relative h-full"
    >
      <Link
        to={`/shop/${shop.id}`}
        style={clipFix}
        className="flex flex-col h-full bg-card rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden border border-border shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.18)] group-hover:border-orange-100 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/11] w-full overflow-hidden shrink-0 bg-muted">
          <motion.img
            src={shop.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"}
            alt={shop.name}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            loading="lazy"
          />
          
          {/* Rating Badge */}
          <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-2xl bg-card/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-black text-orange-600 shadow-lg border border-border">
            <Star className="h-3.5 w-3.5 fill-orange-600" />
            {shop.rating.toFixed(1)}
          </div>
          
          {/* Status Badge */}
          <div className="absolute left-5 bottom-5">
             <span className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                shop.isOpen
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              }`}>
                {shop.isOpen ? "Open Now" : "Closed"}
              </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
          <div className="mb-3 md:mb-4">
            <h3 className="font-display text-xl md:text-2xl font-black text-foreground leading-tight group-hover:text-orange-600 transition-colors uppercase italic tracking-tight underline-offset-4 decoration-orange-600/30 group-hover:underline">
              {shop.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <div className="p-1 bg-muted rounded-md">
                <ShoppingBag className="h-3 w-3 text-orange-600" />
               </div>
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{shop.category}</span>
            </div>
          </div>

          <p className="mb-6 md:mb-8 line-clamp-2 text-xs md:text-sm font-medium text-neutral-500 leading-relaxed font-body italic">
            {shop.description || "Experience the best local flavors and atmosphere."}
          </p>

          <div className="mt-auto space-y-4 md:space-y-5 pt-5 md:pt-6 border-t border-neutral-50">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2.5 text-neutral-600">
                  <div className="p-2.5 bg-orange-50 rounded-xl group-hover:bg-orange-600 transition-colors duration-500">
                    <MapPin className="h-4 w-4 text-orange-600 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-xs font-bold line-clamp-1 max-w-[150px]">{shop.address}</span>
               </div>
               {distance !== undefined && (
                 <span className="text-neutral-400 font-black uppercase tracking-tighter text-[10px]">
                   {distance.toFixed(1)} MI
                 </span>
               )}
            </div>

            <div className="flex items-center justify-between">
               <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  PRICING: <span className="text-neutral-900 ml-1.5">{shop.priceLevel}</span>
               </div>
               <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-[11px] group-hover:translate-x-1 transition-transform">
                  View Menu <ArrowRight className="h-3.5 w-3.5" />
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
