import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { shopApi } from "../services/shopApi";

const AuthContext = createContext(null);

function getUser(payload) {
  return payload?.user ?? payload?.data?.user ?? payload?.data ?? null;
}
function getToken(payload) {
  return payload?.token ?? payload?.accessToken ?? payload?.data?.token ?? payload?.data?.accessToken ?? null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shop_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const syncUser = useCallback(async () => {
    if (!localStorage.getItem("shop_token") && import.meta.env.VITE_USE_COOKIES !== "true") return;
    try {
      const result = await shopApi.me();
      const current = getUser(result);
      if (current) {
        setUser(current);
        localStorage.setItem("shop_user", JSON.stringify(current));
      }
    } catch {
      if (import.meta.env.VITE_USE_COOKIES !== "true") {
        localStorage.removeItem("shop_token");
        localStorage.removeItem("shop_user");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => { syncUser(); }, [syncUser]);

  const authenticate = useCallback(async (mode, form) => {
    setLoading(true);
    try {
      const result = mode === "login" ? await shopApi.login(form) : await shopApi.register(form);
      const token = getToken(result);
      const current = getUser(result);
      if (token && import.meta.env.VITE_USE_COOKIES !== "true") localStorage.setItem("shop_token", token);
      if (current) {
        setUser(current);
        localStorage.setItem("shop_user", JSON.stringify(current));
      } else {
        await syncUser();
      }
      return result;
    } finally { setLoading(false); }
  }, [syncUser]);

  const logout = useCallback(async () => {
    try { await shopApi.logout(); } catch { /* Local session is still cleared. */ }
    localStorage.removeItem("shop_token");
    localStorage.removeItem("shop_user");
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, authenticate, logout, syncUser }), [user, loading, authenticate, logout, syncUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
