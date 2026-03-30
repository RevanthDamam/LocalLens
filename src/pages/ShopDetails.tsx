import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Phone, Globe, Mail, ChevronRight, ShoppingBag, MessageSquare, Map as MapIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShops, useShopItems, shopToMap } from "@/hooks/useShops";
import { DEFAULT_CENTER, getDistance } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { HeroAiEcommerce } from "@/components/hero-ai-ecommerce";
import { TimelineAnimation } from "@/components/timeline-animation";
import { useState, useEffect, useRef } from "react";

const ShopDetails = () => {
   const { id } = useParams();
   const { shops: shopsFromDb, loading: shopsLoading } = useShops();
   const { items, loading: itemsLoading } = useShopItems(id || null);
   const detailRef = useRef<HTMLDivElement>(null);
   const [hasEntered, setHasEntered] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => setHasEntered(true), 100);
      return () => clearTimeout(timer);
   }, []);

   const shop = shopsFromDb.find(s => s.id === id);
   const mappedShop = shop ? shopToMap(shop, DEFAULT_CENTER[0], DEFAULT_CENTER[1]) : null;

   if (shopsLoading) {
      return (
         <HeroAiEcommerce showHero={false}>
            <div className="flex h-[80vh] items-center justify-center">
               <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
            </div>
         </HeroAiEcommerce>
      );
   }

   if (!mappedShop) {
      return (
         <HeroAiEcommerce showHero={false}>
            <div className="container flex flex-col items-center justify-center py-32 text-center">
               <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-6">
                  <ShoppingBag className="h-10 w-10 text-neutral-300" />
               </div>
               <h1 className="font-display text-4xl font-black text-neutral-900 uppercase italic">Shop not found</h1>
               <Button asChild className="mt-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 py-6 font-bold uppercase tracking-widest text-xs border-none">
                  <Link to="/explore">Back to Explore</Link>
               </Button>
            </div>
         </HeroAiEcommerce>
      );
   }

   return (
      <HeroAiEcommerce showHero={false}>
       <div ref={detailRef} className="rounded-[40px] bg-card shadow-2xl border border-border overflow-hidden mb-20 max-w-7xl mx-auto">
          {/* Cover Header Image - Clean Banner */}
          <div className="relative h-[400px] w-full overflow-hidden">
             <img src={mappedShop.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"} className="h-full w-full object-cover" alt={mappedShop.name} />
             <div className="absolute inset-0 bg-linear-to-t from-neutral-900/20 to-transparent"></div>
             
             <div className="absolute top-8 left-8 z-20">
                <Link to="/explore" className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-white/60 transition-all border border-white/20">
                   <ArrowLeft className="h-4 w-4" /> Back to Explore
                </Link>
             </div>
          </div>

          {/* Shop Header Details - Separated */}
          <div className="px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <span className="bg-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white">{mappedShop.category}</span>
                   <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-xs font-black text-orange-600 border border-border italic">
                      <Star className="h-3.5 w-3.5 fill-orange-600" />
                      {mappedShop.rating.toFixed(1)}
                   </div>
                   <div className="flex items-center gap-1.5 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                      {mappedShop.isOpen ? "Open Now" : "Currently Closed"}
                   </div>
                </div>
                
                <h1 className="font-display text-7xl font-black tracking-tighter leading-[0.9] text-foreground uppercase italic">{mappedShop.name}</h1>
                
                <div className="flex items-center gap-3 text-neutral-400 font-bold">
                   <div className="p-2 bg-orange-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-orange-600" />
                   </div>
                   <span className="text-lg text-neutral-500">{mappedShop.address}</span>
                </div>
             </div>

             <div className="flex flex-wrap gap-4 pb-2">
                <button className="flex items-center gap-3 bg-neutral-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-orange-600 transition-all hover:scale-105">
                   <MessageSquare className="h-4 w-4" /> Send Message
                </button>
                <button className="flex items-center gap-3 bg-white text-neutral-900 border-2 border-neutral-100 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:border-orange-200 transition-all hover:scale-105">
                   <MapIcon className="h-4 w-4" /> Locate on Map
                </button>
             </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 p-12">
               <div className="space-y-12">
                  {/* About */}
                  <TimelineAnimation animationNum={1} timelineRef={hasEntered ? { current: document.body } : detailRef} className="space-y-4">
                     <h2 className="font-display text-3xl font-black text-neutral-900 uppercase italic flex items-center gap-3">
                        Story <div className="h-px flex-1 bg-neutral-100"></div>
                     </h2>
                     <p className="text-xl text-neutral-500 font-medium leading-relaxed font-body">
                        {mappedShop.description || "Experience the finest local selection at our store. We take pride in offering high-quality products and a unique atmosphere that reflects our community's spirit."}
                     </p>
                  </TimelineAnimation>

                  {/* Items/Menu */}
                  <TimelineAnimation animationNum={2} timelineRef={hasEntered ? { current: document.body } : detailRef} className="space-y-8">
                     <h2 className="font-display text-3xl font-black text-neutral-900 uppercase italic flex items-center gap-3">
                        Offerings <div className="h-px flex-1 bg-neutral-100"></div>
                     </h2>

                     {itemsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-neutral-50 rounded-3xl animate-pulse"></div>)}
                        </div>
                     ) : items.length === 0 ? (
                        <div className="bg-neutral-50 rounded-[32px] p-12 text-center border-2 border-dashed border-neutral-100">
                           <ShoppingBag className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                           <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm">No items listed yet</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {items.map((item, i) => (
                              <motion.div
                                 key={item.id}
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 whileInView={{ opacity: 1, scale: 1 }}
                                 viewport={{ once: true }}
                                 transition={{ delay: i * 0.05 }}
                                 className="flex gap-5 bg-card border border-border rounded-[32px] p-5 hover:shadow-xl hover:shadow-orange-500/5 transition-all group"
                              >
                                 <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-muted">
                                    <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                 </div>
                                 <div className="flex flex-col justify-between py-1">
                                    <div>
                                       <h4 className="font-display font-black text-neutral-900 tracking-tight uppercase italic">{item.name}</h4>
                                       <p className="text-xs text-neutral-400 font-medium line-clamp-2 mt-1">{item.description}</p>
                                    </div>
                                    <div className="text-orange-600 font-black text-lg">${item.price.toFixed(2)}</div>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     )}
                  </TimelineAnimation>
               </div>

               {/* Sidebar Info */}
               <aside className="space-y-8">
                  <TimelineAnimation animationNum={3} timelineRef={hasEntered ? { current: document.body } : detailRef} className="bg-neutral-50 rounded-[40px] p-8 border border-neutral-100">
                     <h3 className="font-display text-xl font-black text-neutral-900 uppercase italic mb-8 flex items-center gap-3">
                        Info <div className="h-px flex-1 bg-neutral-200/50"></div>
                     </h3>

                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-neutral-100">
                              <Clock className="h-5 w-5" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Hours</div>
                              <div className="text-sm font-bold text-neutral-900">{mappedShop.hours.weekday}</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-neutral-100">
                              <Phone className="h-5 w-5" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Contact</div>
                              <div className="text-sm font-bold text-neutral-900">{mappedShop.phone || "Not listed"}</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-neutral-100">
                              <Globe className="h-5 w-5" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Website</div>
                              <div className="text-sm font-bold text-orange-600 truncate max-w-[200px] hover:underline cursor-pointer">
                                 {mappedShop.website || "locably.app/sh/" + id?.slice(0, 6)}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="mt-10 pt-8 border-t border-neutral-200/50">
                        <button className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-orange-600 transition-all">
                           Leave a Review
                        </button>
                     </div>
                  </TimelineAnimation>

                  {/* Map Preview Placeholder */}
                  <div className="rounded-[40px] h-[300px] bg-neutral-100 overflow-hidden border border-neutral-100 relative group cursor-pointer">
                     <div className="absolute inset-0 bg-neutral-200 bg-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"></div>
                     <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 to-transparent"></div>
                     <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white px-4 py-2 rounded-xl text-neutral-900 text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-between">
                           Explore Map <ArrowRight className="h-3 w-3" />
                        </div>
                     </div>
                  </div>
               </aside>
            </div>
         </div>
      </HeroAiEcommerce>
   );
};

export default ShopDetails;

