import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const MerchantAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast.success("Welcome back!");
        navigate("/merchant");
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName
            }
          }
        });

        if (error) throw error;

        // Ensure profile row exists in Supabase (in case trigger is not set up)
        if (signUpData.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: signUpData.user.id,
            display_name: displayName || signUpData.user.email?.split("@")[0] || null,
          });
          // Ignore duplicate (e.g. if trigger already created profile)
          if (profileError && profileError.code !== "23505") {
            console.warn("Profile creation:", profileError.message);
          }
        }

        toast.success("Account created! Redirecting...");
        navigate("/merchant");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-elevated"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <MapPin className="h-6 w-6 text-accent-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Merchant Portal</h1>
          <p className="text-sm text-muted-foreground font-body">
            {isLogin ? "Sign in to manage your shop" : "Create your merchant account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium font-body text-foreground">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium font-body text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium font-body text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full font-body" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-body">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary hover:underline">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default MerchantAuth;
