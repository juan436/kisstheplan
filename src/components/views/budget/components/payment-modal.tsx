"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, Check } from "lucide-react";
import type { ExpenseCategory, ExpenseItem } from "@/types";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  paymentCat: ExpenseCategory | null;
  pendingDates: Record<string, string>;
  pendingNotes: Record<string, string>;
  setPendingDates: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setPendingNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  savingModal: boolean;
  handleTogglePaid: (item: ExpenseItem) => void;
  handleSaveModal: () => void;
}

export function PaymentModal({ open, onClose, paymentCat, pendingDates, pendingNotes, setPendingDates, setPendingNotes, savingModal, handleTogglePaid, handleSaveModal }: PaymentModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-[22px] text-text">Calendario de pagos</h2>
          {paymentCat && <p className="text-[13px] text-brand mt-0.5 italic">"{paymentCat.name}"</p>}
        </div>
        <div className="text-right">
          <div className="font-display text-[28px] text-cta leading-tight">
            {formatCurrency(paymentCat?.items.reduce((s, i) => s + i.real, 0) ?? 0)}
          </div>
          <div className="text-[11px] text-brand uppercase tracking-wider">Total</div>
        </div>
      </div>

      {paymentCat && paymentCat.items.length > 0 && (
        <div className="grid grid-cols-[1fr_90px_110px_36px_120px] gap-2 px-2 mb-1">
          {["Concepto", "Cantidad", "A pagar el", "✓", "Notas"].map((h, i) => (
            <div key={i} className="text-[10px] font-semibold text-brand uppercase tracking-wider">{h}</div>
          ))}
        </div>
      )}

      {!paymentCat || paymentCat.items.length === 0 ? (
        <p className="text-[14px] text-brand text-center py-8">No hay conceptos en esta categoría</p>
      ) : (
        <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
          {paymentCat.items.map((item) => {
            const isPaid   = item.real > 0 && item.paid >= item.real;
            const dateVal  = pendingDates[item.id] ?? item.dueDate ?? "";
            const notesVal = pendingNotes[item.id] ?? item.notes  ?? "";
            return (
              <div key={item.id} className="grid grid-cols-[1fr_90px_110px_36px_120px] gap-2 items-center px-2 py-2.5 rounded-xl hover:bg-bg2 transition-colors">
                <span className={`text-[13px] truncate ${isPaid ? "line-through text-brand/50" : "text-text"}`}>{item.concept}</span>
                <span className="text-right text-[13px] font-semibold text-[#866857]">{formatCurrency(item.real)}</span>
                <div className="flex items-center gap-1.5">
                  {!dateVal && <CalendarDays size={14} className="text-brand/40 shrink-0" />}
                  <input type="date" value={dateVal}
                    onChange={(e) => setPendingDates((p) => ({ ...p, [item.id]: e.target.value }))}
                    className="flex-1 min-w-0 bg-transparent border-b border-border/50 focus:border-cta text-[12px] text-text outline-none py-0.5 cursor-pointer" />
                </div>
                <button onClick={() => handleTogglePaid(item)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isPaid ? "bg-[#4A773C] border-[#4A773C] text-white" : "border-border hover:border-cta"}`}>
                  {isPaid && <Check size={13} strokeWidth={3} />}
                </button>
                <input value={notesVal}
                  onChange={(e) => setPendingNotes((p) => ({ ...p, [item.id]: e.target.value }))}
                  placeholder="Notas..."
                  className="bg-transparent border-b border-border/50 focus:border-cta text-[12px] text-text/70 outline-none px-1 py-0.5 transition-colors placeholder:text-text/20 w-full" />
              </div>
            );
          })}
        </div>
      )}

      {paymentCat && paymentCat.items.length > 0 && (() => {
        const totalReal    = paymentCat.items.reduce((s, i) => s + i.real, 0);
        const totalPaid    = paymentCat.items.reduce((s, i) => s + i.paid, 0);
        const totalPending = paymentCat.items.reduce((s, i) => s + Math.max(0, i.real - i.paid), 0);
        const countPaid    = paymentCat.items.filter((i) => i.real > 0 && i.paid >= i.real).length;
        const hasPending   = Object.keys(pendingDates).length > 0 || Object.keys(pendingNotes).length > 0;
        return (
          <div className="mt-5 pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-brand">{countPaid} de {paymentCat.items.length} pagados · {formatCurrency(totalReal)} total</span>
              <div className="flex gap-4 text-[12px] font-medium">
                <span className="text-[#4A773C]">Pagado: {formatCurrency(totalPaid)}</span>
                <span className="text-cta">Pendiente: {formatCurrency(totalPending)}</span>
              </div>
            </div>
            <Button variant="cta" className="w-full" onClick={handleSaveModal} disabled={savingModal || !hasPending}>
              {savingModal ? "Guardando..." : hasPending ? "Guardar cambios" : "Sin cambios pendientes"}
            </Button>
          </div>
        );
      })()}
    </Modal>
  );
}
