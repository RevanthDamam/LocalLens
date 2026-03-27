import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Search, Menu, X, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b bg-card/70 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
            <svg viewBox="0 0 24 24" fill="none" className="stroke-primary h-6 w-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </motion.div>
          Locably
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30">
            <Search className="h-4 w-4" />
            <span>Search shops...</span>
          </div>
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.display_name || "Merchant"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/merchant" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/merchant/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/merchant">Join Now</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-card md:hidden"
          >
            <div className="container flex flex-col gap-4 py-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium ${location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 border-t pt-4">
                {user ? (
                  <>
                    <Link
                      to="/merchant"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      to="/merchant/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setMobileOpen(false); }}
                      className="flex items-center gap-2 text-left text-sm font-medium text-destructive"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </>
                ) : (
                  <Button asChild size="sm" className="w-full">
                    <Link to="/merchant" onClick={() => setMobileOpen(false)}>Join Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
