"use client";

/**
 * Contexto global de autenticación.
 *
 * Uso en cualquier componente o hook:
 *   const { user, wedding, login, logout } = useAuth();
 *
 * `wedding` puede ser null si el usuario aún no ha completado el onboarding.
 * Los hooks de módulos deben guardar su carga inicial con `if (!wedding) return`.
 *
 * Para añadir Google OAuth:
 *   1. Añadir `loginWithGoogle(code: string)` que llame a `apiGoogleCallback` de auth-helpers.ts
 *   2. Añadir la función al AuthContextValue interface y al Provider value.
 *   3. Crear `src/app/api/auth/google/callback/route.ts` para manejar el redirect OAuth.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, Wedding } from "@/types";
import {
  api,
  apiLogin,
  apiRegister,
  apiCreateWedding,
  apiLogout,
  isAuthenticated as checkAuth,
  clearTokens,
} from "@/services";

interface AuthContextValue {
  user: User | null;
  wedding: Wedding | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  createWedding: (data: {
    partner1Name: string;
    partner2Name: string;
    date: string;
    venue: string;
    location?: string;
    estimatedGuests: number;
    estimatedBudget: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  const loadUserData = useCallback(async () => {
    if (!useRealApi) {
      // In mock mode, load mock data directly
      try {
        const [mockUser, mockWedding] = await Promise.all([
          api.getUser(),
          api.getWedding(),
        ]);
        setUser(mockUser);
        setWedding(mockWedding);
      } catch {
        // Mock data load failed, ignore
      }
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
      const [userData, weddingData] = await Promise.all([
        api.getUser(),
        api.getWedding().catch(() => null),
      ]);
      setUser(userData);
      setWedding(weddingData);
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

  const login = useCallback(
    async (email: string, password: string) => {
      const userData = await apiLogin(email, password);
      setUser(userData);
      // Load wedding data after login
      try {
        const weddingData = await api.getWedding();
        setWedding(weddingData);
      } catch {
        // User may not have a wedding yet
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const userData = await apiRegister(email, password, name);
      setUser(userData);
    },
    []
  );

  const createWeddingFn = useCallback(
    async (data: {
      partner1Name: string;
      partner2Name: string;
      date: string;
      venue: string;
      location?: string;
      estimatedGuests: number;
      estimatedBudget: number;
    }) => {
      const weddingData = await apiCreateWedding(data);
      setWedding(weddingData as Wedding);
    },
    []
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setWedding(null);
    router.push("/");
  }, [router]);

  const refreshUserData = useCallback(async () => {
    await loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        wedding,
        isLoading,
        isAuthenticated: useRealApi ? checkAuth() : true,
        login,
        register,
        createWedding: createWeddingFn,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
