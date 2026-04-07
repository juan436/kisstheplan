"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useItemPayments } from "../hooks/use-item-payments";
import { AddPaymentForm } from "./add-payment-form";
import type { ExpenseItem } from "@/types";

interface PaymentItemRowProps {
  item: ExpenseItem;
  catId: string;
  onPaidChange: () => void;
  defaultExpanded?: boolean;
}

export function PaymentItemRow({ item, catId, onPaidChange, defaultExpanded = false }: PaymentItemRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hook = useItemPayments(catId, item.id, item.real);

  useEffect(() => {
    if (expanded) hook.load();
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async (payment: Parameters<typeof hook.togglePaid>[0]) => {
    await hook.togglePaid(payment);
    onPaidChange();
  };

  return (
    <div className="border-b border-border/30 last:border-b-0">
      <div className="flex items-center gap-2 px-2 py-2.5 hover:bg-bg2 transition-colors rounded-lg">
        <button onClick={() => setExpanded((v) => !v)} className="text-brand hover:text-text transition-colors shrink-0">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <span className="flex-1 text-[13px] text-text truncate">{item.concept}</span>
        <span className="text-[13px] font-semibold text-[#866857] shrink-0">{formatCurrency(item.real)}</span>
        <div className="flex gap-3 text-[12px] shrink-0">
          <span className="text-[#4A773C] font-medium">✓ {formatCurrency(hook.totalPaid)}</span>
          <span className="text-cta font-medium">⭕ {formatCurrency(hook.totalPending)}</span>
        </div>
      </div>

      {expanded && (
        <div className="pl-6 pr-2 pb-2 space-y-1">
          {hook.loading && <p className="text-[12px] text-brand py-1">Cargando...</p>}

          {hook.payments.map((payment) => (
            <div key={payment.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg2 transition-colors group/prow">
              <button onClick={() => handleToggle(payment)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${payment.paid ? "bg-[#4A773C] border-[#4A773C] text-white" : "border-border hover:border-cta"}`}>
                {payment.paid && <Check size={11} strokeWidth={3} />}
              </button>
              <span className={`flex-1 text-[12px] truncate ${payment.paid ? "line-through text-brand/50" : "text-text"}`}>{payment.concept}</span>
              <span className="text-[12px] font-semibold text-[#866857] shrink-0">{formatCurrency(payment.amount)}</span>
              <span className="text-[11px] text-brand/70 shrink-0">{payment.dueDate}</span>
              {hook.deleting === payment.id ? (
                <span className="flex items-center gap-1 shrink-0">
                  <button onClick={() => hook.deletePayment(payment.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                  <button onClick={() => hook.setDeleting(null)} className="text-[11px] text-brand hover:underline">No</button>
                </span>
              ) : (
                <button onClick={() => hook.setDeleting(payment.id)}
                  className="opacity-0 group-hover/prow:opacity-100 text-brand hover:text-danger transition-all shrink-0">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}

          {hook.payments.length > 0 && (
            <div className="flex gap-3 text-[11px] px-2 py-1 text-brand/70">
              <span>Sin asignar: <span className={hook.unassigned > 0 ? "text-cta font-medium" : "text-[#4A773C] font-medium"}>{formatCurrency(hook.unassigned)}</span></span>
            </div>
          )}

          {hook.showForm ? (
            <AddPaymentForm suggestedAmount={hook.suggestedNext}
              onAdd={async (...args) => { await hook.addPayment(...args); onPaidChange(); }}
              onCancel={() => hook.setShowForm(false)} />
          ) : (
            <button onClick={() => hook.setShowForm(true)}
              className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors px-2 py-1">
              <Plus size={12} />Añadir pago
            </button>
          )}
        </div>
      )}
    </div>
  );
}
