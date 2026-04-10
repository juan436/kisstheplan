import { formatCurrency } from "@/lib/utils";

export function TotalBox({ label, value, color = "text-text", signed = false }: {
  label: string; value: number; color?: string; signed?: boolean;
}) {
  const display     = `${signed && value > 0 ? "+" : ""}${formatCurrency(value)}`;
  const actualColor = signed ? (value < 0 ? "text-danger" : value > 0 ? "text-success" : color) : color;
  return (
    <div className="bg-white border border-border rounded-2xl px-5 py-4 text-center shadow-card">
      <div className={`font-display text-[22px] font-semibold ${actualColor}`}>{display}</div>
      <div className="text-[11px] text-brand uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
