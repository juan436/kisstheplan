"use client";

import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";
import { NumCell } from "./num-cell";

interface BudgetTableProps {
  categories: ExpenseCategory[];
  collapsed: Set<string>;
  toggleCollapse: (id: string) => void;
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
  showAddCat: boolean;
  newCatName: string;
  setShowAddCat: (v: boolean) => void;
  setNewCatName: (v: string) => void;
  handleAddCat: () => void;
}

export function BudgetTable({ categories, collapsed, toggleCollapse, isEditing, editValue, setEditValue, startEdit, saveEdit, handleKeyDown, deletingId, setDeletingId, addingItemToCat, newItemName, setAddingItemToCat, setNewItemName, handleAddItem, handleDeleteCat, handleDeleteItem, openPayments, showAddCat, newCatName, setShowAddCat, setNewCatName, handleAddCat }: BudgetTableProps) {
  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const catEst  = cat.items.reduce((s, i) => s + i.estimated, 0);
        const catReal = cat.items.reduce((s, i) => s + i.real,      0);
        const catPaid = cat.items.reduce((s, i) => s + i.paid,      0);
        const catDiff = catEst - catReal;
        const isOpen  = !collapsed.has(cat.id);
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-border shadow-card overflow-hidden group/card">
            <div className="flex items-center gap-2 px-4 py-3 bg-bg2 relative">
              <button onClick={() => toggleCollapse(cat.id)} className="text-brand hover:text-text transition-colors">
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
                {cat.items.map((item) => {
                  const diff    = item.estimated - item.real;
                  const pending = item.real - item.paid;
                  return (
                    <div key={item.id} className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 py-2.5 border-b border-border/50 hover:bg-bg2 transition-colors group/item items-center">
                      <div className="flex items-center gap-2 pl-6">
                        {isEditing(item.id, "concept") ? (
                          <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)}
                            onBlur={saveEdit} onKeyDown={handleKeyDown}
                            className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] outline-none flex-1" />
                        ) : (
                          <span className="text-[13px] text-[#866857] cursor-pointer hover:text-cta transition-colors flex-1"
                            onClick={() => startEdit(item.id, "concept", item.concept)}>{item.concept}</span>
                        )}
                        {deletingId === `item-${item.id}` ? (
                          <span className="flex items-center gap-1">
                            <button onClick={() => handleDeleteItem(cat.id, item.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                            <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeletingId(`item-${item.id}`)} className="opacity-0 group-hover/item:opacity-100 text-brand hover:text-danger transition-all">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <NumCell value={item.estimated} isEditing={isEditing(item.id, "estimated")} editValue={editValue}
                        onStart={() => startEdit(item.id, "estimated", item.estimated)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
                      <NumCell value={item.real} isEditing={isEditing(item.id, "actual")} editValue={editValue}
                        onStart={() => startEdit(item.id, "actual", item.real)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
                      <div className="text-right text-[13px] font-medium pr-2" style={{ color: diff < 0 ? "var(--color-danger)" : diff > 0 ? "var(--color-success)" : "var(--color-text)" }}>
                        {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                      </div>
                      <div className="text-right text-[13px] text-[#866857] pr-2">{formatCurrency(item.paid)}</div>
                      <div className="text-right text-[13px] text-[#866857] pr-2">{formatCurrency(pending)}</div>
                    </div>
                  );
                })}

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
                  <div className="text-right text-[12px] font-semibold text-accent pr-2">{formatCurrency(catPaid)}</div>
                  <div className="text-right text-[12px] font-semibold text-accent pr-2">{formatCurrency(catReal - catPaid)}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {showAddCat ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-cta">
          <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddCat(); if (e.key === "Escape") { setShowAddCat(false); setNewCatName(""); } }}
            placeholder="Nombre de la categoría..."
            className="flex-1 bg-transparent text-[14px] font-semibold text-text outline-none" />
          <Button variant="cta" size="sm" onClick={handleAddCat}>Crear</Button>
          <Button variant="ghost" size="sm" onClick={() => { setShowAddCat(false); setNewCatName(""); }}>Cancelar</Button>
        </div>
      ) : (
        <button onClick={() => setShowAddCat(true)} className="flex items-center gap-2 px-4 py-3 text-[13px] text-brand hover:text-cta transition-colors">
          <Plus size={14} />Nueva categoría
        </button>
      )}
    </div>
  );
}
