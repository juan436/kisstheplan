"use client";

import { useState } from "react";
import { Tag, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionWrapper, FieldGroup } from "./account-helpers";

type Status = "idle" | "loading" | "success" | "error";

const MOCK_CODES: Record<string, string> = {
  BODA2026: "20% de descuento en tu próxima renovación",
  KISSTHEPLAN: "1 mes gratis",
  WEDDING10: "10% de descuento",
};

export function CodigoDescuento() {
  const [code, setCode]       = useState("");
  const [status, setStatus]   = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setStatus("loading");

    // Simulación llamada API — reemplazar por api.applyDiscount(trimmed)
    await new Promise((r) => setTimeout(r, 900));

    if (MOCK_CODES[trimmed]) {
      setStatus("success");
      setMessage(MOCK_CODES[trimmed]);
    } else {
      setStatus("error");
      setMessage("Código no válido o ya utilizado.");
    }
  };

  const handleReset = () => {
    setCode("");
    setStatus("idle");
    setMessage("");
  };

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-2">Código de descuento</h2>
      <p className="text-[13px] text-text/50 mb-8 leading-relaxed">
        Si tienes un código promocional, introdúcelo aquí para aplicar el descuento a tu suscripción.
      </p>

      {status === "success" ? (
        <div className="max-w-[380px] bg-success/10 border border-success/30 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <CheckCircle2 size={36} className="text-success" />
          <p className="text-[15px] font-semibold text-text">¡Código aplicado!</p>
          <p className="text-[13px] text-text/60">{message}</p>
          <button
            onClick={handleReset}
            className="mt-2 text-[12px] text-accent hover:text-cta underline underline-offset-2 transition-colors"
          >
            Introducir otro código
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-w-[380px]">
          <FieldGroup label="Código promocional">
            <div className="relative">
              <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand pointer-events-none" />
              <Input
                placeholder="Ej: BODA2026"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus("idle"); setMessage(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleApply(); }}
                disabled={status === "loading"}
                className="bg-[#f2efe9] border-none h-12 rounded-xl pl-10 tracking-widest font-mono text-[14px] uppercase"
              />
            </div>
          </FieldGroup>

          {status === "error" && (
            <div className="flex items-center gap-2 text-danger text-[13px]">
              <XCircle size={14} className="shrink-0" />
              {message}
            </div>
          )}

          <Button
            onClick={handleApply}
            disabled={!code.trim() || status === "loading"}
            className="w-full py-6 bg-[#CBA978] hover:bg-[#b08f5d] disabled:opacity-40 text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : null}
            <span className="text-[14px] font-bold tracking-[2px] uppercase">
              {status === "loading" ? "Verificando..." : "Aplicar código"}
            </span>
          </Button>
        </div>
      )}
    </SectionWrapper>
  );
}
