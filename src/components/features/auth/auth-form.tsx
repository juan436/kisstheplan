"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/google-button";

export type AuthMode = "login" | "register";

interface AuthFormProps {
  header: React.ReactNode;
  showTabs?: boolean;
  prefillEmail?: string;
  onSubmit: (email: string, password: string, mode: AuthMode, name: string) => Promise<void>;
  onGoogleLogin?: () => void;
  submitLabel?: { login?: string; register?: string };
  error?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
}

export function AuthForm({
  header,
  showTabs = false,
  prefillEmail = "",
  onSubmit,
  onGoogleLogin,
  submitLabel,
  error,
  submitting,
  footer,
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, mode, name);
  };

  return (
    <div className="space-y-5">
      {header}

      {showTabs && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${mode === "login" ? "bg-[#f2efe9] text-text" : "text-text/40 hover:text-text"}`}
          >
            Ya tengo cuenta
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${mode === "register" ? "bg-[#f2efe9] text-text" : "text-text/40 hover:text-text"}`}
          >
            Crear cuenta
          </button>
        </div>
      )}

      <GoogleButton onClick={onGoogleLogin} />

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[12px] text-brand">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {showTabs && mode === "register" && (
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        {error && (
          <div className="bg-danger/10 text-danger text-[13px] rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <Button type="submit" variant="cta" size="full" disabled={submitting}>
          {submitting
            ? "Entrando..."
            : mode === "login"
            ? (submitLabel?.login ?? "Iniciar sesión")
            : (submitLabel?.register ?? "Crear cuenta")}
        </Button>
      </form>

      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}
