"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import type { GuestStats, BudgetSummary } from "@/types";
import { CountdownRingCarousel, PaymentBar } from "./countdown-ring-carousel";

interface CountdownSectionProps {
  daysLeft: number;
  guestStats: GuestStats;
  budget?: BudgetSummary;
  weddingBudget?: number;
  taskProgress?: { total: number; completed: number; percentage: number } | null;
}

export function CountdownSection({ daysLeft, guestStats, budget, weddingBudget, taskProgress }: CountdownSectionProps) {
  return (
    <Card className="flex flex-col items-center gap-6 py-6">
      <p className="text-[11px] font-bold text-cta uppercase tracking-[2px]">
        Cuenta atrás
      </p>
      <CountdownRingCarousel daysLeft={daysLeft} taskProgress={taskProgress} />
      {budget && <PaymentBar budget={budget} weddingBudget={weddingBudget ?? 0} />}
      <div className="grid grid-cols-3 gap-6 w-full">
        <StatCard value={guestStats.confirmed} label="Confirmados" />
        <StatCard value={guestStats.pending} label="Pendientes" />
        <StatCard value={guestStats.rejected} label="Rechazados" />
      </div>
    </Card>
  );
}
