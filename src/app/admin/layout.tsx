"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  useEffect(() => {
    if (!isLoading && useRealApi) {
      if (!isAuthenticated) { router.push("/login"); return; }
      if (user && user.role !== 'admin') { router.push("/app/dashboard"); }
    }
  }, [isLoading, isAuthenticated, user, useRealApi, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-brand text-sm">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="sticky top-0 z-40 h-14 bg-accent flex items-center justify-between px-5">
        <Logo type="short" href="/admin" />
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-[12px] font-body">Panel Admin</span>
          <Button variant="ghost" size="sm" onClick={logout} className="text-white/80 hover:text-white">
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
