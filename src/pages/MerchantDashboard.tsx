import React, { useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMerchantShop } from "@/hooks/useMerchantShop";
import { CATEGORIES } from "@/data/mockData";
import { MapPinPicker } from "@/components/MapPinPicker";
import {
  LayoutDashboard, Store, BarChart3, HelpCircle, LogOut,
  Save, Plus, Trash2, Edit, Phone, MessageSquare, Star, X, User,
  MapPin, Upload, Image as ImageIcon, Bell, Settings, Search, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { HeroAiEcommerce } from "@/components/hero-ai-ecommerce";
import { TimelineAnimation } from "@/components/timeline-animation";

type Tab = "overview" | "shop" | "reviews" | "analytics";

function ImageUpload({ image, onChange }: { image: string | null; onChange: (img: string) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex aspect-[4/3] w-full max-w-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/40 bg-white/50 backdrop-blur-sm transition-colors hover:border-primary hover:bg-white/80">
      {image ? (
        <img src={image} alt="Preview" className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-primary/70">
          <Upload className="h-6 w-6" />
          <span className="text-xs font-semibold">Upload Photo</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 z-10 cursor-pointer opacity-0" />
    </div>
  );
}

const chartData = [
  { name: 'MON', val: 40 },
  { name: 'TUE', val: 65 },
  { name: 'WED', val: 30 },
  { name: 'THU', val: 85 },
  { name: 'FRI', val: 55 },
  { name: 'SAT', val: 120 },
  { name: 'SUN', val: 70 }
];

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { shop, items, loading: shopLoading, createShop, updateShop, deleteShop, addItem, updateItem, deleteItem } = useMerchantShop(user?.id);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Shop form state
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState<string>(CATEGORIES[0]);
  const [shopAddress, setShopAddress] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState<string | null>(null);
  const [shopLatitude, setShopLatitude] = useState<string>("");
  const [shopLongitude, setShopLongitude] = useState<string>("");

  // Item dialog state
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/merchant/auth");
    }
  }, [authLoading, user, navigate]);

  const syncForm = useCallback(() => {
    if (shop) {
      setShopName(shop.name || "");
      setShopCategory(shop.category || CATEGORIES[0]);
      setShopAddress(shop.address || "");
      setShopDescription(shop.description || "");
      setShopImage(shop.image || null);
      setShopLatitude(shop.latitude?.toString() || "");
      setShopLongitude(shop.longitude?.toString() || "");
    }
  }, [shop]);

  useEffect(() => {
    if (shop) syncForm();
  }, [shop, syncForm]);

  const handleSaveShop = async () => {
    if (!shopName.trim() || !shopAddress.trim()) {
      toast.error("Name and address are required");
      return;
    }
    const lat = shopLatitude ? parseFloat(shopLatitude) : null;
    const lng = shopLongitude ? parseFloat(shopLongitude) : null;
    const payload = { 
      name: shopName, 
      category: shopCategory, 
      address: shopAddress, 
      description: shopDescription, 
      image: shopImage,
      latitude: lat, 
      longitude: lng 
    };

    if (shop) {
      await updateShop(payload);
    } else {
      await createShop(payload);
    }
  };

  const openAddItem = () => {
    setEditingItem(null);
    setItemName("");
    setItemPrice("");
    setItemDescription("");
    setItemImage(null);
    setShowItemDialog(true);
  };

  const openEditItem = (item: any) => {
    setEditingItem(item.id);
    setItemName(item.name || "");
    setItemPrice(item.price?.toString() || "");
    setItemDescription(item.description || "");
    setItemImage(item.image || null);
    setShowItemDialog(true);
  };

  const handleSaveItem = async () => {
    if (!itemName.trim()) {
      toast.error("Item name is required");
      return;
    }
    const price = parseFloat(itemPrice) || 0;
    const payload = { 
       name: itemName, 
       price, 
       description: itemDescription,
       image: itemImage
    };

    if (editingItem) {
      await updateItem(editingItem, payload);
    } else {
      await addItem(payload);
    }
    setShowItemDialog(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(itemId);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white/30 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="text-muted-foreground">{authLoading ? "Authenticating..." : "Redirecting..."}</div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "shop", label: "Shop Listing", icon: <Store className="h-4 w-4" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <section ref={dashboardRef} className="bg-[#f8f9fa] min-h-screen">
      <HeroAiEcommerce showHero={false} showNav={false}>
        <div className="flex min-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-100">
          {/* Sidebar */}
          <aside className="w-64 border-r border-neutral-100 bg-white p-6 flex flex-col">
            <div className="flex items-center gap-3 px-2 mb-10">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-orange-500/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-white w-full h-full"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 10v4" />
                  <path d="M10 12h4" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-neutral-900">Locably</span>
            </div>

            <nav className="flex-1 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">Management</div>
              {[
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'shop', label: 'Shop Profile', icon: Store },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'explore_redirect', label: 'Explore Shops', icon: MapPin, path: '/explore' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { 
                    if (item.path) {
                      navigate(item.path);
                    } else {
                      setActiveTab(item.id as Tab); 
                      if (item.id === "shop") syncForm(); 
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? "bg-orange-50 text-orange-600"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              ))}

              <div className="pt-8 mb-4 border-t border-neutral-50 mx-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">Account</div>
                <button
                  onClick={() => navigate('/merchant/profile')}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="flex-1 text-left font-display">My Profile</span>
                </button>
              </div>
            </nav>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl bg-orange-600 p-4 text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-sm mb-1">Switch to Pro</h4>
                  <p className="text-[10px] text-orange-100 leading-relaxed">Get advanced tools and benefits</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col bg-white/5">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-neutral-50">
              <h2 className="font-bold text-lg text-neutral-900">Overview</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 border-l pl-6 border-neutral-100">
                  <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                  </button>
                  <button className="text-neutral-400 hover:text-neutral-600 transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
                  </button>
                  <div className="ml-2 flex items-center gap-3 pl-2">
                    <div className="flex h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-neutral-100 shadow-sm">
                       {shop?.image ? <img src={shop.image} className="h-full w-full object-cover" /> : <User className="p-2 text-neutral-400" />}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold leading-none">{shopName || "Al Razi"}</div>
                      <div className="mt-1 text-[10px] text-neutral-400">@{user?.email?.split('@')[0] || "jhone"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {activeTab === "shop" ? (
                    <div className="space-y-8">
                      {/* Shop Profile Block */}
                      <TimelineAnimation animationNum={1} timelineRef={hasEntered ? { current: document.body } : dashboardRef} className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm">
                        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                          <div>
                            <h2 className="text-2xl font-bold font-display">Shop Profile</h2>
                            <p className="text-sm font-medium text-neutral-400">Update your public storefront information</p>
                          </div>
                          <Button onClick={handleSaveShop} className="rounded-full px-8 py-6 font-bold shadow-lg shadow-orange-500/20 bg-orange-600 hover:bg-orange-700 hover:scale-105 transition-all text-white">
                            Save Changes
                          </Button>
                        </div>
                        
                        <div className="grid gap-10 lg:grid-cols-[1fr_250px]">
                          <div className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shop Name</label>
                                <input 
                                  className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all text-neutral-900 shadow-xs" 
                                  value={shopName} onChange={e => setShopName(e.target.value)} 
                                  placeholder="The Local Bistro"
                                />
                              </div>
                              <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category</label>
                                <select 
                                  className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all text-neutral-900 shadow-xs"
                                  value={shopCategory} onChange={e => setShopCategory(e.target.value)}
                                >
                                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description</label>
                              <textarea 
                                rows={4}
                                className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all text-neutral-900 shadow-xs"
                                value={shopDescription} onChange={e => setShopDescription(e.target.value)}
                                placeholder="Tell your story..."
                              />
                            </div>
                          </div>
                          <div>
                             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400 text-center sm:text-left">Cover Image</label>
                             <div className="flex justify-center sm:justify-start">
                               <ImageUpload image={shopImage} onChange={setShopImage} />
                             </div>
                          </div>
                        </div>

                        <div className="mt-10 border-t border-neutral-50 pt-8 text-neutral-900">
                          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Location Details</label>
                          <div className="mb-6">
                            <div className="relative">
                              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                              <input 
                                placeholder="123 Gastronomy St, Foodville"
                                className="w-full rounded-xl border border-neutral-100 bg-neutral-50 pl-12 pr-4 py-3.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all text-neutral-900"
                                value={shopAddress} onChange={e => setShopAddress(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="rounded-2xl border border-neutral-50 bg-neutral-50 p-1">
                            <MapPinPicker 
                               position={shopLatitude && shopLongitude ? [parseFloat(shopLatitude), parseFloat(shopLongitude)] : null} 
                               onChange={([lat, lng]) => { setShopLatitude(lat.toString()); setShopLongitude(lng.toString()); }} 
                            />
                          </div>
                        </div>
                      </TimelineAnimation>

                      {/* Inventory Section */}
                      <TimelineAnimation animationNum={2} timelineRef={hasEntered ? { current: document.body } : dashboardRef} className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm">
                        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                          <div>
                            <h2 className="text-2xl font-bold font-display">Products & Menu</h2>
                            <p className="text-sm font-medium text-neutral-400">Manage your offerings and pricing</p>
                          </div>
                          <Button onClick={openAddItem} variant="outline" className="rounded-full gap-2 border-orange-600 bg-white font-bold text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm transition-all px-6 py-5">
                            <Plus className="h-4 w-4" /> Add Item
                          </Button>
                        </div>
                        
                        {(!items || items.length === 0) ? (
                          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-50 bg-neutral-50 py-16 text-center text-neutral-400">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xs">
                              <ImageIcon className="h-8 w-8 opacity-40 text-orange-600" />
                            </div>
                            <p className="text-lg font-bold text-neutral-900">No menu items yet</p>
                            <p className="mt-1 text-sm font-medium">Add your first item to start selling.</p>
                          </div>
                        ) : (
                          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((item: any) => (
                              <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
                                {item.image ? (
                                  <div className="aspect-video w-full overflow-hidden bg-muted">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                  </div>
                                ) : (
                                  <div className="flex aspect-video w-full items-center justify-center bg-muted">
                                    <ImageIcon className="h-10 w-10 text-orange-600/20" />
                                  </div>
                                )}
                                <div className="flex flex-1 flex-col p-6 text-neutral-900">
                                  <div className="mb-2 flex items-start justify-between gap-2">
                                    <h4 className="text-lg font-bold leading-tight font-display">{item.name}</h4>
                                    <span className="shrink-0 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">${(item.price || 0).toFixed(2)}</span>
                                  </div>
                                  <p className="mb-6 line-clamp-2 flex-1 text-sm font-medium text-neutral-400 leading-normal">{item.description}</p>
                                  <div className="flex gap-3 border-t border-neutral-100 pt-4">
                                    <Button size="sm" variant="secondary" className="w-full gap-2 rounded-xl font-bold bg-white hover:bg-white/80 border border-neutral-100" onClick={() => openEditItem(item)}>
                                      <Edit className="h-4 w-4" /> Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" className="w-full gap-2 rounded-xl font-bold bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors" onClick={() => handleDeleteItem(item.id)}>
                                      <Trash2 className="h-4 w-4" /> Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TimelineAnimation>
                    </div>
                  ) : activeTab === "overview" ? (
                    <>
                      {/* Summary Banner */}
                      <div className="bg-orange-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="relative z-10 text-neutral-900">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <h3 className="text-2xl font-bold flex items-center gap-2 text-white font-display">
                                Good Morning, {shopName || "Al Razi"} ✨
                              </h3>
                              <p className="text-orange-100 text-xs mt-1">Get a clear snapshot of your financial performance and recent transactions</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors text-white">
                                This Month <Settings className="h-3 w-3" />
                              </button>
                              <button className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-orange-50 transition-colors">
                                <Upload className="h-3 w-3 rotate-180" /> Export
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-white">
                            {[
                              { label: 'Total Balance', val: '$10,340', desc: 'Net worth across all.', icon: CreditCard, color: 'bg-orange-500' },
                              { label: 'Monthly Income', val: '$5,200', desc: 'Total Income this month.', icon: BarChart3, color: 'bg-emerald-500' },
                              { label: 'Monthly Expenses', val: '$1,475', desc: 'Total Expenses.', icon: CreditCard, color: 'bg-rose-500' },
                              { label: 'Savings', val: '$620', desc: 'Total month savings', icon: Settings, color: 'bg-blue-500' },
                            ].map((card) => (
                              <div key={card.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 shadow-sm">
                                <div className="flex items-center gap-3 mb-1">
                                  <div className={`p-2 rounded-lg ${card.color}`}>
                                    <card.icon className="h-4 w-4" />
                                  </div>
                                  <div className="text-xl font-bold">{card.val}</div>
                                </div>
                                <div className="text-[10px] text-orange-100 font-medium">{card.desc}</div>
                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[10px]">
                                  <span className="opacity-70">{card.label}</span>
                                  <button className="opacity-70 hover:opacity-100">• • •</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Charts Grid */}
                      <div className="grid grid-cols-3 gap-8">
                        {/* Transaction Overview */}
                        <div className="col-span-2 bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm">
                          <div className="flex items-center justify-between mb-8">
                            <h4 className="font-bold text-neutral-900 font-display">Transactions Overview</h4>
                            <button className="text-xs font-bold text-neutral-400 bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-neutral-100">
                              This Year <Settings className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl font-black text-neutral-900">$8,435</span>
                            <span className="text-neutral-400 font-bold">.00</span>
                            <div className="flex gap-4 ml-auto">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div> Total Sales
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                                    <div className="w-2 h-2 rounded-full bg-neutral-200"></div> Earning
                                </div>
                            </div>
                          </div>
                          
                          <div className="h-48 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                                <Bar dataKey="val" radius={[4, 4, 4, 4]} barSize={34}>
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#f1f5f9'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Sales Overview */}
                        <div className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm">
                           <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-neutral-50 rounded-lg">
                                 <LayoutDashboard className="h-4 w-4 text-neutral-900" />
                              </div>
                              <h4 className="font-bold text-neutral-900 font-display">Sales Overview</h4>
                           </div>
                           <div className="text-neutral-400 text-xs font-bold mb-1">Total Sales</div>
                           <div className="flex items-center gap-3 mb-8">
                              <span className="text-3xl font-black text-neutral-900">8379</span>
                              <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-0.5">
                                 <Plus className="h-2 w-2 rotate-45" /> 4.9%
                              </span>
                           </div>

                           <div className="space-y-4">
                              {[
                                { label: 'Books', pct: 81, color: 'bg-orange-300' },
                                { label: 'T-shirt', pct: 73, color: 'bg-orange-400' },
                                { label: 'Shoes', pct: 54, color: 'bg-orange-500' },
                                { label: 'iPhone', pct: 32, color: 'bg-orange-600' },
                                { label: 'Macbook', pct: 20, color: 'bg-orange-700' },
                              ].map(item => (
                                <div key={item.label}>
                                   <div className="flex justify-between text-[10px] font-bold mb-1.5">
                                      <span className="text-neutral-500">{item.label}</span>
                                      <span className="text-neutral-400">{item.pct}%</span>
                                   </div>
                                   <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>

                      {/* Recent Orders */}
                      <div className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm">
                         <div className="flex items-center justify-between mb-8">
                            <h4 className="font-bold text-neutral-900 font-display">Recent orders</h4>
                            <div className="flex gap-4">
                               <button className="text-xs font-bold text-neutral-500 bg-neutral-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-neutral-100">
                                  Sort by <Settings className="h-3 w-3" />
                               </button>
                            </div>
                         </div>
                         <table className="w-full text-left text-xs">
                            <thead className="text-neutral-400 font-bold border-b border-neutral-50">
                               <tr>
                                  <th className="pb-4 pt-2">Product info</th>
                                  <th className="pb-4 pt-2">Order Id</th>
                                  <th className="pb-4 pt-2">Date</th>
                                  <th className="pb-4 pt-2">Customer</th>
                                  <th className="pb-4 pt-2">Status</th>
                                  <th className="pb-4 pt-2">Price</th>
                               </tr>
                            </thead>
                            <tbody>
                               {[1,2,3].map(i => (
                                 <tr key={i} className="border-b border-neutral-50 last:border-none">
                                    <td className="py-4 font-bold flex items-center gap-3 text-neutral-900">
                                       <div className="w-8 h-8 rounded-lg bg-neutral-50"></div> Apple iPhone 13
                                    </td>
                                    <td className="py-4 text-neutral-500 font-medium">#TRD-4921</td>
                                    <td className="py-4 text-neutral-500 font-medium">Oct 24, 2023</td>
                                    <td className="py-4 text-neutral-500 font-medium">Jenny Wilson</td>
                                    <td className="py-4">
                                       <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold">Shipped</span>
                                    </td>
                                    <td className="py-4 font-black text-neutral-900">$999.00</td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-[32px] h-[500px] flex items-center justify-center border border-neutral-100 shadow-sm">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-orange-100 mx-auto mb-4" />
                        <h3 className="font-bold text-xl text-neutral-900 font-display">The {activeTab} Section</h3>
                        <p className="text-neutral-400 text-sm mt-1">This section is currently under development.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </HeroAiEcommerce>
      {/* Item Form Dialog */}
      <AnimatePresence>
        {showItemDialog && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/40 bg-white/80 p-1 shadow-2xl backdrop-blur-xl"
            >
              <div className="bg-white/40 rounded-[31px]">
                  <div className="flex items-center justify-between border-b border-white/20 px-8 py-6">
                    <h3 className="text-2xl font-bold text-neutral-900 font-display">{editingItem ? "Edit Item" : "Add New Item"}</h3>
                    <button onClick={() => setShowItemDialog(false)} className="rounded-full bg-white/60 p-2.5 hover:bg-white text-neutral-400 transition-all shadow-sm">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Item Name</label>
                          <input className="w-full flex-1 rounded-xl border border-neutral-100 bg-white px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all shadow-sm text-neutral-900" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Avocado Toast" />
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Price ($)</label>
                          <input type="number" step="0.01" className="w-full flex-1 rounded-xl border border-neutral-100 bg-white px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all shadow-sm text-neutral-900" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="0.00" />
                        </div>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description</label>
                      <textarea className="w-full rounded-xl border border-neutral-100 bg-white px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all shadow-sm text-neutral-900" rows={3} value={itemDescription} onChange={e => setItemDescription(e.target.value)} placeholder="Brief description of the item..." />
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Photo</label>
                      <div className="flex justify-center sm:justify-start">
                        <ImageUpload image={itemImage} onChange={setItemImage} />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                      <Button variant="outline" className="w-full py-7 rounded-2xl font-bold bg-white border-neutral-100 text-neutral-600" onClick={() => setShowItemDialog(false)}>Cancel</Button>
                      <Button className="w-full py-7 rounded-2xl font-bold bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-100 transition-all" onClick={handleSaveItem}>
                        {editingItem ? "Save Changes" : "Add Item"}
                      </Button>
                    </div>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MerchantDashboard;
