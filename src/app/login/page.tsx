"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!useRealApi) {
      router.push("/app/dashboard");
      return;
    }

    if (!email || !password) {
      setError("Introduce tu email y contraseña");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg2 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-fade-up">
        <div className="flex justify-center mb-12">
          <Logo variant="mocha" centered />
        </div>

        <Card variant="elevated" className="p-8">
          <h1 className="font-display text-[28px] text-text text-center mb-1">
            Bienvenido
          </h1>
          <p className="text-[14px] text-brand text-center mb-8">
            Accede a tu planificador de boda
          </p>

          {error && (
            <div className="bg-danger/10 text-danger text-[13px] rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="cta" size="full" disabled={loading}>
              {loading ? "Entrando..." : "Ir a mi boda"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[12px] text-brand">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button variant="secondary" size="full" className="gap-3" disabled>
            <Image src="/icons/Google__G__logo.svg.png" alt="Google" width={18} height={18} className="object-contain" />
            Continuar con Google (próximamente)
          </Button>

          <p className="text-[13px] text-brand text-center mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-cta font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
