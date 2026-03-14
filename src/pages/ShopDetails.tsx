import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Phone, Globe, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getShops, getShopItems, getReviews, CATEGORY_ICONS } from "@/data/mockData";

const ShopDetails = () => {
  const { id } = useParams();
  
  const shops = getShops();
  const shopItems = getShopItems();
  const reviews = getReviews();

  const shop = shops.find(s => s.id === id);
  const items = shopItems.filter(i => i.shopId === id);
  const shopReviews = reviews.filter(r => r.shopId === id);

  if (!shop) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-32 text-center">
          <h1 className="font-display text-2xl font-bold">Shop not found</h1>
          <Button asChild className="mt-4">
            <Link to="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-6">
        <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        {/* Image Gallery */}
        <div className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-lg">
            <img src={shop.image} alt={shop.name} className="h-64 w-full object-cover sm:h-80" />
          </div>
          <div className="hidden gap-3 sm:grid sm:grid-rows-2">
            <div className="overflow-hidden rounded-lg">
              <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" style={{ filter: "brightness(0.9)" }} />
            </div>
            <div className="overflow-hidden rounded-lg">
              <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" style={{ filter: "saturate(1.2)" }} />
            </div>
          </div>
        </div>

        {/* Shop Info Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 font-display text-2xl font-bold md:text-3xl">
              {shop.name}
              <span className="rounded-full bg-info p-1 text-info-foreground">
                <Star className="h-3 w-3 fill-current" />
              </span>
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{CATEGORY_ICONS[shop.category]} {shop.category}</span>
              <span className={shop.isOpen ? "text-success font-medium" : "text-destructive font-medium"}>
                ● {shop.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {shop.address}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Mail className="h-4 w-4" /> Message
            </Button>
            <Button size="sm" className="gap-1">
              <MapPin className="h-4 w-4" /> View on Map
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Reviews", value: shop.reviewCount.toLocaleString() },
            { label: "Rating", value: <span className="flex items-center gap-1">{shop.rating} <Star className="h-4 w-4 fill-primary text-primary" /></span> },
            { label: "Price", value: shop.priceLevel },
            { label: "Wait Time", value: shop.waitTime },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="mt-1 text-xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {/* About */}
            <section className="mb-8">
              <h2 className="mb-3 font-display text-xl font-bold">About the Shop</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{shop.description}</p>
            </section>

            {/* Items */}
            <section className="mb-8">
              <h2 className="mb-4 font-display text-xl font-bold">
                {items.length > 0 ? "Menu / Products" : "No items listed yet"}
              </h2>
              {items.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 rounded-lg border bg-card p-3"
                    >
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold">{item.name}</h4>
                          <span className="text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
                        {!item.available && (
                          <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="mb-4 font-display text-xl font-bold">Customer Reviews</h2>
              {shopReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {shopReviews.map(review => (
                    <div key={review.id} className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {review.initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{review.author}</div>
                            <div className="text-xs text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                  <button className="w-full rounded-lg border-2 border-dashed border-primary/30 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent">
                    View All {shop.reviewCount.toLocaleString()} Reviews
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-20 space-y-4">
              <div className="rounded-lg border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-display font-semibold">
                  <span className="rounded-full bg-info/10 p-1"><Globe className="h-3.5 w-3.5 text-info" /></span>
                  Shop Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">{shop.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">{shop.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">{shop.hours.sunday}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{shop.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <a href="#" className="text-primary hover:underline">{shop.website}</a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopDetails;
