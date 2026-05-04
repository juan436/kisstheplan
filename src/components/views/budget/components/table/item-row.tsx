"use client";

/**
 * ItemRow
 *
 * Qué hace: fila de un concepto de presupuesto. Click en concepto abre calendario de pagos.
 *           Botón editar unifica edición de nombre y proveedor en un solo gesto.
 * Recibe:   item, catId, vendors, handlers de edición/delete/pagos/link-vendor.
 * Provee:   export { ItemRow } — usado por CategoryCard.
 */

import { useState, useEffect } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNavigation } from "@/hooks/useNavigation";
import { NumCell } from "./num-cell";
import type { ExpenseItem, Vendor } from "@/types";

interface ItemRowProps {
  item: ExpenseItem;
  catId: string;
  vendors: Vendor[];
  isEditing: (id: string, field: string) => boolean;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (id: string, field: string, value: number | string) => void;
  saveEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  cancelEdit: () => void;
  handleDeleteItem: (catId: string, itemId: string) => void;
  openPayments: (catId: string, itemId: string) => void;
  onLinkVendor: (itemId: string, vendorId: string | null, vendorName: string | null) => void;
}

export function ItemRow({
  item, catId, vendors, isEditing, editValue, setEditValue, startEdit, saveEdit,
  handleKeyDown, cancelEdit, deletingId, setDeletingId, handleDeleteItem, openPayments, onLinkVendor,
}: ItemRowProps) {
  const { navigateTo } = useNavigation();
  const [changingVendor, setChangingVendor] = useState(false);
  const diff    = item.estimated - item.real;
  const pending = item.real - item.paid;

  const isEditingItem = isEditing(item.id, "concept");

  useEffect(() => {
    if (!isEditingItem) setChangingVendor(false);
  }, [isEditingItem]);

  const handleEditClick = () => {
    if (isEditingItem) { cancelEdit(); setChangingVendor(false); return; }
    startEdit(item.id, "concept", item.concept);
    setChangingVendor(true);
  };

  return (
    <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 py-2.5 border-b border-border/50 hover:bg-bg2 transition-colors group/item items-center">
      <div className="flex items-center gap-2 pl-6">
        <div className="flex-1 min-w-0">
          {isEditing(item.id, "concept") ? (
            <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit} onKeyDown={handleKeyDown}
              className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] outline-none w-full" />
          ) : (
            <span className="text-[13px] text-[#866857] cursor-pointer hover:text-cta transition-colors block truncate"
              onClick={() => openPayments(catId, item.id)}>{item.concept}</span>
          )}
          {item.vendorName && !changingVendor ? (
            <button onClick={() => navigateTo("proveedores", item.vendorId ?? undefined)}
              className="text-[11px] text-cta hover:underline cursor-pointer leading-tight block truncate mt-0.5">
              {item.vendorName}
            </button>
          ) : changingVendor && vendors.length > 0 && (
            <select value={item.vendorId ?? ""}
              onChange={(e) => {
                if (e.target.value === "__unlink__") { onLinkVendor(item.id, null, null); }
                else if (e.target.value) { const v = vendors.find((x) => x.id === e.target.value); if (v) onLinkVendor(item.id, v.id, v.name); }
                setChangingVendor(false);
              }}
              onBlur={() => setTimeout(() => setChangingVendor(false), 150)}
              className="text-[11px] text-[#866857] bg-white border border-border rounded outline-none cursor-pointer mt-0.5 w-full">
              <option value="">{item.vendorName ? "Cambiar proveedor..." : "Añadir proveedor..."}</option>
              {item.vendorName && <option value="__unlink__">— Sin proveedor —</option>}
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          )}
        </div>
        {deletingId === `item-${item.id}` ? (
          <span className="flex items-center gap-1 shrink-0">
            <button onClick={() => handleDeleteItem(catId, item.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
            <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
          </span>
        ) : (
          <span className={`flex items-center gap-1 transition-all shrink-0 ${isEditingItem ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}>
            <button onClick={handleEditClick} className="text-brand hover:text-accent transition-colors">
              {isEditingItem ? <X size={12} /> : <Pencil size={12} />}
            </button>
            <button onClick={() => setDeletingId(`item-${item.id}`)} className="text-brand hover:text-danger transition-colors">
              <Trash2 size={12} />
            </button>
          </span>
        )}
      </div>

      <NumCell value={item.estimated} isEditing={isEditing(item.id, "estimated")} editValue={editValue}
        onStart={() => startEdit(item.id, "estimated", item.estimated)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
      <NumCell value={item.real} isEditing={isEditing(item.id, "actual")} editValue={editValue}
        onStart={() => startEdit(item.id, "actual", item.real)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />

      <div className="text-right text-[13px] font-medium pr-2"
        style={{ color: diff < 0 ? "var(--color-danger)" : diff > 0 ? "var(--color-success)" : "var(--color-text)" }}>
        {diff > 0 ? "+" : ""}{formatCurrency(diff)}
      </div>
      <div className="text-right text-[13px] text-[#866857] pr-2 cursor-pointer hover:text-cta transition-colors"
        onClick={() => openPayments(catId, item.id)} title="Ver calendario de pagos">
        {formatCurrency(item.paid)}
      </div>
      <div className="text-right text-[13px] text-[#866857] pr-2 cursor-pointer hover:text-cta transition-colors"
        onClick={() => openPayments(catId, item.id)} title="Ver calendario de pagos">
        {formatCurrency(pending)}
      </div>
    </div>
  );
}
