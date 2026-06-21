"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./account-helpers";

export function CrearMiBoda() {
  const router = useRouter();

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-4">Crear mi boda</h2>
      <div className="max-w-[420px] space-y-6">
        <div className="bg-[#f2efe9] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-cta" />
            <span className="text-[14px] font-semibold text-text">¿También tienes tu propia boda?</span>
          </div>
          <p className="text-[13px] text-text/70 leading-relaxed">
            Puedes crear tu propia boda en KissthePlan manteniendo acceso a las bodas
            en las que ya colaboras. Podrás cambiar entre ellas desde el topbar.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[13px] text-brand">
            Necesitarás elegir un plan (prueba gratuita de 7 días o plan anual).
          </p>
          <Button
            variant="cta"
            size="full"
            onClick={() => router.push("/register?step=1")}
          >
            Crear mi boda
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
