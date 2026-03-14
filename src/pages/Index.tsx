import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopCard } from "@/components/ShopCard";
import { CategoryChip } from "@/components/CategoryChip";
import { HeroScene } from "@/components/HeroScene";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TiltCard } from "@/components/TiltCard";
import { useShops, shopToMap } from "@/hooks/useShops";
import { CATEGORIES, DEFAULT_CENTER, getDistance } from "@/data/mockData";
import type { Shop } from "@/data/mockData";

const Index = () => {
  const { shops: shopsFromDb } = useShops();
  const shops: Shop[] = shopsFromDb.map((s) => shopToMap(s, DEFAULT_CENTER[0], DEFAULT_CENTER[1]));
  const featuredShops = shops.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-b from-secondary via-secondary/95 to-secondary/80">
        <HeroScene />
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container relative z-10 py-24 text-center md:py-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="mx-auto mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            ✨ Your neighborhood, reimagined
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-tight text-secondary-foreground md:text-6xl lg:text-7xl"
          >
            Discover the Best{" "}
            <span className="text-gradient">Local Shops</span>{" "}
            Near You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-5 max-w-xl text-lg text-secondary-foreground/70"
          >
            Connecting you with the heart of your community, from artisan bakeries to local groceries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: "0 12px 40px -12px hsl(var(--primary) / 0.25)" }}
            className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-2xl bg-card/90 p-2 shadow-elevated backdrop-blur-sm"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button asChild className="cursor-pointer rounded-xl font-body">
              <Link to="/explore" className="gap-2">
                Find Shops <ArrowRight className="inline h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-12 flex max-w-md justify-center gap-8"
          >
            {[
              { value: "120+", label: "Local Shops" },
              { value: "50k+", label: "Happy Users" },
              { value: "4.9", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-secondary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
            Why <span className="text-gradient">LocalLens</span>?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
            We make discovering your neighborhood effortless and delightful.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Globe, title: "Real-Time Map", desc: "See shops around you in real-time with live location tracking." },
            { icon: Sparkles, title: "Curated Picks", desc: "Hand-picked local gems, rated and reviewed by your community." },
            { icon: Shield, title: "Trusted Reviews", desc: "Authentic reviews from real customers, no fake listings ever." },
          ].map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.15}>
              <TiltCard>
                <motion.div
                  className="group rounded-2xl border bg-card p-8 transition-colors hover:border-primary/30"
                  whileHover={{ y: -4, boxShadow: "0 12px 40px -12px hsl(var(--primary) / 0.15)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground font-body">{f.desc}</p>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-6">
        <ScrollReveal>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <Link key={cat} to={`/explore?category=${cat}`}>
                <CategoryChip category={cat} active={cat === "Bakery"} onClick={() => {}} />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Featured Shops */}
      <section className="container pb-20">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Featured Shops</h2>
              <p className="text-sm text-muted-foreground">Hand-picked local gems you'll love</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/explore" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredShops.map((shop, i) => (
            <ScrollReveal key={shop.id} delay={i * 0.12}>
              <TiltCard>
                <ShopCard
                  shop={shop}
                  distance={getDistance(DEFAULT_CENTER[0], DEFAULT_CENTER[1], shop.lat, shop.lng)}
                  index={i}
                />
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
