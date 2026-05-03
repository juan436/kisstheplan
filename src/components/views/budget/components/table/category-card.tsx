"use client";

/**
 * CategoryCard
 *
 * Qué hace: card colapsable de una categoría de presupuesto; muestra nombre editable,
 *           lista de items (ItemRow), fila de subtotales y botón para añadir concepto.
 * Recibe:   cat (ExpenseCategory), vendors, estado de colapso, handlers de edición/delete/pagos.
 * Provee:   export { CategoryCard } — usado por BudgetTable.
 */

import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseCategory, Vendor } from "@/types";
import { ItemRow } from "./item-row";

interface CategoryCardProps {
  cat: ExpenseCategory;
  vendors: Vendor[];
  isOpen: boolean;
  onToggle: () => void;
  isEditing: (id: string, field: string) => boolean;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (id: string, field: string, value: number | string) => void;
  saveEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  addingItemToCat: string | null;
  newItemName: string;
  setAddingItemToCat: (id: string | null) => void;
  setNewItemName: (name: string) => void;
  handleAddItem: (catId: string) => void;
  handleDeleteCat: (id: string) => void;
  handleDeleteItem: (catId: string, itemId: string) => void;
  openPayments: (catId: string) => void;
  onLinkVendor: (itemId: string, vendorId: string | null, vendorName: string | null) => void;
}

export function CategoryCard({
  cat, vendors, isOpen, onToggle,
  isEditing, editValue, setEditValue, startEdit, saveEdit, handleKeyDown,
  deletingId, setDeletingId, addingItemToCat, newItemName,
  setAddingItemToCat, setNewItemName, handleAddItem,
  handleDeleteCat, handleDeleteItem, openPayments, onLinkVendor,
}: CategoryCardProps) {
  const catEst  = cat.items.reduce((s, i) => s + i.estimated, 0);
  const catReal = cat.items.reduce((s, i) => s + i.real, 0);
  const catPaid = cat.items.reduce((s, i) => s + i.paid, 0);
  const catDiff = catEst - catReal;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden group/card">
      <div className="flex items-center gap-2 px-4 py-3 bg-bg2 relative">
        <button onClick={onToggle} className="text-brand hover:text-text transition-colors">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isEditing(cat.id, "catName") ? (
          <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit} onKeyDown={handleKeyDown}
            className="bg-white border border-cta rounded px-2 py-0.5 text-[14px] font-semibold text-text outline-none flex-1" />
        ) : (
          <button className="text-[14px] font-semibold text-text hover:text-cta transition-colors cursor-pointer flex-1 text-left"
            onClick={() => openPayments(cat.id)}
            onDoubleClick={() => startEdit(cat.id, "catName", cat.name)}
            title="Clic: ver pagos · Doble clic: editar nombre">
            {cat.name}
          </button>
        )}
        <span className="text-[13px] font-semibold text-[#866857] mr-6">{formatCurrency(catReal)}</span>
        {deletingId === `cat-${cat.id}` ? (
          <span className="flex items-center gap-1 absolute right-3">
            <button onClick={() => handleDeleteCat(cat.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
            <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
          </span>
        ) : (
          <button onClick={() => setDeletingId(`cat-${cat.id}`)}
            className="absolute right-3 opacity-0 group-hover/card:opacity-100 transition-opacity text-brand hover:text-danger">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div>
          {cat.items.map((item) => (
            <ItemRow key={item.id} item={item} catId={cat.id} vendors={vendors}
              isEditing={isEditing} editValue={editValue} setEditValue={setEditValue}
              startEdit={startEdit} saveEdit={saveEdit} handleKeyDown={handleKeyDown}
              deletingId={deletingId} setDeletingId={setDeletingId}
              handleDeleteItem={handleDeleteItem} openPayments={openPayments}
              onLinkVendor={onLinkVendor} />
          ))}
          <div className="px-4 py-2 pl-10 border-b border-border/50">
            {addingItemToCat === cat.id ? (
              <div className="flex items-center gap-2">
                <input autoFocus value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(cat.id); if (e.key === "Escape") { setAddingItemToCat(null); setNewItemName(""); } }}
                  placeholder="Nombre del concepto..."
                  className="bg-white border border-cta rounded px-2 py-1 text-[13px] text-text outline-none w-48" />
                <Button variant="cta" size="sm" onClick={() => handleAddItem(cat.id)}>Añadir</Button>
                <Button variant="ghost" size="sm" onClick={() => { setAddingItemToCat(null); setNewItemName(""); }}>Cancelar</Button>
              </div>
            ) : (
              <button onClick={() => setAddingItemToCat(cat.id)} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors">
                <Plus size={12} />Añadir concepto
              </button>
            )}
          </div>
          <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 py-2 bg-bg2 items-center">
            <div className="pl-6 text-[12px] font-semibold text-accent">Subtotal</div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2">{formatCurrency(catEst)}</div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2">{formatCurrency(catReal)}</div>
            <div className="text-right text-[12px] font-semibold pr-2" style={{ color: catDiff < 0 ? "var(--color-danger)" : catDiff > 0 ? "var(--color-success)" : "var(--color-accent)" }}>
              {catDiff > 0 ? "+" : ""}{formatCurrency(catDiff)}
            </div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2 cursor-pointer hover:text-cta" onClick={() => openPayments(cat.id)} title="Ver calendario de pagos">{formatCurrency(catPaid)}</div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2 cursor-pointer hover:text-cta" onClick={() => openPayments(cat.id)} title="Ver calendario de pagos">{formatCurrency(catReal - catPaid)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
