import { useState } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { VendorBudgetItemRow } from "./vendor-budget-item-row";
import type { ExpenseCategory, Vendor } from "@/types";
import type { VendorBudgetEditState } from "../hooks/use-vendor-budget";

interface VendorCategoryBlockProps {
  category: ExpenseCategory;
  currentVendorId: string;
  vendors: Vendor[];
  editState: VendorBudgetEditState;
  onLinkVendor: (catId: string, itemId: string, vendorId: string | null, vendorName: string | null) => void;
  onAddItem: (catId: string, concept: string) => Promise<void>;
  onOpenPayments: (catId: string) => void;
}

export function VendorCategoryBlock({
  category, currentVendorId, vendors, editState, onLinkVendor, onAddItem, onOpenPayments,
}: VendorCategoryBlockProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [adding, setAdding]       = useState(false);
  const [newConcept, setNewConcept] = useState("");
  const [saving, setSaving]       = useState(false);

  // Subtotal uses ONLY this vendor's items (critical calculation rule)
  const myItems = category.items.filter((i) => i.vendorId === currentVendorId);
  const catEst  = myItems.reduce((s, i) => s + i.estimated, 0);
  const catReal = myItems.reduce((s, i) => s + i.real, 0);
  const catPaid = myItems.reduce((s, i) => s + i.paid, 0);
  const catDiff = catEst - catReal;

  const handleConfirm = async () => {
    const trimmed = newConcept.trim();
    if (!trimmed) { setAdding(false); return; }
    setSaving(true);
    await onAddItem(category.id, trimmed);
    setNewConcept(""); setAdding(false); setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden group/card mb-3">
      {/* Category header — whole row opens payment modal, chevron only collapses */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-bg2 cursor-pointer hover:bg-bg3 transition-colors"
        onClick={() => onOpenPayments(category.id)}
        title="Ver calendario de pagos"
      >
        <button
          onClick={(e) => { e.stopPropagation(); setCollapsed((v) => !v); }}
          className="text-brand hover:text-text transition-colors shrink-0"
        >
          {!collapsed ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <span className="text-[14px] font-semibold text-text flex-1">{category.name}</span>
        <span className="text-[13px] font-semibold text-[#866857] mr-2">{formatCurrency(catReal)}</span>
      </div>

      {!collapsed && (
        <div>
          {category.items.map((item) => (
            <VendorBudgetItemRow
              key={item.id}
              item={item}
              catId={category.id}
              isMyVendor={item.vendorId === currentVendorId}
              vendors={vendors}
              {...editState}
              openPayments={onOpenPayments}
              onLinkVendor={onLinkVendor}
            />
          ))}

          {/* Add item */}
          <div className="px-4 py-2 pl-10 border-b border-border/50">
            {adding ? (
              <div className="flex items-center gap-2">
                <input autoFocus value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); if (e.key === "Escape") { setAdding(false); setNewConcept(""); } }}
                  placeholder="Nombre del concepto..."
                  className="bg-white border border-cta rounded px-2 py-1 text-[13px] text-text outline-none w-48" />
                <Button variant="cta" size="sm" onClick={handleConfirm} disabled={saving}>Añadir</Button>
                <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewConcept(""); }}>Cancelar</Button>
              </div>
            ) : (
              <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors">
                <Plus size={12} />Añadir concepto
              </button>
            )}
          </div>

          {/* Subtotal row — only this vendor's items */}
          <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 py-2 bg-bg2 items-center">
            <div className="pl-6 text-[12px] font-semibold text-accent">Subtotal</div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2">{formatCurrency(catEst)}</div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2">{formatCurrency(catReal)}</div>
            <div className="text-right text-[12px] font-semibold pr-2"
              style={{ color: catDiff < 0 ? "var(--color-danger)" : catDiff > 0 ? "var(--color-success)" : "var(--color-accent)" }}>
              {catDiff > 0 ? "+" : ""}{formatCurrency(catDiff)}
            </div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2 cursor-pointer hover:text-cta transition-colors"
              onClick={() => onOpenPayments(category.id)} title="Ver calendario de pagos">{formatCurrency(catPaid)}</div>
            <div className="text-right text-[12px] font-semibold text-accent pr-2 cursor-pointer hover:text-cta transition-colors"
              onClick={() => onOpenPayments(category.id)} title="Ver calendario de pagos">{formatCurrency(catReal - catPaid)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
