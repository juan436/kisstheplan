"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { RsvpSession, GuestResponse, GuestPublic } from "./types";
import { StepGroup } from "./step-group";
import { StepPreferences } from "./step-preferences";
import { StepLogistics } from "./step-logistics";
import { RsvpSummary } from "./rsvp-summary";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface RsvpStepperProps {
  session: RsvpSession;
  colors: Record<string, string>;
  fontTitle: string;
}

function alreadyResponded(session: RsvpSession): boolean {
  const members = session.group ? session.group.members : [session.guest];
  return members.some((m) => m.rsvpStatus === "confirmed" || m.rsvpStatus === "rejected");
}

function buildResponses(session: RsvpSession): GuestResponse[] {
  const members: GuestPublic[] = session.group ? session.group.members : [session.guest];
  return members.map((m) => ({
    guestId: m.id,
    rsvpStatus: m.rsvpStatus === "confirmed" || m.rsvpStatus === "rejected"
      ? m.rsvpStatus
      : "confirmed",
    mealChoice:           m.mealChoice,
    allergies:            m.allergies,
    transport:            m.transport,
    transportPickupPoint: m.transportPickupPoint,
  }));
}

export function RsvpStepper({ session, colors, fontTitle }: RsvpStepperProps) {
  const [showSummary, setShowSummary] = useState(() => alreadyResponded(session));
  const [step,        setStep]        = useState(0);
  const [responses,   setResponses]   = useState<GuestResponse[]>(() => buildResponses(session));
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [error,       setError]       = useState("");

  const confirmedCount = responses.filter((r) => r.rsvpStatus === "confirmed").length;
  const allRejected    = confirmedCount === 0;

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${API_URL}/public/rsvp/${session.wedding.slug}/group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token, responses }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({ message: "Error al enviar" }));
        throw new Error(d.message);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally { setSubmitting(false); }
  };

  const handleModify = () => {
    setShowSummary(false);
    setStep(0);
    setSubmitted(false);
    setError("");
  };

  const handleStep1Next = () => allRejected ? handleSubmit() : setStep(1);
  const handleStep2Next = () => setStep(2);

  // Pantalla: resumen de respuesta existente
  if (showSummary) {
    return (
      <RsvpSummary session={session} colors={colors} fontTitle={fontTitle} onModify={handleModify} />
    );
  }

  // Pantalla: confirmación tras envío
  if (submitted) {
    const msg = confirmedCount > 0
      ? (session.wedding.confirmMessage || "¡Nos vemos allí! Tu confirmación ha sido registrada.")
      : (session.wedding.rejectMessage  || "¡Te echaremos de menos! Gracias por avisarnos.");
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: colors.accent + "20" }}>
          <Check size={32} style={{ color: colors.accent }} />
        </div>
        <h2 className="text-[28px] mb-3" style={{ fontFamily: fontTitle, fontStyle: "italic" }}>
          {confirmedCount > 0 ? "¡Hasta pronto!" : "Gracias por avisarnos"}
        </h2>
        <p className="text-[15px] opacity-60">{msg}</p>
      </div>
    );
  }

  const stepProps = { session, responses, setResponses, colors, fontTitle };

  return (
    <div>
      {error && <p className="text-[13px] mb-4 text-center" style={{ color: "#c47a7a" }}>{error}</p>}
      {step === 0 && <StepGroup {...stepProps} onNext={handleStep1Next} submitting={submitting} />}
      {step === 1 && <StepPreferences {...stepProps} onNext={handleStep2Next} onBack={() => setStep(0)} />}
      {step === 2 && <StepLogistics {...stepProps} submitting={submitting} onSubmit={handleSubmit} onBack={() => setStep(1)} />}
    </div>
  );
}
