"use client";

import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { PaymentItemRow } from "@/components/views/budget/components/payments/payment-item-row";
import type { ExpenseCategory } from "@/types";

interface VendorAllPaymentsModalProps {
  open: boolean;
  onClose: () => void;
  categories: ExpenseCategory[];
  currentVendorId: string;
  vendorName: string;
  onRefresh: () => void;
}

export function VendorAllPaymentsModal({
  open, onClose, categories, currentVendorId, vendorName, onRefresh,
}: VendorAllPaymentsModalProps) {
  const catData = categories.map((cat) => {
    const items = cat.items.filter((i) => i.vendorId === currentVendorId);
    return { cat, items };
  }).filter((d) => d.items.length > 0);

  const allItems      = catData.flatMap((d) => d.items);
  const invoiceAmount = allItems.reduce((s, i) => s + (i.real > 0 ? i.real : i.estimated), 0);
  const totalPaid     = allItems.reduce((s, i) => s + i.paid, 0);
  const totalPending  = Math.max(0, invoiceAmount - totalPaid);

  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[22px] text-text">Calendario de pagos</h2>
          <p className="text-[13px] text-brand mt-0.5 italic">{vendorName}</p>
        </div>
        <div className="text-right">
          <div className="font-display text-[28px] text-cta leading-tight">
            {formatCurrency(invoiceAmount)}
          </div>
          <div className="text-[11px] text-brand uppercase tracking-wider">Importe total</div>
        </div>
      </div>

      {/* Body */}
      {catData.length === 0 ? (
        <p className="text-[14px] text-brand text-center py-8">Sin conceptos vinculados a este proveedor</p>
      ) : (
        <div className="max-h-[460px] overflow-y-auto pr-1 space-y-4">
          {catData.map(({ cat, items }) => (
            <div key={cat.id}>
              <div className="text-[11px] font-semibold text-brand uppercase tracking-wider mb-1.5 px-1">
                {cat.name}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <PaymentItemRow
                    key={item.id}
                    item={item}
                    catId={cat.id}
                    onPaidChange={onRefresh}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {allItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-brand">{allItems.length} concepto{allItems.length !== 1 ? "s" : ""}</span>
          <div className="flex gap-4 text-[12px] font-medium">
            <span className="text-[#4A773C]">Pagado: {formatCurrency(totalPaid)}</span>
            <span className="text-cta">Pendiente: {formatCurrency(totalPending)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
