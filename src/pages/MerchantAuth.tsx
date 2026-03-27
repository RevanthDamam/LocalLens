import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/merchant");
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } }
        });
        if (error) throw error;
        if (signUpData.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: signUpData.user.id,
            display_name: displayName || signUpData.user.email?.split("@")[0] || null,
          });
          if (profileError && profileError.code !== "23505") console.warn("Profile creation error:", profileError.message);
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
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-60">
        <motion.div 
          className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-orange-200/50 blur-[100px]"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-orange-300/30 blur-[100px]"
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 container mx-auto flex items-center py-12 px-6 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
              {/* Left Side: Context */}
              <div className="hidden lg:flex flex-col space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login-text" : "signup-text"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-[32px] bg-orange-600 shadow-xl shadow-orange-500/20 mb-8">
                       <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-6xl font-black font-display text-neutral-900 tracking-tight leading-[1.1] uppercase mb-6">
                      {isLogin ? "Welcome\nBack" : "Welcome to\nLocably"}
                    </h1>
                    <p className="text-xl text-neutral-500 font-medium max-w-md leading-relaxed">
                      {isLogin 
                        ? "The neighborhood is waiting. Sign in to your dashboard to manage your shop's presence and track growth." 
                        : "Join the network of premium independent shops. We help you reach local customers who value quality and craft."}
                    </p>
                    
                    <div className="pt-10 flex items-center gap-6">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-neutral-100 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Merchant" className="h-full w-full object-cover grayscale opacity-80" />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm font-bold text-neutral-400">
                        Joined by <span className="text-orange-600">500+</span> local artisans
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side: Auth Form */}
              <div className="flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md bg-white/70 backdrop-blur-3xl rounded-[40px] border border-white/60 shadow-2xl p-10 relative overflow-hidden"
                >
                  {/* Mobile Back Link & Header */}
                  <div className="lg:hidden text-center mb-8">
                     <h1 className="text-3xl font-black uppercase text-neutral-900 mb-2">
                        {isLogin ? "Sign In" : "Register"}
                     </h1>
                     <p className="text-sm text-neutral-500">Locably Merchant Network</p>
                  </div>

                  {/* Back Link (Large Screen) */}
                  <button
                    onClick={() => navigate("/")}
                    className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-600 transition-all mb-8 group"
                  >
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back home
                  </button>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                      <div>
                        <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 block px-1">Merchant Name</label>
                        <div className="relative group">
                           <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300 group-focus-within:text-orange-500 transition-colors" />
                           <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-white/60 border-2 border-transparent rounded-xl py-4 pl-14 pr-5 text-sm font-bold text-neutral-900 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-600/5 transition-all shadow-sm"
                            placeholder="Store Name"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 block px-1">Email</label>
                      <div className="relative group">
                         <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300 group-focus-within:text-orange-500 transition-colors" />
                         <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/60 border-2 border-transparent rounded-xl py-4 pl-14 pr-5 text-sm font-bold text-neutral-900 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-600/5 transition-all shadow-sm"
                          placeholder="you@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 block px-1">Password</label>
                      <div className="relative group">
                         <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300 group-focus-within:text-orange-500 transition-colors" />
                         <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/60 border-2 border-transparent rounded-xl py-4 pl-14 pr-5 text-sm font-bold text-neutral-900 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-600/5 transition-all shadow-sm"
                          placeholder="Min. 6 chars"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-8 rounded-2xl shadow-xl shadow-orange-600/20 text-lg uppercase transition-all mt-4" disabled={loading}>
                      {loading ? "Verifying..." : isLogin ? "Launch Dashboard" : "Create Account"}
                    </Button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-[11px] font-bold text-neutral-400">
                      {isLogin ? "New merchant?" : "Already part of us?"}{" "}
                      <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 hover:text-orange-700 transition-colors border-b border-orange-100 font-display">
                        {isLogin ? "Apply for Access" : "Sign In Portal"}
                      </button>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
          <Footer />
      </div>
    </div>
  );
};

export default MerchantAuth;
