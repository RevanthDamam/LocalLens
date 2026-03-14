import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CATEGORIES, CATEGORY_ICONS } from "@/data/mockData";
import { motion } from "framer-motion";

const Categories = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12">
        <h1 className="mb-2 font-display text-3xl font-bold">Browse by Category</h1>
        <p className="mb-8 text-muted-foreground">Find exactly what you're looking for</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/explore?category=${cat}`}
                className="group flex items-center gap-4 rounded-lg border bg-card p-6 transition-all hover:border-primary hover:card-shadow-hover"
              >
                <span className="text-4xl">{CATEGORY_ICONS[cat]}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold group-hover:text-primary">{cat}</h3>
                  <p className="text-sm text-muted-foreground">Explore local {cat.toLowerCase()} shops</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Categories;
