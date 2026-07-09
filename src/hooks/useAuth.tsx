"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api/http-client";
import type { User, Wedding } from "@/types";
import type { WeddingOption } from "@/types/user";
import {
  api,
  apiLogin,
  apiRegister,
  apiCreateWedding,
  apiRefreshTokens,
  apiLogout,
  apiGetAvailableWeddings,
  apiSwitchWedding,
  isAuthenticated as checkAuth,
  clearTokens,
} from "@/services";

interface AuthContextValue {
  user: User | null;
  wedding: Wedding | null;
  availableWeddings: WeddingOption[];
  activeRole: 'owner' | 'collaborator' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; isExpired: boolean }>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createWedding: (data: {
    partner1Name: string;
    partner2Name: string;
    date: string;
    venue: string;
    location?: string;
    estimatedGuests: number;
    estimatedBudget: number;
    plan?: 'trial' | 'annual';
  }) => Promise<void>;
  switchWedding: (weddingId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [availableWeddings, setAvailableWeddings] = useState<WeddingOption[]>([]);
  const [activeRole, setActiveRole] = useState<'owner' | 'collaborator' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  const loadUserData = useCallback(async () => {
    if (!useRealApi) {
      try {
        const [mockUser, mockWedding] = await Promise.all([api.getUser(), api.getWedding()]);
        setUser(mockUser);
        setWedding(mockWedding);
      } catch { /* ignore */ }
      setIsLoading(false);
      return;
    }

    if (!checkAuth()) {
      setUser(null);
      setWedding(null);
      setIsLoading(false);
      return;
    }

    try {
      const [userData, weddingData, weddingsData] = await Promise.all([
        api.getUser(),
        api.getWedding().catch(() => null),
        apiGetAvailableWeddings().catch(() => [] as WeddingOption[]),
      ]);
      setUser(userData);
      setWedding(weddingData);
      setAvailableWeddings(weddingsData);
      const active = weddingsData.find((w: WeddingOption) => w.weddingId === weddingData?.id);
      setActiveRole(active?.role ?? null);
    } catch {
      clearTokens();
      setUser(null);
      setWedding(null);
    } finally {
      setIsLoading(false);
    }
  }, [useRealApi]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const login = useCallback(async (email: string, password: string): Promise<{ user: User; isExpired: boolean }> => {
    const { user: userData, weddings } = await apiLogin(email, password);
    setUser(userData);
    setAvailableWeddings(weddings);
    let isExpired = false;
    if (userData?.role !== 'admin') {
      try {
        const weddingData = await api.getWedding();
        setWedding(weddingData);
        const active = weddings.find(w => w.weddingId === weddingData?.id);
        setActiveRole(active?.role ?? null);
        
        const sub = await apiFetch("/subscription") as { status: string };
        if (sub && sub.status === "expired") {
          isExpired = true;
        }
      } catch { /* no wedding yet */ }
    }
    return { user: userData, isExpired };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const userData = await apiRegister(email, password, name);
    setUser(userData);
  }, []);

  const createWeddingFn = useCallback(async (data: {
    partner1Name: string; partner2Name: string; date: string;
    venue: string; location?: string; estimatedGuests: number; estimatedBudget: number;
    plan?: 'trial' | 'annual';
  }) => {
    const weddingData = await apiCreateWedding(data);
    setWedding(weddingData as Wedding);
    await apiRefreshTokens();
    // Refresh available weddings after creating a new one
    const weddingsData = await apiGetAvailableWeddings().catch(() => [] as WeddingOption[]);
    setAvailableWeddings(weddingsData);
    const active = weddingsData.find(w => w.weddingId === (weddingData as Wedding).id);
    setActiveRole(active?.role ?? 'owner');
  }, []);

  const switchWeddingFn = useCallback(async (targetWeddingId: string) => {
    await apiSwitchWedding(targetWeddingId);
    try {
      const sub = await apiFetch("/subscription") as { status: string };
      if (typeof window !== "undefined") {
        if (sub && sub.status === "expired") {
          window.location.href = "/app/account?expired=true";
        } else {
          window.location.href = "/app/dashboard";
        }
      }
    } catch {
      if (typeof window !== "undefined") {
        window.location.href = "/app/dashboard";
      }
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setWedding(null);
    setAvailableWeddings([]);
    setActiveRole(null);
    router.push("/");
  }, [router]);

  const refreshUserData = useCallback(async () => {
    await loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider value={{
      user, wedding, availableWeddings, activeRole,
      isLoading, isAuthenticated: useRealApi ? checkAuth() : true,
      login, register, createWedding: createWeddingFn,
      switchWedding: switchWeddingFn, logout, refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
