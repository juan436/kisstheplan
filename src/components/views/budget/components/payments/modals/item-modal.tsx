"use client";

/**
 * ItemModal
 *
 * Qué hace: modal de pagos parciales para un único item de presupuesto.
 *           Muestra el importe de factura y abre PaymentRow en modo expandido por defecto.
 * Recibe:   open, onClose, item (ExpenseItem), catId, onRefresh.
 * Provee:   export { ItemModal } — usado cuando el usuario hace clic en un item específico.
 */

import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { PaymentRow } from "../payment-row";
import type { ExpenseItem } from "@/types";

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  item: ExpenseItem;
  catId: string;
  onRefresh: () => void;
}

export function ItemModal({ open, onClose, item, catId, onRefresh }: ItemModalProps) {
  const invoiceAmount = item.real > 0 ? item.real : item.estimated;

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
      <div className="flex items-start justify-between mb-5 shrink-0">
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

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <PaymentRow item={item} catId={catId} onPaidChange={onRefresh} defaultExpanded={true} />
      </div>
    </Modal>
  );
}
