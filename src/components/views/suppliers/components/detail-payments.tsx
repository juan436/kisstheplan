import { CalendarDays, Plus, Trash2, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DetailLinkedPayments } from "./detail-linked-payments";
import type { Vendor, VendorPayment, VendorBudgetPaymentsResult } from "@/types";
import type { CreateVendorPaymentData } from "@/services/api";

interface DetailPaymentsProps {
  vendor: Vendor;
  linkedBudget: VendorBudgetPaymentsResult | null;
  onRefreshLinked: () => void;
  addingPayment: boolean;
  setAddingPayment: (v: boolean) => void;
  newPayment: Partial<CreateVendorPaymentData>;
  setNewPayment: React.Dispatch<React.SetStateAction<Partial<CreateVendorPaymentData>>>;
  onTogglePaid: (p: VendorPayment) => void;
  onUpdateDate: (paymentId: string, dueDate: string) => void;
  onUpdateNotes: (paymentId: string, notes: string) => void;
  onAddPayment: () => void;
  onDeletePayment: (id: string) => void;
}

export function DetailPayments({
  vendor, linkedBudget, onRefreshLinked, addingPayment, setAddingPayment,
  newPayment, setNewPayment, onTogglePaid, onUpdateDate, onUpdateNotes,
  onAddPayment, onDeletePayment,
}: DetailPaymentsProps) {
  if (linkedBudget?.isLinked) {
    return (
      <DetailLinkedPayments
        linkedItems={linkedBudget.linkedItems}
        payments={linkedBudget.payments}
        onRefresh={onRefreshLinked}
      />
    );
  }

  const total = vendor.payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Calendario de pagos</h3>
        {total > 0 && <span className="font-display text-[18px] italic text-text">{formatCurrency(total)}</span>}
      </div>

      {vendor.payments.length === 0 && !addingPayment ? (
        <p className="text-[13px] text-brand text-center py-4">Sin pagos registrados</p>
      ) : (
        <table className="w-full mb-3">
          <thead>
            <tr className="border-b border-border">
              {["Cantidad", "A pagar el", "Pagado", "Notas", ""].map((h) => (
                <th key={h} className="text-left text-[10px] font-bold text-brand uppercase tracking-wider pb-2 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendor.payments.map((p) => (
              <tr key={p.id} className="border-b border-border/40">
                <td className="py-2 pr-3 text-[13px] text-text font-medium">{formatCurrency(p.amount)}</td>
                <td className="py-2 pr-3">
                  {p.dueDate ? (
                    <input type="date" defaultValue={p.dueDate} onBlur={(e) => onUpdateDate(p.id, e.target.value)}
                      className="text-[12px] text-text bg-transparent border-b border-border/50 outline-none focus:border-cta" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <CalendarDays size={13} className="text-brand" />
                      <input type="date" onBlur={(e) => e.target.value && onUpdateDate(p.id, e.target.value)}
                        className="text-[12px] text-brand bg-transparent outline-none w-0 opacity-0 focus:w-auto focus:opacity-100 transition-all" />
                    </div>
                  )}
                </td>
                <td className="py-2 pr-3">
                  <button onClick={() => onTogglePaid(p)} className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: p.paid ? "#4A773C" : "#D4C9B8", backgroundColor: p.paid ? "#4A773C" : "transparent" }}>
                    {p.paid && <Check size={11} className="text-white" />}
                  </button>
                </td>
                <td className="py-2 pr-3">
                  <input defaultValue={p.notes || ""} onBlur={(e) => onUpdateNotes(p.id, e.target.value)}
                    placeholder="Notas..." className="text-[12px] text-text bg-transparent border-b border-border/40 outline-none focus:border-cta w-full" />
                </td>
                <td className="py-2">
                  <button onClick={() => onDeletePayment(p.id)} className="text-brand hover:text-danger transition-colors">
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
            {addingPayment && (
              <tr className="border-b border-border/40">
                <td className="py-2 pr-3">
                  <input type="number" placeholder="0" value={newPayment.amount || ""}
                    onChange={(e) => setNewPayment((p) => ({ ...p, amount: Number(e.target.value) }))}
                    className="w-20 text-[13px] text-text bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-cta" />
                </td>
                <td className="py-2 pr-3">
                  <input type="date" value={newPayment.dueDate || ""}
                    onChange={(e) => setNewPayment((p) => ({ ...p, dueDate: e.target.value }))}
                    className="text-[12px] text-text bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-cta" />
                </td>
                <td className="py-2 pr-3"><div className="w-6 h-6 rounded-full border-2 border-border" /></td>
                <td className="py-2 pr-3">
                  <input placeholder="Notas..." value={newPayment.notes || ""}
                    onChange={(e) => setNewPayment((p) => ({ ...p, notes: e.target.value }))}
                    className="text-[12px] text-text bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-cta w-full" />
                </td>
                <td className="py-2 flex gap-1">
                  <button onClick={onAddPayment} className="text-[11px] bg-accent text-white px-2 py-0.5 rounded">OK</button>
                  <button onClick={() => { setAddingPayment(false); setNewPayment({}); }} className="text-[11px] text-brand hover:text-danger">✕</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {!addingPayment && (
        <button onClick={() => setAddingPayment(true)} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors">
          <Plus size={12} />Añadir pago
        </button>
      )}
    </div>
  );
}
