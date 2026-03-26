"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CountdownRing } from "@/components/ui/countdown-ring";
import { formatCurrency } from "@/lib/utils";
import type { BudgetSummary } from "@/types";

interface CountdownRingCarouselProps {
  daysLeft: number;
  taskProgress?: { total: number; completed: number; percentage: number } | null;
}

export function CountdownRingCarousel({ daysLeft, taskProgress }: CountdownRingCarouselProps) {
  const [ringIndex, setRingIndex] = useState(0);
  const hasTaskRing = !!(taskProgress && taskProgress.total > 0);
  const total = hasTaskRing ? 2 : 1;
  const prev = () => setRingIndex((i) => (i - 1 + total) % total);
  const next = () => setRingIndex((i) => (i + 1) % total);

  return (
    <>
      <div className="flex items-center gap-4">
        {hasTaskRing ? (
          <button onClick={prev} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-fill" style={{ color: "var(--color-brand)" }}>
            <ChevronLeft size={18} />
          </button>
        ) : <div className="w-7" />}

        <div className="relative w-[180px] h-[180px]">
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: ringIndex === 0 ? 1 : 0, pointerEvents: ringIndex === 0 ? "auto" : "none" }}>
            <CountdownRing days={daysLeft} totalDays={365} size="lg" />
          </div>
          {hasTaskRing && (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: ringIndex === 1 ? 1 : 0, pointerEvents: ringIndex === 1 ? "auto" : "none" }}>
              <TaskProgressRing
                completed={taskProgress!.completed}
                total={taskProgress!.total}
                percentage={taskProgress!.percentage}
              />
            </div>
          )}
        </div>

        {hasTaskRing ? (
          <button onClick={next} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-fill" style={{ color: "var(--color-brand)" }}>
            <ChevronRight size={18} />
          </button>
        ) : <div className="w-7" />}
      </div>

      {hasTaskRing && (
        <div className="flex gap-1.5 -mt-3">
          {[0, 1].map((i) => (
            <button key={i} onClick={() => setRingIndex(i)} className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i === ringIndex ? "var(--color-accent)" : "var(--color-border)" }} />
          ))}
        </div>
      )}
    </>
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
        <circle cx={dimensions / 2} cy={dimensions / 2} r={radius} fill="none" stroke="var(--color-bg3)" strokeWidth={strokeWidth} />
        <circle cx={dimensions / 2} cy={dimensions / 2} r={radius} fill="none" stroke="var(--color-accent)"
          strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
          className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-text leading-none text-[42px]">{percentage}</span>
        <span className="text-brand uppercase tracking-[1px] font-semibold text-[11px] mt-1">tareas</span>
        <span className="text-text/40 text-[10px] mt-0.5">{completed}/{total}</span>
      </div>
    </div>
  );
}

export function PaymentBar({ budget }: { budget: BudgetSummary }) {
  const total = budget.totalEstimated || 1;
  const paidPct = Math.min((budget.totalPaid / total) * 100, 100);
  const enteredPct = Math.min((budget.totalReal / total) * 100, 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-[11px] text-text/60">
        <span><span className="font-semibold text-[#4A773C]">Pagado:</span> {formatCurrency(budget.totalPaid)}</span>
        <span><span className="font-semibold text-[#8fba88]">Comprometido:</span> {formatCurrency(budget.totalReal)}</span>
        <span><span className="font-semibold text-text/40">Total:</span> {formatCurrency(total)}</span>
      </div>
      <div className="relative h-2.5 bg-fill1 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${enteredPct}%`, background: "#8fba88" }} />
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${paidPct}%`, background: "#4A773C" }} />
      </div>
    </div>
  );
}
