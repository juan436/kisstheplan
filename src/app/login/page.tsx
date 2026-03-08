"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
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
        <div className="flex justify-center mb-8">
          <Logo />
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
              <Input
                id="password"
                type="password"
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
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
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
