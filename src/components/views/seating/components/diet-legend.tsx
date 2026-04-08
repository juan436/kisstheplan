"use client";

import { useMemo } from "react";
import type { SeatingPlan, Guest } from "@/types";

interface DietLegendProps {
  plan: SeatingPlan;
  guests: Guest[];
}

export function DietLegend({ plan, guests }: DietLegendProps) {
  const stats = useMemo(() => {
    const guestMap = new Map(guests.map((g) => [g.id, g]));
    const assigned: Guest[] = [];

    for (const table of plan.tables) {
      for (const a of table.assignments) {
        const g = a.guestId ? guestMap.get(a.guestId) : undefined;
        if (g) assigned.push(g);
      }
    }

    const dishCount: Record<string, number> = {};
    const allergyCount: Record<string, number> = {};

    for (const g of assigned) {
      if (g.dish) dishCount[g.dish] = (dishCount[g.dish] ?? 0) + 1;
      if (g.allergies) {
        g.allergies.split(",").map((a) => a.trim()).filter(Boolean).forEach((a) => {
          allergyCount[a] = (allergyCount[a] ?? 0) + 1;
        });
      }
    }

    return { total: assigned.length, dishCount, allergyCount };
  }, [plan, guests]);

  if (stats.total === 0) return null;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-3"
      style={{ boxShadow: "0 2px 8px rgba(74,60,50,0.06)" }}>
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]/50 mb-2">
        Leyenda de dietas — {stats.total} asignados
      </h4>

      {Object.keys(stats.dishCount).length > 0 && (
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-text)]/40 mb-1.5">Menú</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats.dishCount).map(([dish, count]) => (
              <span key={dish} className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: "var(--color-fill)", color: "var(--color-text)" }}>
                {dish} ×{count}
              </span>
            ))}
          </div>
        </div>
      )}

      {Object.keys(stats.allergyCount).length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-text)]/40 mb-1.5">Alergias</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats.allergyCount).map(([allergy, count]) => (
              <span key={allergy} className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: "rgba(196,119,119,0.15)", color: "var(--color-danger)" }}>
                {allergy} ×{count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
