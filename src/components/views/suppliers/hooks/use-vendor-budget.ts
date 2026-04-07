"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/services";
import type { ExpenseCategory } from "@/types";

export interface VendorBudgetEditState {
  isEditing: (id: string, field: string) => boolean;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (id: string, field: string, value: number | string) => void;
  saveEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  handleDeleteItem: (catId: string, itemId: string) => void;
}

export function useVendorBudget(
  vendorId: string,
  vendorName: string,
  vendorCategories: string[],
) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all: ExpenseCategory[] = await api.getBudgetCategories();
      const matched = all.filter((c) =>
        vendorCategories.some((vc) => vc.toLowerCase() === c.name.toLowerCase()),
      );
      setCategories(matched);
    } finally {
      setLoading(false);
    }
  }, [vendorCategories]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem  = async (catId: string, concept: string) => { await api.createItem(catId, { concept, vendorId, vendorName }); await refresh(); };
  const linkItem = async (catId: string, itemId: string, targetVendorId: string | null, targetVendorName: string | null) => {
    await api.updateItem(catId, itemId, { vendorId: targetVendorId, vendorName: targetVendorName });
    await refresh();
  };

  const isEditing  = (id: string, field: string) => editingCell?.id === id && editingCell?.field === field;
  const startEdit  = (id: string, field: string, value: number | string) => { setEditingCell({ id, field }); setEditValue(String(value)); };
  const cancelEdit = () => { setEditingCell(null); setEditValue(""); };

  const saveEdit = async () => {
    if (!editingCell) return;
    const { id, field } = editingCell;
    for (const cat of categories) {
      const item = cat.items.find((i) => i.id === id);
      if (item) {
        const d: Record<string, number | string> = {};
        if (field === "concept")        d.concept   = editValue.trim();
        else if (field === "estimated") d.estimated = Number(editValue) || 0;
        else if (field === "actual")    d.actual    = Number(editValue) || 0;
        await api.updateItem(cat.id, item.id, d);
        break;
      }
    }
    cancelEdit();
    await refresh();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
    else if (e.key === "Escape") cancelEdit();
  };

  const handleDeleteItem = async (catId: string, itemId: string) => {
    await api.deleteItem(catId, itemId);
    setDeletingId(null);
    await refresh();
  };

  const editState: VendorBudgetEditState = {
    isEditing, editValue, setEditValue, startEdit, saveEdit, handleKeyDown,
    deletingId, setDeletingId, handleDeleteItem,
  };

  return { categories, loading, refresh, addItem, linkItem, editState };
}
