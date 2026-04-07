"use client";

import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { PaymentItemRow } from "./payment-item-row";
import type { ExpenseCategory } from "@/types";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  paymentCat: ExpenseCategory | null;
  onRefresh: () => void;
}

export function PaymentModal({ open, onClose, paymentCat, onRefresh }: PaymentModalProps) {
  const totalReal    = paymentCat?.items.reduce((s, i) => s + i.real, 0) ?? 0;
  const totalPaid    = paymentCat?.items.reduce((s, i) => s + i.paid, 0) ?? 0;
  const totalPending = Math.max(0, totalReal - totalPaid);

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[22px] text-text">Calendario de pagos</h2>
          {paymentCat && (
            <p className="text-[13px] text-brand mt-0.5 italic">"{paymentCat.name}"</p>
          )}
        </div>
        <div className="text-right">
          <div className="font-display text-[28px] text-cta leading-tight">
            {formatCurrency(totalReal)}
          </div>
          <div className="text-[11px] text-brand uppercase tracking-wider">Total</div>
        </div>
      </div>

      {!paymentCat || paymentCat.items.length === 0 ? (
        <p className="text-[14px] text-brand text-center py-8">No hay conceptos en esta categoría</p>
      ) : (
        <div className="max-h-[420px] overflow-y-auto pr-1 space-y-0.5">
          {paymentCat.items.map((item) => (
            <PaymentItemRow key={item.id} item={item} catId={paymentCat.id} onPaidChange={onRefresh} />
          ))}
        </div>
      )}

      {paymentCat && paymentCat.items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-brand">{paymentCat.items.length} conceptos</span>
          <div className="flex gap-4 text-[12px] font-medium">
            <span className="text-[#4A773C]">Pagado: {formatCurrency(totalPaid)}</span>
            <span className="text-cta">Pendiente: {formatCurrency(totalPending)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
