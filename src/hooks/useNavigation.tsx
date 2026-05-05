"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NavigationState {
  pendingTab: string | null;
  pendingVendorId: string | null;
  pendingCategoryId: string | null;
  pendingItemId: string | null;
}

interface NavigationContextValue extends NavigationState {
  navigateTo: (tab: string, vendorId?: string, categoryId?: string, itemId?: string) => void;
  clearPendingTab: () => void;
  clearPendingVendorId: () => void;
  clearPendingCategoryId: () => void;
  clearPendingItemId: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    pendingTab: null,
    pendingVendorId: null,
    pendingCategoryId: null,
    pendingItemId: null,
  });

  const navigateTo = useCallback((tab: string, vendorId?: string, categoryId?: string, itemId?: string) => {
    setState({ pendingTab: tab, pendingVendorId: vendorId ?? null, pendingCategoryId: categoryId ?? null, pendingItemId: itemId ?? null });
  }, []);

  const clearPendingTab = useCallback(() => {
    setState((prev) => ({ ...prev, pendingTab: null }));
  }, []);

  const clearPendingVendorId = useCallback(() => {
    setState((prev) => ({ ...prev, pendingVendorId: null }));
  }, []);

  const clearPendingCategoryId = useCallback(() => {
    setState((prev) => ({ ...prev, pendingCategoryId: null }));
  }, []);

  const clearPendingItemId = useCallback(() => {
    setState((prev) => ({ ...prev, pendingItemId: null }));
  }, []);

  return (
    <NavigationContext.Provider
      value={{ ...state, navigateTo, clearPendingTab, clearPendingVendorId, clearPendingCategoryId, clearPendingItemId }}
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
