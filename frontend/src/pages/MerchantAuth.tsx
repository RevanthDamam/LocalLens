/** Cartographic Editorial: merchant access is a focused, calm entry point to the CornerStore operations desk. */
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, LockKeyhole, Mail, Store, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { BrandMark } from "@/components/BrandMark";

export default function MerchantAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (isLogin) await authApi.login({ email, password });
      else await authApi.register({ email, password, display_name: displayName });
      toast.success(isLogin ? "Welcome back" : "Merchant account created");
      navigate("/merchant");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to continue");
    } finally { setLoading(false); }
  };
  return <main className="relative grid min-h-screen overflow-hidden bg-[#102a31] text-white lg:grid-cols-[0.9fr_1.1fr]"><div className="absolute -left-24 top-24 h-[480px] w-[480px] rounded-full border border-[#72d2c7]/20" /><div className="absolute -left-7 top-40 h-[330px] w-[330px] rounded-full border border-white/10" /><section className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14"><div><Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-white/55 hover:text-[#72d2c7]"><ArrowLeft className="h-3.5 w-3.5" />Back to the field guide</Link><div className="mt-16 max-w-lg"><BrandMark inverse className="h-12 w-12" /><p className="mt-8 atlas-label text-[#72d2c7]">Merchant workspace</p><h1 className="mt-4 font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.86] tracking-[-0.06em]">Keep your place current.</h1><p className="mt-6 max-w-md text-sm leading-7 text-white/65">Publish the details people need before they visit: your listing, exact location, and current offering list.</p></div></div><div className="hidden max-w-md border-t border-white/15 pt-6 text-xs leading-5 text-white/55 lg:block"><Store className="mb-3 h-5 w-5 text-[#72d2c7]" />CornerStore helps independent businesses occupy a clearer place in the neighborhood map.</div></section><section className="contour-surface flex items-center bg-background p-5 sm:p-10 lg:p-14"><div className="mx-auto w-full max-w-md"><div className="border border-border bg-card p-6 shadow-elevated sm:p-9"><p className="atlas-label text-primary">{isLogin ? "Returning merchant" : "New merchant"}</p><h2 className="mt-3 font-display text-4xl tracking-[-0.045em]">{isLogin ? "Open your desk." : "Claim your presence."}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{isLogin ? "Sign in to update the public face of your storefront." : "Start with the account that will own your shop listing."}</p><form onSubmit={submit} className="mt-8 space-y-5">{!isLogin && <label className="block"><span className="atlas-label text-muted-foreground">Merchant name</span><span className="mt-2 flex items-center gap-3 border border-border bg-background px-3 py-3 focus-within:border-primary"><UserRound className="h-4 w-4 text-primary" /><input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your public name" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" /></span></label>}<label className="block"><span className="atlas-label text-muted-foreground">Email</span><span className="mt-2 flex items-center gap-3 border border-border bg-background px-3 py-3 focus-within:border-primary"><Mail className="h-4 w-4 text-primary" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@business.com" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" /></span></label><label className="block"><span className="atlas-label text-muted-foreground">Password</span><span className="mt-2 flex items-center gap-3 border border-border bg-background px-3 py-3 focus-within:border-primary"><LockKeyhole className="h-4 w-4 text-primary" /><input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" /></span></label><button disabled={loading} className="flex w-full items-center justify-between bg-secondary px-4 py-3.5 text-sm font-extrabold text-secondary-foreground transition hover:bg-primary disabled:opacity-60"><span>{loading ? "Working…" : isLogin ? "Open merchant desk" : "Create merchant account"}</span><ArrowUpRight className="h-4 w-4" /></button></form><div className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">{isLogin ? "New to CornerStore?" : "Already have access?"} <button onClick={() => setIsLogin((value) => !value)} type="button" className="font-extrabold text-primary hover:text-foreground">{isLogin ? "Create an account" : "Sign in"}</button></div></div></div></section></main>;
}
