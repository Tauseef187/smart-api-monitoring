import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "smart-monitor-token";
const USER_KEY = "smart-monitor-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.me();
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrate();
  }, [token]);

  const saveSession = (payload) => {
    const nextUser = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
    };

    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(payload.token);
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      async login(values) {
        const payload = await authService.login(values);
        saveSession(payload);
        toast.success("Welcome back");
        return payload;
      },
      async register(values) {
        const payload = await authService.register(values);
        saveSession(payload);
        toast.success("Account created");
        return payload;
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setToken(null);
        toast.success("Logged out");
      },
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

