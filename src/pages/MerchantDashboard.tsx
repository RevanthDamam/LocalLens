import React, { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMerchantShop } from "@/hooks/useMerchantShop";
import { CATEGORIES } from "@/data/mockData";
import { MapPinPicker } from "@/components/MapPinPicker";
import {
  LayoutDashboard, Store, BarChart3, HelpCircle, LogOut,
  Save, Plus, Trash2, Edit, Phone, MessageSquare, Star, X, User,
  MapPin, Upload, Image as ImageIcon, Bell, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
    <div className="relative flex aspect-[4/3] w-full max-w-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 transition-colors hover:border-primary hover:bg-primary/10">
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
      <div className="flex min-h-screen items-center justify-center bg-background">
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
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
        <div className="flex items-center gap-2 font-display text-xl font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          LocalLens Dashboard
        </div>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </button>
          <div className="ml-2 flex items-center gap-3 border-l pl-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-bold leading-none">{shop?.name || "Merchant"}</div>
              <div className="mt-1 text-xs font-medium text-success">Verified Merchant</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
              {shop?.image ? (
                <img src={shop.image} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="sticky top-24 space-y-1 self-start">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === "overview") syncForm(); }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            
            <div className="pt-6 pb-2">
              <div className="px-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Support</div>
            </div>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <HelpCircle className="h-4 w-4" /> Help Center
            </button>
            <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="pb-20">
            {shopLoading ? (
              <div className="flex h-[400px] items-center justify-center rounded-2xl border bg-card">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <div className="text-sm text-muted-foreground">Loading shop details...</div>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {activeTab === "overview" && (
                    <>
                      {/* Stats Row */}
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                          <div className="mb-2 text-sm font-medium text-muted-foreground">Total Shop Views</div>
                          <div className="flex items-baseline gap-3">
                            <h3 className="font-display text-3xl font-bold">12,482</h3>
                            <span className="text-sm font-medium text-success">~12%</span>
                          </div>
                          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-2/3 rounded-full bg-primary/70"></div>
                          </div>
                        </div>
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                          <div className="mb-2 text-sm font-medium text-muted-foreground">Review Rating</div>
                          <div className="flex items-baseline gap-3">
                            <h3 className="font-display text-3xl font-bold">4.8</h3>
                            <div className="flex text-primary">
                              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground">Based on 156 customer reviews</div>
                        </div>
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                          <div className="mb-2 text-sm font-medium text-muted-foreground">Interactions</div>
                          <div className="flex items-baseline gap-3">
                            <h3 className="font-display text-3xl font-bold">842</h3>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">⚡ New</span>
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground">Bookings & direction requests</div>
                        </div>
                      </div>

                      {/* Edit Shop Details block */}
                      <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div>
                            <h2 className="font-display text-2xl font-bold">Edit Shop Details</h2>
                            <p className="text-sm text-muted-foreground">Update your public profile and storefront information</p>
                          </div>
                          <Button onClick={handleSaveShop} className="rounded-full px-6 shadow-sm hover:scale-105 transition-transform duration-200">
                            Save Changes
                          </Button>
                        </div>
                        
                        <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
                          {/* Left Column */}
                          <div className="space-y-6">
                            <div>
                              <label className="mb-2 block text-sm font-bold text-foreground/80">Shop Name</label>
                              <input 
                                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
                                value={shopName} onChange={e => setShopName(e.target.value)} 
                                placeholder="The Local Bistro"
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-bold text-foreground/80">Category</label>
                              <select 
                                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                value={shopCategory} onChange={e => setShopCategory(e.target.value)}
                              >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-bold text-foreground/80">Shop Description</label>
                              <textarea 
                                rows={4}
                                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                value={shopDescription} onChange={e => setShopDescription(e.target.value)}
                                placeholder="A modern take on classic bistro dishes..."
                              />
                            </div>
                          </div>
                          {/* Right Column */}
                          <div>
                            <label className="mb-2 block text-sm font-bold text-foreground/80">Storefront Photo</label>
                            <ImageUpload image={shopImage} onChange={setShopImage} />
                          </div>
                        </div>

                        <div className="mt-8 border-t pt-6">
                          <label className="mb-2 block text-sm font-bold text-foreground/80">Location</label>
                          <div className="mb-4">
                            <input 
                              placeholder="123 Gastronomy St, Foodville"
                              className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                              value={shopAddress} onChange={e => setShopAddress(e.target.value)}
                            />
                          </div>
                          <p className="mb-3 text-xs font-medium text-muted-foreground">Drop a pin on the map to set your exact location for the map view.</p>
                          <MapPinPicker 
                             position={shopLatitude && shopLongitude ? [parseFloat(shopLatitude), parseFloat(shopLongitude)] : null} 
                             onChange={([lat, lng]) => { setShopLatitude(lat.toString()); setShopLongitude(lng.toString()); }} 
                          />
                        </div>
                      </div>

                      {/* Items Management */}
                      <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div>
                            <h2 className="font-display text-2xl font-bold">Manage Menu & Items</h2>
                            <p className="text-sm text-muted-foreground">Add products, edit details, and set prices.</p>
                          </div>
                          <Button onClick={openAddItem} variant="outline" className="rounded-full gap-2 border-primary/40 text-primary hover:bg-primary/10 shadow-sm transition-colors">
                            <Plus className="h-4 w-4" /> Add New Item
                          </Button>
                        </div>
                        
                        {(!items || items.length === 0) ? (
                          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted bg-background/50 py-16 text-center text-muted-foreground">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                              <ImageIcon className="h-7 w-7 opacity-40" />
                            </div>
                            <p className="text-base font-semibold text-foreground/70">No items added yet</p>
                            <p className="mt-1 text-sm">Click the button above to add your first product.</p>
                          </div>
                        ) : (
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item: any) => (
                              <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-background shadow-xs transition-shadow hover:shadow-md">
                                {item.image ? (
                                  <div className="h-40 w-full overflow-hidden bg-muted">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                  </div>
                                ) : (
                                  <div className="flex h-40 w-full items-center justify-center bg-muted/30">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                  </div>
                                )}
                                <div className="flex flex-1 flex-col p-5">
                                  <div className="mb-1 flex items-start justify-between gap-2">
                                    <h4 className="font-display text-lg font-bold leading-tight">{item.name}</h4>
                                    <span className="shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-sm font-bold text-primary">${(item.price || 0).toFixed(2)}</span>
                                  </div>
                                  <p className="mb-5 line-clamp-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
                                  <div className="mt-auto flex gap-3 border-t pt-4">
                                    <Button size="sm" variant="secondary" className="w-full gap-1.5 rounded-xl font-semibold" onClick={() => openEditItem(item)}>
                                      <Edit className="h-3.5 w-3.5" /> Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" className="w-full gap-1.5 rounded-xl font-semibold bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDeleteItem(item.id)}>
                                      <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Reviews */}
                        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
                          <h2 className="font-display text-xl font-bold">Recent Reviews</h2>
                          <p className="mb-6 text-sm text-muted-foreground">Respond to customer feedback</p>
                          
                          <div className="flex-1 space-y-5">
                            {/* Dummy review 1 */}
                            <div className="flex gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fdeedc] font-bold text-primary">SC</div>
                              <div className="w-full">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm">Sarah Chen</span>
                                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                                </div>
                                <div className="mt-0.5 flex text-[#eab308]"><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /></div>
                                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">The steak frites were absolutely incredible! Best service I've had in months. Will definitely be coming back for more.</p>
                                <div className="mt-3 flex gap-4">
                                  <button className="rounded-full border px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white">Reply</button>
                                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground">Report</button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Dummy review 2 */}
                            <div className="flex gap-4 pt-5 border-t">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fdeedc] font-bold text-primary">MR</div>
                              <div className="w-full">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm">Marcus Rodriguez</span>
                                  <span className="text-xs text-muted-foreground">1 day ago</span>
                                </div>
                                <div className="mt-0.5 flex text-[#eab308]"><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /><Star strokeWidth={0} fill="currentColor" className="h-3.5 w-3.5" /></div>
                                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">Great atmosphere, although the music was a bit loud for lunch time conversations.</p>
                                {/* Reply block */}
                                <div className="mt-3 rounded-xl bg-[#fdfaf6] p-4 border border-[#fdeedc]">
                                  <span className="block text-[11px] uppercase font-bold text-primary mb-1">Your reply:</span>
                                  <p className="text-sm text-muted-foreground italic">"Thanks for the feedback Marcus! We'll adjust the volume during lunch hours."</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full mt-6 rounded-xl font-bold text-primary hover:bg-primary/5 hover:text-primary border-primary/20">
                            View All Reviews
                          </Button>
                        </div>

                        {/* Performance */}
                        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
                          <h2 className="font-display text-xl font-bold">Performance</h2>
                          <p className="mb-6 text-sm text-muted-foreground">Shop visibility over the last 7 days</p>
                          
                          <div className="h-[240px] w-full mt-auto mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888', fontWeight: 600}} dy={15} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px'}} />
                                <Bar dataKey="val" radius={[6, 6, 6, 6]} barSize={24}>
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 5 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.2)'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-auto space-y-5 pt-6 border-t">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                   <MapPin className="h-5 w-5 text-primary" />
                                 </div>
                                 <div>
                                   <div className="font-bold text-sm">Direction Requests</div>
                                   <div className="text-xs text-muted-foreground mt-0.5">People navigating to you</div>
                                 </div>
                               </div>
                               <span className="font-display text-2xl font-bold">142</span>
                             </div>
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                   <Phone className="h-5 w-5 text-primary" />
                                 </div>
                                 <div>
                                   <div className="font-bold text-sm">Call Taps</div>
                                   <div className="text-xs text-muted-foreground mt-0.5">Direct phone inquiries</div>
                                 </div>
                               </div>
                               <span className="font-display text-2xl font-bold">68</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeTab !== "overview" && (
                    <div className="flex h-[400px] items-center justify-center rounded-2xl border bg-card shadow-sm">
                      <div className="text-center text-muted-foreground">
                        <p className="font-display text-2xl font-bold text-foreground">Coming Soon</p>
                        <p className="mt-2">This dedicated section is being polished.</p>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>

      {/* Item Form Dialog */}
      <AnimatePresence>
        {showItemDialog && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-[24px] bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-6 py-5">
                <h3 className="font-display text-xl font-bold">{editingItem ? "Edit Item" : "Add New Item"}</h3>
                <button onClick={() => setShowItemDialog(false)} className="rounded-full bg-muted/50 p-2 hover:bg-muted text-foreground/70 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-foreground/80">Item Name</label>
                  <input className="w-full flex-1 rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Avocado Toast" />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-bold text-foreground/80">Price ($)</label>
                  <input type="number" step="0.01" className="w-full flex-1 rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="0.00" />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-bold text-foreground/80">Description</label>
                  <textarea className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" rows={2} value={itemDescription} onChange={e => setItemDescription(e.target.value)} placeholder="Brief description of the item..." />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-bold text-foreground/80">Item Image</label>
                  <ImageUpload image={itemImage} onChange={setItemImage} />
                </div>
                
                <div className="pt-4 flex gap-3 border-t">
                  <Button variant="outline" className="w-full rounded-xl font-bold" onClick={() => setShowItemDialog(false)}>Cancel</Button>
                  <Button className="w-full rounded-xl font-bold" onClick={handleSaveItem}>
                    {editingItem ? "Save Changes" : "Add Item"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MerchantDashboard;
