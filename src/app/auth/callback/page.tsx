"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens } from "@/services";
import { apiFetch } from "@/services/api/http-client";
import { useAuth } from "@/hooks/useAuth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUserData } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (!token || !refreshToken) {
      router.replace("/login");
      return;
    }

    setTokens(token, refreshToken);

    apiFetch<{ onboardingComplete?: boolean }>("/auth/me")
      .then(async (profile) => {
        await refreshUserData();
        if (profile.onboardingComplete === false) {
          router.replace("/register?step=1");
        } else {
          router.replace("/app/dashboard");
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router, searchParams, refreshUserData]);

  return (
    <div className="min-h-screen bg-bg2 flex items-center justify-center">
      <p className="text-brand text-[14px]">Iniciando sesión...</p>
    </div>
  );
}

const Fallback = () => (
  <div className="min-h-screen bg-bg2 flex items-center justify-center">
    <p className="text-brand text-[14px]">Cargando...</p>
  </div>
);

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <CallbackContent />
    </Suspense>
  );
}
