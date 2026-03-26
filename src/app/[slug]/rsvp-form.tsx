"use client";

import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PublicWeddingData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface RsvpFormProps {
  slug: string;
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
}

export function RsvpForm({ slug, page, colors }: RsvpFormProps) {
  const [guestName, setGuestName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "rejected">("confirmed");
  const [mealChoice, setMealChoice] = useState("");
  const [allergies, setAllergies] = useState("");
  const [transport, setTransport] = useState(false);
  const [transportPickupPoint, setTransportPickupPoint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) { setError("Por favor, introduce tu nombre"); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${API_URL}/public/rsvp/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName: guestName.trim(), rsvpStatus, mealChoice: mealChoice || undefined, allergies: allergies.trim() || undefined, transport, transportPickupPoint: transportPickupPoint || undefined }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({ message: "Error" })); throw new Error(d.message); }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: colors.accent + "20" }}>
          <Check size={32} style={{ color: colors.accent }} />
        </div>
        <h2 className="text-[28px] mb-3" style={{ fontFamily: page.fontTitle, fontStyle: "italic" }}>
          {rsvpStatus === "confirmed" ? "Nos vemos alli!" : "Te echaremos de menos"}
        </h2>
        <p className="text-[15px] opacity-60">
          {rsvpStatus === "confirmed" ? "Tu confirmacion ha sido registrada. Gracias!" : "Lamentamos que no puedas asistir. Gracias por avisarnos."}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Heart size={20} style={{ color: colors.accent }} className="mx-auto mb-4 opacity-50" />
      <h2 className="text-[28px] mb-2" style={{ fontFamily: page.fontTitle, fontStyle: "italic" }}>Confirma tu asistencia</h2>
      <p className="text-[14px] opacity-50 mb-8">
        {page.rsvpDeadline ? `Antes del ${new Date(page.rsvpDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}` : "Te esperamos"}
      </p>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-5 text-left">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">Tu nombre completo</label>
          <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nombre y apellidos" className="bg-white/80 backdrop-blur" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">Asistencia</label>
          <div className="grid grid-cols-2 gap-3">
            {(["confirmed", "rejected"] as const).map((status) => (
              <button key={status} type="button" onClick={() => setRsvpStatus(status)} className="py-3.5 rounded-xl border-2 text-[14px] font-medium transition-all"
                style={{ borderColor: rsvpStatus === status ? colors.accent : colors.primary + "30", backgroundColor: rsvpStatus === status ? colors.accent + "10" : "transparent", color: rsvpStatus === status ? colors.text : colors.text + "80" }}>
                {status === "confirmed" ? "Confirmo" : "No puedo"}
              </button>
            ))}
          </div>
        </div>
        {rsvpStatus === "confirmed" && (
          <>
            {page.mealOptions.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">Eleccion de plato</label>
                <select value={mealChoice} onChange={(e) => setMealChoice(e.target.value)} className="w-full bg-white/80 backdrop-blur border-[1.5px] rounded-xl px-4 py-3 text-[14px] outline-none transition-colors" style={{ borderColor: mealChoice ? colors.accent : colors.primary + "30", color: colors.text }}>
                  <option value="">Selecciona una opcion</option>
                  {page.mealOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">Alergias o restricciones</label>
              <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Celiaco, intolerante a la lactosa..." className="bg-white/80 backdrop-blur" />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors" style={{ borderColor: transport ? colors.accent : colors.primary + "40", backgroundColor: transport ? colors.accent : "transparent" }} onClick={() => setTransport(!transport)}>
                  {transport && <Check size={12} className="text-white" />}
                </div>
                <span className="text-[14px]">Necesito transporte</span>
              </label>
            </div>
            {transport && page.transportOptions.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">Punto de recogida</label>
                <select value={transportPickupPoint} onChange={(e) => setTransportPickupPoint(e.target.value)} className="w-full bg-white/80 backdrop-blur border-[1.5px] rounded-xl px-4 py-3 text-[14px] outline-none transition-colors" style={{ borderColor: transportPickupPoint ? colors.accent : colors.primary + "30", color: colors.text }}>
                  <option value="">Selecciona un punto</option>
                  {page.transportOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}
          </>
        )}
        {error && <p className="text-[13px] text-center" style={{ color: "#c47a7a" }}>{error}</p>}
        <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl text-white text-[15px] font-medium transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: colors.accent }}>
          {submitting ? "Enviando..." : "Enviar confirmacion"}
        </button>
      </form>
    </div>
  );
}
