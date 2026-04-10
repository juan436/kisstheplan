"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./account-helpers";

export function CancelarPlan() {
  const [feedback, setFeedback] = useState("");

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-4">Cancelar Plan</h2>
      <div className="max-w-[420px] space-y-6">
        <p className="text-[14px] text-text/70 leading-relaxed">
          Sentimos mucho que KissthePlan no haya cumplido tus expectativas.
          Nos encantaría saber cómo podemos mejorar. Si tienes un momento,
          déjanos tus sugerencias antes de cancelar.
        </p>
        <div className="space-y-2">
          <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">
            Tu opinión nos importa
          </Label>
          <textarea
            placeholder="INTRODUCIR SUGERENCIAS"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-36 bg-[#f2efe9] border-none rounded-xl p-4 text-[14px] text-text placeholder:text-text/30 placeholder:uppercase placeholder:tracking-wider resize-none focus:outline-none focus:ring-2 focus:ring-cta/30"
          />
        </div>
        <button className="text-[13px] text-cta hover:text-[#b08f5d] font-medium transition-colors uppercase tracking-wider">
          Enviar sugerencia
        </button>
        <div className="pt-4">
          <Button className="w-full py-6 bg-[#866857] hover:bg-[#6b5549] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="text-[14px] font-bold tracking-[2px] uppercase">Cancelar plan</span>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
