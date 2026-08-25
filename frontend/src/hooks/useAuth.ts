/** Cartographic Editorial: authenticated merchant identity sourced from the LocalLens API. */
import { useCallback, useEffect, useState } from "react";
import { authApi, getAuthToken, type ApiUser } from "@/lib/api";

export type User = ApiUser;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setUser(await authApi.me());
    } catch {
      authApi.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("locallens-auth-change", refresh);
    return () => window.removeEventListener("locallens-auth-change", refresh);
  }, [refresh]);

  return { user, loading, signOut: authApi.signOut, refresh };
}
