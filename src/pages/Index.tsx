import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LocablyHero } from "@/components/LocablyHero";
import { Footer } from "@/components/Footer";
import { ShopCard } from "@/components/ShopCard";
import { CategoryChip } from "@/components/CategoryChip";
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
      <LocablyHero />


      {/* Features */}
      <section className="container py-20">
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl text-foreground">
            Why <span className="text-gradient">Locably</span>?
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
            <ScrollReveal key={f.title} delay={i * 0.08}>
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
            <ScrollReveal key={shop.id} delay={i * 0.08}>
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

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 mb-0 bg-background">
        <div 
          className="absolute inset-0 z-0" 
          style={{ background: 'radial-gradient(125% 125% at 50% 10%, #fff 40%, #ea580c 100%)' }}
        />
        <div className="container relative z-10 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-8 max-w-3xl mx-auto">
              Ready to Discover Your Neighborhood?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-xl text-foreground font-bold mb-10 max-w-xl mx-auto opacity-70">
              Join thousands of locals finding the best artisans, shops, and experiences in their city.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Button asChild size="lg" className="h-14 rounded-full px-10 text-lg shadow-xl hover:scale-105 transition bg-primary">
              <Link to="/explore">Explore Map Now</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
