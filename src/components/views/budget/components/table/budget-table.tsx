"use client";

/**
 * BudgetTable
 *
 * Qué hace: orquestador de la tabla de presupuesto; mapea categorías a BudgetCategoryCard
 *           y gestiona el formulario inline para añadir nueva categoría.
 * Recibe:   lista de categorías, estado de colapso, handlers de edición/delete/pagos/add-cat.
 * Provee:   export { BudgetTable } — usado directamente por budget-view.tsx.
 */

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services";
import type { ExpenseCategory } from "@/types";
import type { Vendor } from "@/types";
import { CategoryCard } from "./category-card";

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
  loadData: () => void;
}

export function BudgetTable(props: BudgetTableProps) {
  const { categories, collapsed, toggleCollapse, isEditing, editValue, setEditValue,
    startEdit, saveEdit, handleKeyDown, deletingId, setDeletingId, addingItemToCat,
    newItemName, setAddingItemToCat, setNewItemName, handleAddItem, handleDeleteCat,
    handleDeleteItem, openPayments, showAddCat, newCatName, setShowAddCat, setNewCatName,
    handleAddCat, loadData } = props;

  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    api.getVendors().then((data) => setVendors(data as Vendor[])).catch(() => {});
  }, []);

  const handleLinkVendor = async (catId: string, itemId: string, vendorId: string | null, vendorName: string | null) => {
    await api.updateItem(catId, itemId, { vendorId, vendorName });
    loadData();
  };

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          cat={cat} vendors={vendors}
          isOpen={!collapsed.has(cat.id)}
          onToggle={() => toggleCollapse(cat.id)}
          isEditing={isEditing} editValue={editValue} setEditValue={setEditValue}
          startEdit={startEdit} saveEdit={saveEdit} handleKeyDown={handleKeyDown}
          deletingId={deletingId} setDeletingId={setDeletingId}
          addingItemToCat={addingItemToCat} newItemName={newItemName}
          setAddingItemToCat={setAddingItemToCat} setNewItemName={setNewItemName}
          handleAddItem={handleAddItem} handleDeleteCat={handleDeleteCat} handleDeleteItem={handleDeleteItem}
          openPayments={openPayments}
          onLinkVendor={(itemId, vendorId, vendorName) => handleLinkVendor(cat.id, itemId, vendorId, vendorName)}
        />
      ))}

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
