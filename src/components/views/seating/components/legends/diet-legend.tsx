"use client";

import { useMemo } from "react";
import type { SeatingPlan, Guest } from "@/types";
import { normalizeDish } from "@/lib/allergy-colors";

interface DietLegendProps {
  plan: SeatingPlan;
  guests: Guest[];
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
}

const COL_LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "var(--color-text)",
  opacity: 0.4, marginBottom: 8,
};

const ROW: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 7,
};

const DOT = (color: string): React.CSSProperties => ({
  width: 9, height: 9, borderRadius: "50%", background: color,
  flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)",
});

const NAME: React.CSSProperties = {
  fontSize: 11, fontWeight: 500, color: "var(--color-text)",
  flex: 1, whiteSpace: "nowrap",
};

function LegendColumn({ title, entries, colors }: {
  title: string;
  entries: [string, number][];
  colors: Record<string, string>;
}) {
  if (entries.length === 0) return null;
  return (
    <div>
      <p style={COL_LABEL}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map(([name, count]) => {
          const color = colors[name] ?? "#aaa";
          return (
            <div key={name} style={ROW}>
              <span style={DOT(color)} />
              <span style={NAME}>{name}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color, opacity: 0.8 }}>×{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DietLegend({ plan, guests, allergyColors, mealColors }: DietLegendProps) {
  const { allergyCount, dishCount } = useMemo(() => {
    const guestMap = new Map(guests.map((g) => [g.id, g]));
    const allergyCount: Record<string, number> = {};
    const dishCount:    Record<string, number> = {};

    for (const table of plan.tables) {
      for (const a of table.assignments) {
        const g = a.guestId ? guestMap.get(a.guestId) : undefined;
        if (!g) continue;
        if (g.dish?.trim()) {
          const key = normalizeDish(g.dish);
          dishCount[key] = (dishCount[key] ?? 0) + 1;
        }
        if (g.allergies?.trim()) {
          g.allergies.split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => {
            allergyCount[s] = (allergyCount[s] ?? 0) + 1;
          });
        }
      }
    }
    return { allergyCount, dishCount };
  }, [plan, guests]);

  const allergyEntries = Object.entries(allergyCount);
  const dishEntries    = Object.entries(dishCount);

  if (allergyEntries.length === 0 && dishEntries.length === 0) return null;

  const bothCols = allergyEntries.length > 0 && dishEntries.length > 0;

  return (
    <div style={{
      background: "rgba(255,252,249,0.97)", backdropFilter: "blur(10px)",
      border: "1px solid var(--color-border)", borderRadius: 12,
      boxShadow: "0 6px 32px rgba(74,60,50,0.12), 0 1px 4px rgba(74,60,50,0.06)",
      padding: "10px 12px",
      display: "flex", flexDirection: "row", gap: bothCols ? 20 : 0,
    }}>
      <LegendColumn title="Alergias" entries={allergyEntries} colors={allergyColors} />
      {bothCols && <div style={{ width: 1, background: "var(--color-border)", flexShrink: 0 }} />}
      <LegendColumn title="Menú" entries={dishEntries} colors={mealColors} />
    </div>
  );
}
