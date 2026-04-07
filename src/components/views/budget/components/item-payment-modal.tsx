"use client";

import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { PaymentItemRow } from "./payment-item-row";
import type { ExpenseItem } from "@/types";

interface ItemPaymentModalProps {
  open: boolean;
  onClose: () => void;
  item: ExpenseItem;
  catId: string;
  onRefresh: () => void;
}

export function ItemPaymentModal({ open, onClose, item, catId, onRefresh }: ItemPaymentModalProps) {
  const invoiceAmount = item.real > 0 ? item.real : item.estimated;

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-[22px] text-text">Pagos parciales</h2>
          <p className="text-[13px] text-brand mt-0.5 italic truncate max-w-[240px]">{item.concept}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-[28px] text-cta leading-tight">
            {formatCurrency(invoiceAmount)}
          </div>
          <div className="text-[11px] text-brand uppercase tracking-wider">Importe factura</div>
        </div>
      </div>

      <PaymentItemRow
        item={item}
        catId={catId}
        onPaidChange={onRefresh}
        defaultExpanded={true}
      />
    </Modal>
  );
}
