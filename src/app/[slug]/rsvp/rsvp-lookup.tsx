"use client";

import { useState } from "react";
import { Search, Loader2, PartyPopper } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Input } from "@/components/ui/input";
import type { RsvpSession } from "./types";

const API_URL       = process.env.NEXT_PUBLIC_API_URL        || "http://localhost:3001/api";
const GOOGLE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function decodeJwt(token: string): Record<string, string> {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return {}; }
}

interface RsvpLookupProps {
  slug: string;
  onFound: (session: RsvpSession) => void;
  colors: Record<string, string>;
  fontTitle: string;
}

function NotInvited({ name, accent, onRetry }: { name: string; accent: string; onRetry: () => void }) {
  return (
    <div className="text-center py-2">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-[20px] mb-2 font-medium">¡Epa, {name || "tú"}!</h3>
      <p className="text-[14px] opacity-60 mb-2 leading-relaxed">
        Parece que no estás en la lista de invitados de esta boda.
      </p>
      <p className="text-[13px] opacity-40 mb-6">
        Si crees que es un error, contacta con los novios.
      </p>
      <div className="flex items-center gap-3 justify-center mb-4">
        <div className="w-8 h-px opacity-20" style={{ backgroundColor: accent }} />
        <PartyPopper size={14} style={{ color: accent }} className="opacity-40" />
        <div className="w-8 h-px opacity-20" style={{ backgroundColor: accent }} />
      </div>
      <button type="button" onClick={onRetry}
        className="text-[13px] underline opacity-50 hover:opacity-80 transition-opacity">
        Intentar con otro email
      </button>
    </div>
  );
}

function LookupForm({ slug, onFound, colors, fontTitle }: RsvpLookupProps) {
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [notFound,   setNotFound]   = useState(false);
  const [foundName,  setFoundName]  = useState("");

  const callLookup = async (url: string, body: object) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({ message: "No encontrado" }));
      throw new Error(d.message);
    }
    return res.json() as Promise<RsvpSession>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setError("Por favor, introduce tu nombre y email"); return; }
    setLoading(true); setError(""); setNotFound(false);
    try {
      onFound(await callLookup(`${API_URL}/public/rsvp/${slug}/lookup`, { name: name.trim(), email: email.trim() }));
    } catch { setNotFound(true); setFoundName(name.trim()); }
    finally { setLoading(false); }
  };

  const handleGoogle = async (credential: string) => {
    const payload = decodeJwt(credential);
    const googleEmail = payload.email ?? "";
    const googleName  = payload.name  ?? "";
    setLoading(true); setError(""); setNotFound(false);
    try {
      onFound(await callLookup(`${API_URL}/public/rsvp/${slug}/google`, { email: googleEmail }));
    } catch { setNotFound(true); setFoundName(googleName); }
    finally { setLoading(false); }
  };

  if (notFound) return <NotInvited name={foundName} accent={colors.accent} onRetry={() => setNotFound(false)} />;

  return (
    <div>
      <h2 className="text-[24px] mb-2" style={{ fontFamily: fontTitle, fontStyle: "italic" }}>
        Confirma tu asistencia
      </h2>
      <p className="text-[14px] opacity-50 mb-6">Accede con Google o busca por nombre y email</p>

      {/* Google button */}
      <div className="mb-5 flex justify-center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
          <GoogleLogin
            onSuccess={(r) => r.credential && handleGoogle(r.credential)}
            onError={() => setError("Error al conectar con Google")}
            text="continue_with"
            shape="pill"
          />
        </GoogleOAuthProvider>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px opacity-20" style={{ backgroundColor: colors.accent }} />
        <span className="text-[11px] uppercase tracking-widest opacity-40">o busca manualmente</span>
        <div className="flex-1 h-px opacity-20" style={{ backgroundColor: colors.accent }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5 opacity-50">
            Nombre completo
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y apellidos" className="bg-white/80 backdrop-blur" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5 opacity-50">
            Email
          </label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com" className="bg-white/80 backdrop-blur" />
        </div>
        {error && <p className="text-[13px]" style={{ color: "#c47a7a" }}>{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: colors.accent }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Buscar mi invitación
        </button>
      </form>
    </div>
  );
}

export function RsvpLookup(props: RsvpLookupProps) {
  return <LookupForm {...props} />;
}
