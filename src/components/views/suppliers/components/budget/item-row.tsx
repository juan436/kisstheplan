/**
 * ItemRow
 *
 * Qué hace: Fila individual de concepto de presupuesto. Proporciona edición inline de importes 
 *           (estimado vs real), visualización de diferencias, estado de pago y vinculación dinámica
 *           de proveedores mediante un selector interactivo.
 * Recibe:   - item: Objeto ExpenseItem con los datos financieros.
 *           - catId: ID de la categoría a la que pertenece el ítem.
 *           - isMyVendor: Booleano que indica si el ítem pertenece al proveedor actualmente visualizado.
 *           - vendors: Lista de proveedores para el selector de vinculación.
 *           - isEditing, editValue, startEdit, saveEdit, etc: Utilidades de edición inline.
 *           - openPayments: Función para abrir el modal de desglose de pagos.
 *           - onLinkVendor: Función para cambiar o desvincular el proveedor del ítem.
 * Provee:   - Celda de concepto con soporte para navegación a otros proveedores.
 *           - Celdas numéricas editables (NumCell) si el ítem pertenece al proveedor actual.
 *           - Feedback visual de ahorro/exceso de gasto.
 */

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNavigation } from "@/hooks/useNavigation";
import { NumCell } from "@/components/views/budget/components/table/num-cell";
import type { ExpenseItem, Vendor } from "@/types";
import type { VendorBudgetEditState } from "../../hooks/use-vendor-budget";

interface VendorBudgetItemRowProps extends VendorBudgetEditState {
  item: ExpenseItem;
  catId: string;
  isMyVendor: boolean;
  vendors: Vendor[];
  openPayments: (catId: string) => void;
  onLinkVendor: (catId: string, itemId: string, vendorId: string | null, vendorName: string | null) => void;
}

export function ItemRow({
  item, catId, isMyVendor, vendors,
  isEditing, editValue, setEditValue, startEdit, saveEdit, handleKeyDown,
  deletingId, setDeletingId, handleDeleteItem,
  openPayments, onLinkVendor,
}: VendorBudgetItemRowProps) {
  const { navigateTo } = useNavigation();
  const [changingVendor, setChangingVendor] = useState(false);
  const diff    = item.estimated - item.real;
  const pending = item.real - item.paid;

  const rowBg = isMyVendor ? "hover:bg-bg2" : "bg-[#f5efe9]";

  return (
    <div className={`grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 py-2.5 border-b border-border/50 transition-colors group/item items-center ${rowBg}`}>

      <div className="flex items-center gap-2 pl-6">
        <div className="flex-1 min-w-0">
          {isMyVendor && isEditing(item.id, "concept") ? (
            <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit} onKeyDown={handleKeyDown}
              className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] outline-none w-full" />
          ) : (
            <span
              className={`text-[13px] text-[#866857] block truncate transition-colors ${isMyVendor ? "cursor-pointer hover:text-cta" : ""}`}
              onClick={() => isMyVendor && startEdit(item.id, "concept", item.concept)}>
              {item.concept}
            </span>
          )}

          {!isMyVendor && (
            item.vendorName && !changingVendor ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  onClick={() => navigateTo("proveedores", item.vendorId ?? undefined)}
                  className="text-[11px] text-cta hover:underline cursor-pointer leading-tight block truncate">
                  {item.vendorName}
                </button>
                <button
                  onClick={() => setChangingVendor(true)}
                  className="text-[#866857]/50 hover:text-accent transition-colors shrink-0">
                  <Pencil size={10} />
                </button>
              </div>
            ) : vendors.length > 0 && (
              <select value="" onBlur={() => setChangingVendor(false)}
                onChange={(e) => {
                  if (e.target.value === "__unlink__") onLinkVendor(catId, item.id, null, null);
                  else if (e.target.value) {
                    const v = vendors.find((x) => x.id === e.target.value);
                    if (v) onLinkVendor(catId, item.id, v.id, v.name);
                  }
                  setChangingVendor(false);
                }}
                className="text-[11px] text-brand/50 bg-transparent outline-none cursor-pointer hover:text-cta transition-colors mt-0.5">
                <option value="">{item.vendorName ? "Seleccionar..." : "Añadir proveedor..."}</option>
                {item.vendorName && <option value="__unlink__">— Sin proveedor —</option>}
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            )
          )}
        </div>

        {isMyVendor && (
          deletingId === `item-${item.id}` ? (
            <span className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleDeleteItem(catId, item.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
              <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
            </span>
          ) : (
            <button onClick={() => setDeletingId(`item-${item.id}`)} className="opacity-0 group-hover/item:opacity-100 text-brand hover:text-danger transition-all shrink-0">
              <Trash2 size={12} />
            </button>
          )
        )}
      </div>

      {isMyVendor
        ? <NumCell value={item.estimated} isEditing={isEditing(item.id, "estimated")} editValue={editValue}
            onStart={() => startEdit(item.id, "estimated", item.estimated)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
        : <div className="text-right text-[13px] text-[#866857] pr-2">{formatCurrency(item.estimated)}</div>}

      {isMyVendor
        ? <NumCell value={item.real} isEditing={isEditing(item.id, "actual")} editValue={editValue}
            onStart={() => startEdit(item.id, "actual", item.real)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
        : <div className="text-right text-[13px] text-[#866857] pr-2">{formatCurrency(item.real)}</div>}

      <div className="text-right text-[13px] font-medium pr-2"
        style={{ color: diff < 0 ? "var(--color-danger)" : diff > 0 ? "var(--color-success)" : "var(--color-text)" }}>
        {diff > 0 ? "+" : ""}{formatCurrency(diff)}
      </div>

      <div className={`text-right text-[13px] text-[#866857] pr-2 ${isMyVendor ? "cursor-pointer hover:text-cta transition-colors" : ""}`}
        onClick={() => isMyVendor && openPayments(catId)} title={isMyVendor ? "Ver pagos" : undefined}>
        {formatCurrency(item.paid)}
      </div>

      <div className={`text-right text-[13px] text-[#866857] pr-2 ${isMyVendor ? "cursor-pointer hover:text-cta transition-colors" : ""}`}
        onClick={() => isMyVendor && openPayments(catId)} title={isMyVendor ? "Ver pagos" : undefined}>
        {formatCurrency(pending)}
      </div>
    </div>
  );
}
