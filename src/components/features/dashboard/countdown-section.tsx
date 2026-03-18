import { CountdownRing } from "@/components/ui/countdown-ring";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { GuestStats, BudgetSummary } from "@/types";

interface CountdownSectionProps {
  daysLeft: number;
  guestStats: GuestStats;
  budget?: BudgetSummary;
}

export function CountdownSection({ daysLeft, guestStats, budget }: CountdownSectionProps) {
  return (
    <Card className="flex flex-col items-center gap-6 py-6">
      <p className="text-[11px] font-bold text-cta uppercase tracking-[2px]">
        Cuenta atrás
      </p>
      <CountdownRing days={daysLeft} totalDays={365} size="lg" />

      {budget && <PaymentBar budget={budget} />}

      <div className="grid grid-cols-3 gap-6 w-full">
        <StatCard value={guestStats.confirmed} label="Confirmados" />
        <StatCard value={guestStats.pending} label="Pendientes" />
        <StatCard value={guestStats.rejected} label="Rechazados" />
      </div>
    </Card>
  );
}

function PaymentBar({ budget }: { budget: BudgetSummary }) {
  const total = budget.totalEstimated || 1;
  const paidPct = Math.min((budget.totalPaid / total) * 100, 100);
  const enteredPct = Math.min((budget.totalReal / total) * 100, 100);

  return (
    <div className="w-full space-y-2">
      {/* Labels */}
      <div className="flex items-center justify-between text-[11px] text-text/60">
        <span>
          <span className="font-semibold text-[#4A773C]">Pagado:</span>{" "}
          {formatCurrency(budget.totalPaid)}
        </span>
        <span>
          <span className="font-semibold text-[#8fba88]">Comprometido:</span>{" "}
          {formatCurrency(budget.totalReal)}
        </span>
        <span>
          <span className="font-semibold text-text/40">Total:</span>{" "}
          {formatCurrency(total)}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-2.5 bg-fill1 rounded-full overflow-hidden">
        {/* Entered (committed, behind paid) */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${enteredPct}%`, background: "#8fba88" }}
        />
        {/* Paid (on top) */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${paidPct}%`, background: "#4A773C" }}
        />
      </div>
    </div>
  );
}
