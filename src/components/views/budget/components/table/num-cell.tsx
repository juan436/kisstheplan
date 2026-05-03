/**
 * NumCell
 *
 * Qué hace: celda numérica atómica; muestra un importe formateado y al hacer clic
 *           se convierte en input de edición inline.
 * Recibe:   value, isEditing, editValue, onStart, onChange, onSave, onKeyDown.
 * Provee:   export { NumCell } — usado por BudgetItemRow y vendor-budget-item-row.
 */

import { formatCurrency } from "@/lib/utils";

export function NumCell({ value, isEditing, editValue, onStart, onChange, onSave, onKeyDown }: {
  value: number; isEditing: boolean; editValue: string;
  onStart: () => void; onChange: (v: string) => void;
  onSave: () => void; onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="text-right text-[13px] text-[#866857] cursor-pointer pr-2" onClick={() => !isEditing && onStart()}>
      {isEditing ? (
        <input autoFocus type="number" value={editValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onSave} onKeyDown={onKeyDown}
          className="w-24 bg-white border border-cta rounded px-2 py-0.5 text-[13px] text-right outline-none ml-auto block"
        />
      ) : formatCurrency(value)}
    </div>
  );
}
