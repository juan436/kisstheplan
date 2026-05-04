/**
 * DetailPayments
 *
 * Qué hace: Gestor de pagos cuando el proveedor NO tiene un presupuesto vinculado detallado. 
 *           Permite definir el importe total contratado y planificar una lista de pagos manuales.
 * Recibe:   - vendor: Objeto Vendor con su array de payments.
 *           - linkedBudget: Objeto de verificación para alternar a vista de presupuesto vinculado.
 *           - onRefreshLinked: Refresco de datos vinculados.
 *           - addingPayment: Estado para mostrar/ocultar el formulario de nuevo pago.
 *           - newPayment / setNewPayment: Estado y setter para el nuevo pago en curso.
 *           - onTogglePaid, onUpdateDate, onUpdateNotes, onAddPayment, onDeletePayment: CRUD.
 *           - onUpdateTotalAmount: Actualiza el campo totalAmount del proveedor.
 * Provee:   - Resumen financiero (Contratado, Pagado, Restante).
 *           - Tabla editable de pagos con fechas, estados de pagado y notas.
 *           - Formulario inline para añadir nuevos pagos.
 */
import { CalendarDays, Plus, Trash2, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DetailLinkedPayments } from "./linked-payments";
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
  onUpdateTotalAmount: (amount: number) => void;
}

export function DetailPayments({
  vendor, linkedBudget, onRefreshLinked, addingPayment, setAddingPayment,
  newPayment, setNewPayment, onTogglePaid, onUpdateDate, onUpdateNotes,
  onAddPayment, onDeletePayment, onUpdateTotalAmount,
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

  const paid = vendor.payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const total = vendor.payments.reduce((s, p) => s + p.amount, 0);
  const contracted = vendor.totalAmount ?? 0;
  const remaining = contracted > 0 ? contracted - paid : total - paid;

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-card">
      <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-4">Calendario de pagos</h3>

      {/* Importe total contratado */}
      <div className="mb-4">
        <label className="text-[11px] text-brand block mb-1">Importe total contratado</label>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-text">€</span>
          <input type="number" defaultValue={contracted || ""}
            onBlur={(e) => onUpdateTotalAmount(Number(e.target.value))}
            placeholder="0"
            className="w-32 text-[14px] font-display italic text-text bg-bg2 border border-border rounded-lg px-3 py-1.5 outline-none focus:border-cta transition-colors" />
        </div>
      </div>

      {/* Summary cards */}
      {(contracted > 0 || total > 0) && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-bg2 rounded-lg p-3 text-center">
            <p className="text-[10px] text-brand uppercase tracking-wider mb-0.5">Contratado</p>
            <p className="font-display text-[16px] italic text-text">{formatCurrency(contracted || total)}</p>
          </div>
          <div className="bg-bg2 rounded-lg p-3 text-center">
            <p className="text-[10px] text-brand uppercase tracking-wider mb-0.5">Pagado</p>
            <p className="font-display text-[16px] italic" style={{ color: "#4A773C" }}>{formatCurrency(paid)}</p>
          </div>
          <div className="bg-bg2 rounded-lg p-3 text-center">
            <p className="text-[10px] text-brand uppercase tracking-wider mb-0.5">Restante</p>
            <p className="font-display text-[16px] italic" style={{ color: remaining > 0 ? "#c47a7a" : "#4A773C" }}>{formatCurrency(Math.max(0, remaining))}</p>
          </div>
        </div>
      )}

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


