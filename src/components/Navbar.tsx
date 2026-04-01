import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/categories", label: "Categories" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };



  return (
    <div 
      className="fixed inset-x-0 top-0 z-[100] px-4 py-4 md:py-8 pointer-events-none"
    >
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="mx-auto max-w-5xl pointer-events-auto flex items-center justify-between px-6 py-2.5 rounded-full border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-3xl bg-white/10 dark:bg-card/20 transition-all duration-300 ring-1 ring-white/20"
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tighter text-foreground uppercase italic group-hover:text-primary transition-colors">
            Locably
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                location.pathname === link.to ? "text-primary" : "text-foreground/70 hover:text-primary"
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="active-pill-nav"
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search removed */}
          
          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />
          
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/20 bg-white/5 hover:border-primary transition-all">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-[10px] font-black">{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-4 rounded-3xl p-3 border-white/20 bg-white/10 dark:bg-card/90 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20" align="end">
                <DropdownMenuLabel className="font-normal px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold uppercase italic tracking-tight">{user.user_metadata?.display_name || "Merchant"}</p>
                    <p className="text-[11px] font-medium text-muted-foreground truncate opacity-70">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-20" />
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild className="rounded-2xl py-2.5">
                    <Link to="/merchant" className="flex items-center gap-3 w-full cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-wider">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="opacity-20" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-2xl py-2.5 text-destructive focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-3" />
                  <span className="font-black text-xs uppercase tracking-wider">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              to="/merchant" 
              className="hidden sm:flex items-center px-6 py-2.5 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-[0.05em] shadow-lg shadow-primary/20 hover:scale-105 hover:bg-orange-600 transition-all active:scale-95"
            >
              Become a Merchant
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 md:hidden active:scale-90 transition-transform pointer-events-auto"
          >
            {mobileOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-x-4 top-[100px] z-[90] p-6 rounded-3xl bg-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl md:hidden pointer-events-auto ring-1 ring-white/20"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Quick Navigation</span>
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      location.pathname === link.to ? "bg-primary text-white shadow-lg" : "hover:bg-white/10 text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="h-px bg-white/20" />
              
              <Link 
                to="/merchant" 
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl"
              >
                Sign In to Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
