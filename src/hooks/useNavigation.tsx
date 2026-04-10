"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NavigationState {
  pendingTab: string | null;
  pendingVendorId: string | null;
}

interface NavigationContextValue extends NavigationState {
  navigateTo: (tab: string, vendorId?: string) => void;
  clearPendingTab: () => void;
  clearPendingVendorId: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    pendingTab: null,
    pendingVendorId: null,
  });

  const navigateTo = useCallback((tab: string, vendorId?: string) => {
    setState({ pendingTab: tab, pendingVendorId: vendorId ?? null });
  }, []);

  const clearPendingTab = useCallback(() => {
    setState((prev) => ({ ...prev, pendingTab: null }));
  }, []);

  const clearPendingVendorId = useCallback(() => {
    setState((prev) => ({ ...prev, pendingVendorId: null }));
  }, []);

  return (
    <NavigationContext.Provider
      value={{ ...state, navigateTo, clearPendingTab, clearPendingVendorId }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
