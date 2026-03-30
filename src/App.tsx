import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AIChat } from "@/components/AIChat";
 import { Navbar } from "@/components/Navbar";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import ShopDetails from "@/pages/ShopDetails";
import Categories from "@/pages/Categories";
import MerchantDashboard from "@/pages/MerchantDashboard";
import MerchantProfile from "@/pages/MerchantProfile";
import MerchantAuth from "@/pages/MerchantAuth";
import MapViewPage from "@/pages/MapViewPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/shop/:id" element={<ShopDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/merchant" element={<MerchantDashboard />} />
          <Route path="/merchant/profile" element={<MerchantProfile />} />
          <Route path="/merchant/auth" element={<MerchantAuth />} />
          <Route path="/map" element={<MapViewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatedBackground />
         <BrowserRouter>
          <Navbar />
          <div className="relative z-10">
            <AnimatedRoutes />
          </div>
          <AIChat />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
