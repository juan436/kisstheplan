"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CountdownRing } from "@/components/ui/countdown-ring";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { GuestStats, BudgetSummary } from "@/types";

interface CountdownSectionProps {
  daysLeft: number;
  guestStats: GuestStats;
  budget?: BudgetSummary;
  taskProgress?: { total: number; completed: number; percentage: number } | null;
}

export function CountdownSection({ daysLeft, guestStats, budget, taskProgress }: CountdownSectionProps) {
  const [ringIndex, setRingIndex] = useState(0);
  const hasTaskRing = !!(taskProgress && taskProgress.total > 0);
  const total = hasTaskRing ? 2 : 1;

  const prev = () => setRingIndex((i) => (i - 1 + total) % total);
  const next = () => setRingIndex((i) => (i + 1) % total);

  return (
    <Card className="flex flex-col items-center gap-6 py-6">
      <p className="text-[11px] font-bold text-cta uppercase tracking-[2px]">
        Cuenta atrás
      </p>

      {/* Rueda con flechas */}
      <div className="flex items-center gap-4">
        {hasTaskRing ? (
          <button
            onClick={prev}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-fill"
            style={{ color: "var(--color-brand)" }}
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <div className="w-7" />
        )}

        <div className="relative w-[180px] h-[180px]">
          {/* Rueda días */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: ringIndex === 0 ? 1 : 0, pointerEvents: ringIndex === 0 ? "auto" : "none" }}
          >
            <CountdownRing days={daysLeft} totalDays={365} size="lg" />
          </div>

          {/* Rueda tareas */}
          {hasTaskRing && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: ringIndex === 1 ? 1 : 0, pointerEvents: ringIndex === 1 ? "auto" : "none" }}
            >
              <TaskProgressRing
                completed={taskProgress!.completed}
                total={taskProgress!.total}
                percentage={taskProgress!.percentage}
              />
            </div>
          )}
        </div>

        {hasTaskRing ? (
          <button
            onClick={next}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-fill"
            style={{ color: "var(--color-brand)" }}
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="w-7" />
        )}
      </div>

      {/* Indicadores de punto */}
      {hasTaskRing && (
        <div className="flex gap-1.5 -mt-3">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setRingIndex(i)}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i === ringIndex ? "var(--color-accent)" : "var(--color-border)" }}
            />
          ))}
        </div>
      )}

      {budget && <PaymentBar budget={budget} />}

      <div className="grid grid-cols-3 gap-6 w-full">
        <StatCard value={guestStats.confirmed} label="Confirmados" />
        <StatCard value={guestStats.pending} label="Pendientes" />
        <StatCard value={guestStats.rejected} label="Rechazados" />
      </div>
    </Card>
  );
}

function TaskProgressRing({ completed, total, percentage }: { completed: number; total: number; percentage: number }) {
  const dimensions = 180;
  const strokeWidth = 8;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dimensions} height={dimensions} className="-rotate-90">
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg3)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-text leading-none text-[42px]">
          {percentage}
        </span>
        <span className="text-brand uppercase tracking-[1px] font-semibold text-[11px] mt-1">
          tareas
        </span>
        <span className="text-text/40 text-[10px] mt-0.5">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}

function PaymentBar({ budget }: { budget: BudgetSummary }) {
  const total = budget.totalEstimated || 1;
  const paidPct = Math.min((budget.totalPaid / total) * 100, 100);
  const enteredPct = Math.min((budget.totalReal / total) * 100, 100);

  return (
    <div className="w-full space-y-2">
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

      <div className="relative h-2.5 bg-fill1 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${enteredPct}%`, background: "#8fba88" }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${paidPct}%`, background: "#4A773C" }}
        />
      </div>
    </div>
  );
}
