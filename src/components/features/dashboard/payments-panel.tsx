import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PaymentSchedule } from "@/types";

interface PaymentsPanelProps {
  payments: PaymentSchedule[];
  onNavigate?: () => void;
  className?: string;
}

function formatShortDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function daysUntilPayment(iso: string): { label: string; urgent: boolean } {
  const diff = Math.ceil(
    (new Date(iso + "T12:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return { label: "Vencido", urgent: true };
  if (diff === 0) return { label: "Hoy", urgent: true };
  return { label: formatShortDate(iso), urgent: diff <= 7 };
}

export function PaymentsPanel({ payments, onNavigate, className }: PaymentsPanelProps) {
  const totalPending = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <Card padding="none" className={cn("flex flex-col overflow-hidden", className)}>
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 border-b border-border/50 shrink-0"
        style={onNavigate ? { cursor: "pointer" } : undefined}
        onClick={onNavigate}
        title={onNavigate ? "Ver presupuesto" : undefined}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-[1px]">
            Próximos pagos
          </h3>
          {payments.length > 0 && (
            <span className="text-[11px] text-brand font-medium">
              {formatCurrency(totalPending)}
            </span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {payments.length === 0 ? (
        <div className="flex-1 px-4 py-5 flex flex-col items-center justify-center gap-2 text-center min-h-[132px]">
          <p className="text-[12px] text-brand/70">Sin pagos programados</p>
          {onNavigate && (
            <button
              onClick={onNavigate}
              className="text-[12px] font-medium underline underline-offset-2 transition-colors hover:opacity-80"
              style={{ color: "var(--color-cta)" }}
            >
              Introducir pagos →
            </button>
          )}
        </div>
      ) : (
        /* Lista scrollable */
        <div className="overflow-y-auto max-h-[148px] px-4 py-3 space-y-3 scrollbar-thin">
          {payments.map((payment) => {
            const { label, urgent } = daysUntilPayment(payment.dueDate);
            const concept = payment.concept && payment.concept !== payment.vendorName
              ? payment.concept
              : null;

            return (
              <div key={payment.id} className="flex items-center gap-2.5">
                {/* Indicador */}
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: urgent ? "var(--color-danger)" : "var(--color-cta)" }}
                />

                {/* Nombre + concepto */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-text font-medium truncate leading-tight">
                    {payment.vendorName}
                  </p>
                  {concept && (
                    <p className="text-[11px] truncate" style={{ color: "var(--color-brand)" }}>
                      {concept}
                    </p>
                  )}
                </div>

                {/* Importe + fecha */}
                <div className="text-right shrink-0">
                  <p
                    className="text-[13px] font-semibold"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--color-text)" }}
                  >
                    {formatCurrency(payment.amount)}
                  </p>
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: urgent ? "var(--color-danger)" : "var(--color-brand)" }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
