import { CountdownRing } from "@/components/ui/countdown-ring";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import type { GuestStats } from "@/types";

interface CountdownSectionProps {
  daysLeft: number;
  guestStats: GuestStats;
}

export function CountdownSection({ daysLeft, guestStats }: CountdownSectionProps) {
  return (
    <Card className="flex flex-col items-center gap-6 py-6">
      <p className="text-[11px] font-bold text-cta uppercase tracking-[2px]">
        Cuenta atrás
      </p>
      <CountdownRing days={daysLeft} totalDays={365} size="lg" />
      <div className="grid grid-cols-3 gap-6 w-full">
        <StatCard value={guestStats.confirmed} label="Confirmados" />
        <StatCard value={guestStats.pending} label="Pendientes" />
        <StatCard value={guestStats.rejected} label="Rechazados" />
      </div>
    </Card>
  );
}
