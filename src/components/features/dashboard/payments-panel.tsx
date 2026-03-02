import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PaymentSchedule } from "@/types";

interface PaymentsPanelProps {
  payments: PaymentSchedule[];
}

export function PaymentsPanel({ payments }: PaymentsPanelProps) {
  return (
    <Card>
      <h3 className="text-[11px] font-bold text-accent uppercase tracking-[1px] mb-4">
        Próximos pagos
      </h3>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between py-1"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-text font-medium truncate">
                {payment.vendorName}
              </p>
              <p className="text-[11px] text-brand">
                {new Date(payment.dueDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <span className="text-[14px] font-display font-semibold text-text ml-3">
              {formatCurrency(payment.amount)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
