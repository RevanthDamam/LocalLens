import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CATEGORIES, CATEGORY_ICONS } from "@/data/mockData";
import { motion } from "framer-motion";

const Categories = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-50">
            <motion.div 
                className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-orange-200/40 blur-[100px]"
                animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-orange-300/20 blur-[100px]"
                animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 container py-20 flex flex-col">
                <div className="mb-16">
                    <h1 className="text-6xl font-black font-display text-neutral-900 tracking-tight leading-none mb-4 uppercase">Direct Categories</h1>
                    <p className="text-xl text-neutral-500 font-medium">Find exactly what you're looking for by browsing our curated shop sectors.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                        >
                            <Link
                                to={`/explore?category=${cat}`}
                                className="group relative block p-10 rounded-[40px] bg-white border-2 border-transparent hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-3"
                            >
                                <div className="absolute top-10 right-10 text-9xl font-black text-neutral-100/30 group-hover:text-orange-100/50 transition-colors pointer-events-none select-none">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <div className="relative z-10">
                                    <div className="h-20 w-20 rounded-3xl bg-orange-50 flex items-center justify-center text-5xl mb-8 group-hover:bg-white group-hover:scale-110 transition-all border border-transparent group-hover:border-orange-100 shadow-inner">
                                        {CATEGORY_ICONS[cat]}
                                    </div>
                                    <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight mb-2 uppercase italic">{cat}</h3>
                                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest leading-relaxed">Explore local {cat.toLowerCase()} stores</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    </div>
  );
};

export default Categories;
