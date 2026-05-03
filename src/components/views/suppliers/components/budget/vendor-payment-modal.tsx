"use client";

import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { PaymentRow } from "@/components/views/budget/components/payments/payment-row";
import type { ExpenseCategory } from "@/types";

interface VendorPaymentModalProps {
  open: boolean;
  onClose: () => void;
  category: ExpenseCategory;
  currentVendorId: string;
  onRefresh: () => void;
}

export function VendorPaymentModal({
  open, onClose, category, currentVendorId, onRefresh,
}: VendorPaymentModalProps) {
  // INVOICE AMOUNT = ONLY this vendor's items (items from other vendors are excluded)
  const vendorItems  = category.items.filter((i) => i.vendorId === currentVendorId);
  const invoiceAmount = vendorItems.reduce((s, i) => s + (i.real > 0 ? i.real : i.estimated), 0);
  const totalPaid    = vendorItems.reduce((s, i) => s + i.paid, 0);
  const totalPending = Math.max(0, invoiceAmount - totalPaid);

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[22px] text-text">Calendario de pagos</h2>
          <p className="text-[13px] text-brand mt-0.5 italic">"{category.name}"</p>
        </div>
        <div className="text-right">
          <div className="font-display text-[28px] text-cta leading-tight">
            {formatCurrency(invoiceAmount)}
          </div>
          <div className="text-[11px] text-brand uppercase tracking-wider">Importe factura</div>
        </div>
      </div>

      {vendorItems.length === 0 ? (
        <p className="text-[14px] text-brand text-center py-8">Sin conceptos vinculados a este proveedor</p>
      ) : (
        <div className="max-h-[420px] overflow-y-auto pr-1 space-y-0.5">
          {vendorItems.map((item) => (
            <PaymentRow
              key={item.id}
              item={item}
              catId={category.id}
              onPaidChange={onRefresh}
            />
          ))}
        </div>
      )}

      {vendorItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-brand">{vendorItems.length} concepto{vendorItems.length !== 1 ? "s" : ""}</span>
          <div className="flex gap-4 text-[12px] font-medium">
            <span className="text-[#4A773C]">Pagado: {formatCurrency(totalPaid)}</span>
            <span className="text-cta">Pendiente: {formatCurrency(totalPending)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
