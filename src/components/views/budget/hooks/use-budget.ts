"use client";
/**
 * use-budget.ts
 *
 * Qué hace: hook principal que orquesta el flujo de datos del presupuesto.
 * Recibe:   weddings (desde useAuth), llamadas a api para obtener categorías y resumen.
 * Provee:   estado de categorías, tabla, edición, filtros, y modals (pagos, añadir categoría).
 */

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/use-modal";
import type { ExpenseCategory, BudgetSummary } from "@/types";

export function useBudget() {
  const { wedding } = useAuth();
  const totalBudget = wedding?.estimatedBudget ?? 0;

  const [categories,      setCategories]      = useState<ExpenseCategory[]>([]);
  const [summary,         setSummary]         = useState<BudgetSummary | null>(null);
  const [collapsed,       setCollapsed]       = useState<Set<string>>(new Set());
  const [editingCell,     setEditingCell]     = useState<{ id: string; field: string } | null>(null);
  const [editValue,       setEditValue]       = useState("");
  const [deletingId,      setDeletingId]      = useState<string | null>(null);
  const [addingItemToCat, setAddingItemToCat] = useState<string | null>(null);
  const [newItemName,     setNewItemName]     = useState("");
  const [showAddCat,      setShowAddCat]      = useState(false);
  const [newCatName,      setNewCatName]      = useState("");

  const paymentsModal = useModal<string>();  // payload = catId
  const paymentCatId  = paymentsModal.payload ?? null;
  const showPayments  = paymentsModal.open;
  const paymentCat    = categories.find((c) => c.id === paymentCatId) ?? null;

  const loadData = useCallback(async () => {
    const [cats, sum] = await Promise.all([api.getBudgetCategories(), api.getBudgetSummary()]);
    setCategories(cats);
    setSummary(sum);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const startEdit = (id: string, field: string, value: number | string) => {
    setEditingCell({ id, field }); setEditValue(String(value));
  };
  const cancelEdit = () => { setEditingCell(null); setEditValue(""); };
  const isEditing  = (id: string, field: string) => editingCell?.id === id && editingCell?.field === field;

  const saveEdit = async () => {
    if (!editingCell) return;
    const { id, field } = editingCell;
    for (const cat of categories) {
      if (field === "catName" && cat.id === id) {
        await api.updateCategory(cat.id, { name: editValue.trim() }); break;
      }
      const item = cat.items.find((i) => i.id === id);
      if (item) {
        const d: Record<string, number | string> = {};
        if (field === "concept")        d.concept   = editValue.trim();
        else if (field === "estimated") d.estimated = Number(editValue) || 0;
        else if (field === "actual")    d.actual    = Number(editValue) || 0;
        await api.updateItem(cat.id, item.id, d); break;
      }
    }
    cancelEdit(); await loadData();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
    else if (e.key === "Escape") cancelEdit();
  };

  const handleAddCat = async () => {
    if (!newCatName.trim()) return;
    await api.createCategory({ name: newCatName.trim() });
    setNewCatName(""); setShowAddCat(false); await loadData();
  };

  const handleAddItem = async (catId: string) => {
    if (!newItemName.trim()) return;
    await api.createItem(catId, { concept: newItemName.trim() });
    setNewItemName(""); setAddingItemToCat(null); await loadData();
  };

  const handleDeleteCat  = async (id: string) => { await api.deleteCategory(id); setDeletingId(null); await loadData(); };
  const handleDeleteItem = async (catId: string, itemId: string) => { await api.deleteItem(catId, itemId); setDeletingId(null); await loadData(); };

  const openPayments  = (catId: string) => paymentsModal.openWith(catId);
  const closePayments = () => paymentsModal.close();

  const paidPct    = totalBudget > 0 ? Math.min((summary?.totalPaid ?? 0) / totalBudget * 100, 100) : 0;
  const enteredPct = totalBudget > 0 ? Math.min((summary?.totalReal ?? 0) / totalBudget * 100, 100) : 0;

  return {
    totalBudget, categories, summary, collapsed, toggleCollapse,
    editingCell, editValue, setEditValue, isEditing, startEdit, saveEdit, handleKeyDown,
    deletingId, setDeletingId, addingItemToCat, newItemName, setAddingItemToCat, setNewItemName,
    showAddCat, newCatName, setShowAddCat, setNewCatName, handleAddCat, handleAddItem,
    handleDeleteCat, handleDeleteItem, openPayments, closePayments,
    showPayments, paymentCat, loadData,
    paidPct, enteredPct,
  };
}
