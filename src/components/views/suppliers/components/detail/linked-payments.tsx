/**
 * DetailLinkedPayments
 * QuÃ© hace: lista de pagos vinculados a conceptos del presupuesto del proveedor.
 * Recibe:   linkedItems, payments, onRefresh.
 * Provee:   export { DetailLinkedPayments }.
 */
"use client";

import { Paperclip } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PaymentRow } from "@/components/views/budget/components/payments/payment-row";
import type { LinkedBudgetItem, ItemPayment } from "@/types";

interface DetailLinkedPaymentsProps {
  linkedItems: LinkedBudgetItem[];
  payments: ItemPayment[];
  onRefresh: () => void;
}

export function DetailLinkedPayments({ linkedItems, payments, onRefresh }: DetailLinkedPaymentsProps) {
  const total        = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid    = payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Calendario de pagos</h3>
        {total > 0 && <span className="font-display text-[18px] italic text-text">{formatCurrency(total)}</span>}
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Paperclip size={11} className="text-brand" />
        <span className="text-[11px] text-brand">Vinculado al presupuesto</span>
      </div>

      {linkedItems.length === 0 ? (
        <p className="text-[13px] text-brand text-center py-4">Sin conceptos vinculados</p>
      ) : (
        <div className="space-y-0.5">
          {linkedItems.map((linkedItem) => (
            <PaymentRow
              key={linkedItem.itemId}
              item={{
                id: linkedItem.itemId,
                categoryId: linkedItem.catId,
                concept: linkedItem.concept,
                estimated: linkedItem.real,
                real: linkedItem.real,
                paid: payments
                  .filter((p) => p.itemId === linkedItem.itemId && p.paid)
                  .reduce((s, p) => s + p.amount, 0),
              }}
              catId={linkedItem.catId}
              onPaidChange={onRefresh}
            />
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="mt-3 pt-3 border-t border-border flex gap-4 text-[12px] font-medium justify-end">
          <span className="text-[#4A773C]">Pagado: {formatCurrency(totalPaid)}</span>
          <span className="text-cta">Pendiente: {formatCurrency(totalPending)}</span>
        </div>
      )}
    </div>
  );
}


