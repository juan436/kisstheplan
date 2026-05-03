/**
 * GuestsStatsBar
 * Qué hace: muestra 4 cajas de estadísticas de invitados (total, confirmados, rechazados, pendientes).
 * Recibe:   stats (GuestStats | null).
 * Provee:   export { GuestsStatsBar }.
 */

import type { GuestStats } from "@/types";

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-border rounded-xl px-4 py-3">
      <div className={`text-[26px] font-bold font-display ${color}`}>{value}</div>
      <div className="text-[11px] text-text/50 uppercase tracking-wide leading-tight mt-0.5">{label}</div>
    </div>
  );
}

export function GuestsStatsBar({ stats }: { stats: GuestStats | null }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <StatBox label="Invitados"               value={stats.total}     color="text-text" />
      <StatBox label="Confirmado asistencia"   value={stats.confirmed} color="text-success" />
      <StatBox label="Rechazado asistencia"    value={stats.rejected}  color="text-danger" />
      <StatBox label="Pendientes de confirmar" value={stats.pending}   color="text-cta" />
    </div>
  );
}
