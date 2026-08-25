/** Cartographic Editorial: compact ink navigation that keeps public exploration readable and reachable. */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Map, Shapes, Search, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BrandMark } from "@/components/BrandMark";

const navLinks = [
  { to: "/explore", label: "Discover", icon: Search },
  { to: "/map", label: "Map", icon: Map },
  { to: "/categories", label: "Index", icon: Shapes },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-foreground" aria-label="CornerStore home">
          <BrandMark className="h-9 w-9 rounded-xl" />
          <span className="font-display text-[22px] leading-none tracking-[-0.04em]">CornerStore</span>
          <span className="hidden border-l border-border pl-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">Field guide</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to === "/explore" && location.pathname.startsWith("/shop"));
            return (
              <Link key={to} to={to} className={`group relative flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className="h-3.5 w-3.5" />
                {label}
                {active && <motion.span layoutId="atlas-nav" className="absolute inset-x-3 -bottom-[11px] h-0.5 bg-primary" />}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button onClick={() => navigate("/merchant")} className="hidden items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-bold text-foreground transition hover:border-primary/50 hover:text-primary sm:flex">
                <LayoutDashboard className="h-3.5 w-3.5" /> Merchant desk
              </button>
              <button onClick={handleSignOut} className="hidden p-2 text-muted-foreground transition hover:text-destructive sm:block" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/merchant/auth" className="hidden items-center gap-2 bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground transition hover:bg-primary sm:flex">
              Merchant access <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <button onClick={() => setMobileOpen((open) => !open)} className="grid h-9 w-9 place-items-center border border-border text-foreground md:hidden" aria-label="Toggle navigation">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="border-t border-border bg-card px-4 py-3 md:hidden">
            <div className="grid gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-3 py-3 text-sm font-bold text-foreground hover:bg-accent">
                  <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-primary" />{label}</span><ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              <Link to={user ? "/merchant" : "/merchant/auth"} onClick={() => setMobileOpen(false)} className="mt-1 bg-secondary px-3 py-3 text-sm font-bold text-secondary-foreground">
                {user ? "Open merchant desk" : "Merchant access"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
