"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NavigationProvider } from "@/hooks/useNavigation";
import { Topbar } from "@/components/layout/topbar";
import { apiFetch } from "@/services/api/http-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, wedding, availableWeddings, activeRole, isLoading, isAuthenticated, logout, switchWedding } = useAuth();
  const [subExpired, setSubExpired] = useState(false);

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

  useEffect(() => {
    if (!isLoading && useRealApi && wedding) {
      apiFetch("/subscription")
        .then((data: any) => {
          if (data && data.status === "expired") {
            setSubExpired(true);
            if (pathname !== "/app/account" && activeRole !== "collaborator") {
              router.push("/app/account?expired=true");
            }
          } else {
            setSubExpired(false);
          }
        })
        .catch(() => null);
    }
  }, [isLoading, useRealApi, wedding, pathname, router, activeRole]);

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
  const showBlockingOverlay = subExpired && activeRole === 'collaborator';

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
          isSubscriptionExpired={subExpired}
        />
        <main className="flex-1 flex flex-col">
          {showBlockingOverlay ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-bg">
              <div className="max-w-[460px] w-full bg-white border border-border rounded-2xl p-8 shadow-sm text-center space-y-5 animate-fade-in">
                <div className="mx-auto w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="font-display text-[22px] text-text">Boda inhabilitada</h2>
                <p className="text-[13px] text-text/60 leading-relaxed">
                  El acceso a esta boda ha sido suspendido debido a un problema con el pago de la suscripción.
                  Por favor, contacta con el propietario de la boda para reactivar el servicio.
                </p>
                {availableWeddings.length > 1 && (
                  <p className="text-[12px] text-accent font-medium pt-2">
                    Puedes cambiar de boda en el menú superior para acceder a otros proyectos.
                  </p>
                )}
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </NavigationProvider>
  );
}
