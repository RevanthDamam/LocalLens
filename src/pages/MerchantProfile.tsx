import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Shield, ArrowLeft, Save, 
  LayoutDashboard, Store, Star, BarChart3, MapPin,
  HelpCircle, Settings, Bell, LogOut, X, Camera 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HeroAiEcommerce } from "@/components/hero-ai-ecommerce";
import { TimelineAnimation } from "@/components/timeline-animation";

/**
 * MerchantProfile Page
 * Redesigned to match the glassmorphism aesthetic of the Merchant Dashboard
 */
const MerchantProfile = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, signOut } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [updating, setUpdating] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setHasEntered(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!user) return;
        setDisplayName(user.user_metadata?.display_name || "");
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle().then(({ data }) => {
            if (data?.display_name) setDisplayName(data.display_name);
        });
    }, [user]);

    if (!authLoading && !user) {
        navigate("/merchant/auth");
        return null;
    }

    const handleUpdateProfile = async () => {
        setUpdating(true);
        try {
            if (!user) throw new Error("Not logged in");
            const { error } = await supabase
                .from("profiles")
                .update({ display_name: displayName, updated_at: new Date().toISOString() })
                .eq("user_id", user.id);
            if (error) throw error;
            await supabase.auth.updateUser({ data: { display_name: displayName } });
            toast.success("Profile updated successfully");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white/30 backdrop-blur-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section ref={profileRef} className="min-h-screen">
            <HeroAiEcommerce showHero={false} showNav={false}>
                <div className="flex min-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-neutral-100">
                    {/* Sidebar - Matching MerchantDashboard */}
                    <aside className="w-64 border-r border-neutral-100 bg-white p-6 flex flex-col z-20">
                        <div className="flex items-center gap-3 px-2 mb-10">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-orange-500/30">
                                <svg viewBox="0 0 24 24" fill="none" className="stroke-white w-full h-full" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight text-neutral-900">Locably</span>
                        </div>

                        <nav className="flex-1 space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">Management</div>
                            {[
                                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/merchant' },
                                { id: 'shop', label: 'Shop Profile', icon: Store, path: '/merchant' },
                                { id: 'reviews', label: 'Reviews', icon: Star, path: '/merchant' },
                                { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/merchant' },
                                { id: 'explore_redirect', label: 'Explore Shops', icon: MapPin, path: '/explore' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                </button>
                            ))}
                            
                            <div className="pt-8">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">Account</div>
                                <button
                                    onClick={() => navigate('/merchant/profile')}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-orange-50 text-orange-600 shadow-sm"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="flex-1 text-left">My Profile</span>
                                </button>
                            </div>
                        </nav>

                        <div className="pt-6 border-t border-neutral-100">
                             <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all">
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col bg-white/5 relative z-10">
                        {/* Header */}
                        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-neutral-50">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => navigate('/merchant')} className="rounded-full text-neutral-400">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <h2 className="font-bold text-lg text-neutral-900 font-display">Merchant Settings</h2>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 border-l pl-6 border-neutral-100">
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-neutral-900">{displayName || user?.email?.split('@')[0]}</div>
                                        <div className="text-[10px] text-neutral-400">Owner Access</div>
                                    </div>
                                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                                        {displayName?.substring(0, 1) || user?.email?.substring(0, 1).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                             <div className="max-w-4xl mx-auto space-y-8">
                                <TimelineAnimation animationNum={1} timelineRef={hasEntered ? { current: document.body } : profileRef} className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm">
                                    <div className="mb-12 flex items-center gap-8">
                                        <div className="relative group">
                                            <div className="h-28 w-28 rounded-[36px] bg-orange-50 flex items-center justify-center text-orange-600 border-2 border-orange-100 shadow-inner group-hover:bg-orange-100 transition-colors duration-500">
                                                <User className="h-12 w-12" />
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-3 shadow-xl border border-neutral-100 text-neutral-400 hover:text-orange-600 transition-all hover:scale-110 active:scale-95">
                                                <Camera className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div>
                                            <div className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest mb-3">Merchant Profile</div>
                                            <h2 className="text-4xl font-black font-display text-neutral-900 tracking-tight">Public Profile</h2>
                                            <p className="text-sm text-neutral-400 font-medium mt-1">This information will be visible across the platform.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <div>
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 block">Display Name</label>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-neutral-100 rounded-xl group-focus-within:bg-orange-100 transition-colors">
                                                       <User className="h-4 w-4 text-neutral-400 group-focus-within:text-orange-600 transition-colors" />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-neutral-50 border-2 border-transparent rounded-2xl py-4 pl-16 pr-4 text-sm font-bold text-neutral-900 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-neutral-300"
                                                        placeholder="Your public name..."
                                                        value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 block">Email Address</label>
                                                <div className="relative group opacity-80">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-neutral-100 rounded-xl">
                                                       <Mail className="h-4 w-4 text-neutral-400" />
                                                    </div>
                                                    <input 
                                                        type="email" 
                                                        className="w-full bg-neutral-50 border-none rounded-2xl py-4 pl-16 pr-4 text-sm font-bold text-neutral-400 cursor-not-allowed"
                                                        value={user?.email || ""}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 px-2">
                                                   <Shield className="h-3 w-3 text-emerald-500" />
                                                   <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Verified Identity</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-[32px] p-8 border border-orange-100 shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                                                    <Shield className="h-32 w-32" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-orange-100">
                                                            <Shield className="h-7 w-7 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold font-display text-neutral-900">Security Suite</h4>
                                                            <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.15em]">Enabled</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-6">Your merchant account is protected by industry-standard encryption and security protocols.</p>
                                                    <Button variant="secondary" className="w-full rounded-2xl font-bold py-6 bg-white hover:bg-white/80 text-neutral-900 border border-orange-100 shadow-sm transition-all" onClick={() => toast.info("Password reset coming soon!")}>
                                                        Change Access Password
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-16 flex items-center justify-between border-t border-neutral-50 pt-10">
                                        <p className="text-xs text-neutral-400 font-medium italic">Last updated: {new Date().toLocaleDateString()}</p>
                                        <div className="flex gap-4">
                                            <Button variant="ghost" onClick={() => navigate('/merchant')} className="px-10 py-6 rounded-2xl font-bold text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-all">Cancel</Button>
                                            <Button onClick={handleUpdateProfile} disabled={updating} className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-12 py-7 font-black shadow-2xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-wide">
                                                <Save className="h-4 w-4 mr-3" />
                                                {updating ? "Saving Changes..." : "Secure Save"}
                                            </Button>
                                        </div>
                                    </div>
                                </TimelineAnimation>

                                <TimelineAnimation animationNum={2} timelineRef={hasEntered ? { current: document.body } : profileRef} className="rounded-[32px] bg-rose-50/30 border-2 border-dashed border-rose-100 p-10 group hover:bg-rose-50/50 transition-all duration-500">
                                    <div className="flex items-center justify-between gap-12">
                                        <div className="flex items-center gap-8">
                                            <div className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm group-hover:rotate-6 transition-transform">
                                                <LogOut className="h-8 w-8 text-rose-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-rose-950 font-display text-2xl leading-none">Terminate Account</h4>
                                                <p className="text-sm text-rose-500/70 font-medium mt-2 max-w-sm leading-relaxed">Permanently purge your merchant profile, inventory data, and history from our systems.</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl px-8 py-7 shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={() => toast.error("Account termination disabled for safety.")}>
                                            Delete My Identity
                                        </Button>
                                    </div>
                                </TimelineAnimation>
                             </div>
                        </div>
                    </main>
                </div>
            </HeroAiEcommerce>
        </section>
    );
};

export default MerchantProfile;
