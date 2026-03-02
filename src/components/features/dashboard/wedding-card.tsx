import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Wedding, BudgetSummary } from "@/types";

interface WeddingCardProps {
  wedding: Wedding;
  budget: BudgetSummary;
}

export function WeddingCard({ wedding, budget }: WeddingCardProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Photo placeholder */}
      <div
        className="h-[120px] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--color-fill1), var(--color-fill2))",
        }}
      >
        <span className="text-[36px]">💒</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[12px] text-accent">
            <Calendar size={14} className="text-cta" />
            {formatDate(wedding.date)}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-accent">
            <MapPin size={14} className="text-cta" />
            {wedding.venue}, {wedding.location}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="font-semibold text-accent uppercase tracking-[0.5px]">
              Presupuesto
            </span>
            <span className="text-brand">
              {formatCurrency(budget.totalPaid)} / {formatCurrency(budget.totalEstimated)}
            </span>
          </div>
          <Progress value={budget.totalPaid} max={budget.totalEstimated} />
        </div>
      </div>
    </Card>
  );
}
