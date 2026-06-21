"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api/http-client";
import { SectionWrapper } from "./account-helpers";

interface SubscriptionData {
  plan: 'trial' | 'annual';
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  trialEndDate: string | null;
  currentPeriodEnd: string | null;
  amount: number | null;
  currency: string;
}

const STATUS_LABEL: Record<string, string> = {
  trial: 'Prueba gratuita',
  active: 'Activa',
  expired: 'Expirada',
  cancelled: 'Cancelada',
};

const STATUS_COLOR: Record<string, string> = {
  trial: 'text-cta bg-cta/10',
  active: 'text-success bg-success/10',
  expired: 'text-danger bg-danger/10',
  cancelled: 'text-brand bg-border',
};

export function EstadoSuscripcion() {
  const [sub, setSub] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";
    if (!useRealApi) return;
    apiFetch("/subscription")
      .then((data) => setSub(data as SubscriptionData))
      .catch(() => null);
  }, []);

  const expiryDate = sub?.trialEndDate ?? sub?.currentPeriodEnd;
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-6">Estado de suscripción</h2>
      {sub ? (
        <div className="max-w-[420px] space-y-5">
          <div className="bg-[#f2efe9] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-text/60 uppercase tracking-wider font-semibold">Plan</span>
              <span className="text-[14px] text-text font-semibold capitalize">{sub.plan === 'trial' ? 'Prueba gratuita' : 'Anual'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-text/60 uppercase tracking-wider font-semibold">Estado</span>
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${STATUS_COLOR[sub.status]}`}>
                {STATUS_LABEL[sub.status]}
              </span>
            </div>
            {formattedExpiry && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text/60 uppercase tracking-wider font-semibold">
                  {sub.plan === 'trial' ? 'Expira' : 'Renueva'}
                </span>
                <span className="text-[14px] text-text">{formattedExpiry}</span>
              </div>
            )}
            {sub.amount && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text/60 uppercase tracking-wider font-semibold">Importe</span>
                <span className="text-[14px] text-text font-semibold">{sub.amount} {sub.currency}/año</span>
              </div>
            )}
          </div>
          {sub.status === 'trial' && (
            <p className="text-[13px] text-brand">Al terminar la prueba, elige el plan anual desde aquí.</p>
          )}
        </div>
      ) : (
        <p className="text-[14px] text-text/60">Sin suscripción activa.</p>
      )}
    </SectionWrapper>
  );
}
