"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { AuthForm } from "@/components/features/auth/auth-form";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  const handleSubmit = async (email: string, password: string) => {
    if (!useRealApi) { router.push("/app/dashboard"); return; }
    const { user: userData, isExpired } = await login(email, password);
    if (userData?.role === "admin") {
      router.push("/admin");
    } else if (isExpired) {
      router.push("/app/account?expired=true");
    } else {
      router.push("/app/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-bg2 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-fade-up">
        <div className="flex justify-center mb-12">
          <Logo variant="mocha" centered />
        </div>

        <Card variant="elevated" className="p-8">
          <AuthForm
            header={
              <>
                <h1 className="font-display text-[28px] text-text text-center mb-1">Bienvenido</h1>
                <p className="text-[14px] text-brand text-center mb-3">Accede a tu planificador de boda</p>
              </>
            }
            onSubmit={handleSubmit}
            submitLabel={{ login: "Ir a mi boda" }}
            footer={
              <p className="text-[13px] text-brand text-center">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-cta font-semibold hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            }
          />
        </Card>
      </div>
    </div>
  );
}
