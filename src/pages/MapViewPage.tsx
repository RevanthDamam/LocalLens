import { useState, useMemo } from "react"; // Re-saved to fix resolution issue
import { Search, MapPin, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapView } from "@/components/MapView";
import { CategoryChip } from "@/components/CategoryChip";
import { MapSkeleton } from "@/components/LoadingSkeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useShops, shopToMap } from "@/hooks/useShops";
import { CATEGORIES, DEFAULT_CENTER, getDistance, type Category } from "@/data/mockData";
import { motion } from "framer-motion";

const MapViewPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { position, loading } = useGeolocation();
  const { shops: shopsFromDb, loading: shopsLoading } = useShops();

  const shops = useMemo(() => shopsFromDb.map((s) =>
    shopToMap(s, position[0] || DEFAULT_CENTER[0], position[1] || DEFAULT_CENTER[1])
  ), [shopsFromDb, position]);

  const filteredShops = useMemo(() => {
    if (!selectedCategory) return shops;
    return shops.filter(s => s.category === selectedCategory);
  }, [selectedCategory, shops]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
       {/* Animated Background Mesh */}
       <div className="absolute inset-0 z-0 opacity-50">
            <motion.div 
                className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-orange-200/40 blur-[100px]"
                animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-orange-300/20 blur-[100px]"
                animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col flex-grow items-center">
                <div className="container py-10 flex-grow flex flex-col">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white shadow-sm border border-neutral-100 hover:bg-orange-50 transition-colors">
                                    <ArrowLeft className="h-5 w-5 text-neutral-600" />
                                </button>
                                <h1 className="text-4xl font-black font-display text-neutral-900 tracking-tight leading-none uppercase">Map View</h1>
                            </div>
                            <p className="text-neutral-500 font-medium">Browse shops across the neighborhood map</p>
                        </div>

                        <div className="flex-1 max-w-xl">
                             <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`rounded-xl border px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        !selectedCategory
                                        ? "border-orange-200 bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                                        : "border-white bg-white/60 text-neutral-500 hover:bg-white"
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
                    </div>

                    <div className="flex-grow rounded-[48px] overflow-hidden border-8 border-white shadow-2xl bg-white relative h-[calc(100vh-300px)] min-h-[600px]">
                        {(loading || shopsLoading) ? <MapSkeleton /> : (
                            <MapView center={position} shops={filteredShops} className="w-full h-full" />
                        )}
                        <div className="absolute top-6 left-6 z-[400]">
                            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 text-xs font-black uppercase tracking-[0.2em] shadow-xl text-orange-600">
                                {filteredShops.length} Locations Visible
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    </div>
  );
};

export default MapViewPage;
