import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { User, Mail, Shield, ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MerchantProfile = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [updating, setUpdating] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setProfileLoading(false);
            return;
        }
        setDisplayName(user.user_metadata?.display_name || "");
        let cancelled = false;
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle().then(({ data }) => {
            if (!cancelled && data?.display_name) setDisplayName(data.display_name);
            setProfileLoading(false);
        });
        return () => { cancelled = true; };
    }, [user]);

    if (!authLoading && !user) {
        navigate("/merchant/auth");
        return null;
    }

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/merchant")}
                                className="rounded-full"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="font-display text-3xl font-bold">Merchant Profile</h1>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{displayName || user?.email}</h2>
                                    <p className="text-sm text-muted-foreground">Merchant Account</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="email"
                                            className="w-full cursor-not-allowed rounded-lg border bg-muted/50 pl-10 pr-3 py-2 text-sm text-muted-foreground"
                                            value={user?.email || ""}
                                            disabled
                                        />
                                    </div>
                                    <p className="mt-1 text-[10px] text-muted-foreground">Email cannot be changed.</p>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium">Account Security</label>
                                    <div className="flex items-center gap-2 rounded-lg border p-3">
                                        <Shield className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium">Password Protected</p>
                                            <p className="text-xs text-muted-foreground">Your account is secured with a password.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="ml-auto" onClick={() => toast.info("Password reset feature coming soon!")}>
                                            Change
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button onClick={handleUpdateProfile} disabled={updating} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {updating ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                            <h3 className="mb-2 text-sm font-semibold text-destructive">Danger Zone</h3>
                            <p className="mb-4 text-xs text-muted-foreground">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="destructive" size="sm" onClick={() => toast.error("Delete account feature is disabled for safety.")}>
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default MerchantProfile;
