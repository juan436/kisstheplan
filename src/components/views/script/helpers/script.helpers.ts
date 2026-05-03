/**
 * script.helpers.ts
 *
 * Qué hace: funciones puras de utilidad para el módulo de guión (ordenación, formateo de horas).
 * Recibe:   tipos ScriptEntry, ScriptArea, GuestStats.
 * Provee:   helpers y tipos TabType / TimePillMode exportados al módulo.
 */

import type { ScriptEntry, ScriptArea, GuestStats } from "@/types";

export type TabType = "resumen" | "guion";
export type TimePillMode = "exact" | "range" | "none";

export interface ScriptViewProps {
  entries: ScriptEntry[];
  areas: ScriptArea[];
  guestStats: GuestStats | null;
  onCreateEntry: (data: Partial<ScriptEntry>) => Promise<void>;
  onUpdateEntry: (id: string, data: Partial<ScriptEntry>) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  onReorderEntries: (ids: string[]) => Promise<void>;
  onCreateArea: (data: { name: string; imageUrl?: string }) => Promise<void>;
  onUpdateArea: (id: string, data: { name?: string; imageUrl?: string }) => Promise<void>;
  onDeleteArea: (id: string) => Promise<void>;
}

export function formatTimeDisplay(entry: ScriptEntry): string {
  if (entry.timeType === "none" || !entry.timeStart) return "";
  if (entry.timeType === "range" && entry.timeEnd) return `${entry.timeStart} - ${entry.timeEnd}`;
  return entry.timeStart;
}

export function sortEntries(entries: ScriptEntry[]): ScriptEntry[] {
  return [...entries].sort((a, b) => {
    const aT = a.timeType !== "none" && a.timeStart;
    const bT = b.timeType !== "none" && b.timeStart;
    if (aT && bT) return (a.timeStart ?? "").localeCompare(b.timeStart ?? "");
    if (aT) return -1;
    if (bT) return 1;
    return a.order - b.order;
  });
}
