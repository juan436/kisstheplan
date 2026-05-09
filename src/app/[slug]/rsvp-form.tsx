"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import type { PublicWeddingData } from "@/types";
import type { RsvpSession } from "./rsvp/types";
import { RsvpLookup } from "./rsvp/rsvp-lookup";
import { RsvpStepper } from "./rsvp/rsvp-stepper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface RsvpFormProps {
  slug: string;
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
}

export function RsvpForm({ slug, page, colors }: RsvpFormProps) {
  const [session,      setSession]      = useState<RsvpSession | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError,   setTokenError]   = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setTokenChecked(true); return; }
    setTokenLoading(true);
    fetch(`${API_URL}/public/rsvp/token/${token}`)
      .then((res) => { if (!res.ok) throw new Error("El enlace no es válido o ha expirado"); return res.json(); })
      .then((data: RsvpSession) => setSession(data))
      .catch((err: Error) => setTokenError(err.message))
      .finally(() => { setTokenLoading(false); setTokenChecked(true); });
  }, []);

  const deadline = page.rsvpDeadline
    ? new Date(page.rsvpDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div>
      <Heart size={20} style={{ color: colors.accent }} className="mx-auto mb-4 opacity-50 block" />
      {deadline && (
        <p className="text-center text-[13px] opacity-40 mb-6">Fecha límite: {deadline}</p>
      )}

      {tokenLoading && (
        <div className="flex justify-center py-10">
          <Loader2 size={28} className="animate-spin" style={{ color: colors.accent }} />
        </div>
      )}

      {tokenChecked && tokenError && (
        <div className="mb-6">
          <p className="text-[13px] mb-5 text-center" style={{ color: "#c47a7a" }}>{tokenError}</p>
          <RsvpLookup slug={slug} onFound={setSession} colors={colors} fontTitle={page.fontTitle} />
        </div>
      )}

      {tokenChecked && !tokenLoading && !tokenError && !session && (
        <RsvpLookup slug={slug} onFound={setSession} colors={colors} fontTitle={page.fontTitle} />
      )}

      {session && (
        <RsvpStepper session={session} colors={colors} fontTitle={page.fontTitle} />
      )}
    </div>
  );
}
