"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { NavigationProvider } from "@/hooks/useNavigation";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, wedding, availableWeddings, activeRole, isLoading, isAuthenticated, logout, switchWedding } = useAuth();

  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  useEffect(() => {
    if (!isLoading && useRealApi) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role === 'admin') {
        router.push("/admin");
      } else if (user && wedding === null) {
        router.push("/register?step=1");
      }
    }
  }, [isLoading, isAuthenticated, useRealApi, router, user, wedding]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-brand text-sm">Cargando...</div>
      </div>
    );
  }

  if (useRealApi && !isAuthenticated) {
    return null;
  }

  const weddingName = wedding
    ? `${wedding.partner1Name} & ${wedding.partner2Name}`
    : "Mi boda";
  const userName = user?.name || "Usuario";

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-bg flex flex-col overflow-x-hidden">
        <Topbar
          weddingName={weddingName}
          userName={userName}
          userRole={activeRole ?? undefined}
          activeWeddingId={wedding?.id}
          availableWeddings={availableWeddings}
          onSwitchWedding={switchWedding}
          onLogout={logout}
        />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </NavigationProvider>
  );
}
