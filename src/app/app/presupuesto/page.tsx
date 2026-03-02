"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, ChevronDown, ChevronRight, Check, X } from "lucide-react";
import type { ExpenseCategory, BudgetSummary, PaymentSchedule } from "@/types";

export default function PresupuestoPage() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingItemToCat, setAddingItemToCat] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showPayments, setShowPayments] = useState(false);
  const [payments, setPayments] = useState<PaymentSchedule[]>([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({ vendorName: "", concept: "", amount: "", dueDate: "" });
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editPaymentData, setEditPaymentData] = useState({ vendorName: "", concept: "", amount: "", dueDate: "" });
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [catData, summaryData] = await Promise.all([
      api.getBudgetCategories(),
      api.getBudgetSummary(),
    ]);
    setCategories(catData);
    setSummary(summaryData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleCollapse = (catId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // Inline editing
  const startEdit = (id: string, field: string, value: number | string) => {
    setEditingCell({ id, field });
    setEditValue(String(value));
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    const { id, field } = editingCell;

    // Find which category contains this item
    for (const cat of categories) {
      if (field === "catName" && cat.id === id) {
        await api.updateCategory(cat.id, { name: editValue.trim() });
        break;
      }
      const item = cat.items.find((i) => i.id === id);
      if (item) {
        const data: Record<string, number | string> = {};
        if (field === "concept") data.concept = editValue.trim();
        else if (field === "estimated") data.estimated = Number(editValue) || 0;
        else if (field === "actual") data.actual = Number(editValue) || 0;
        await api.updateItem(cat.id, item.id, data);
        break;
      }
    }
    cancelEdit();
    await loadData();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await api.createCategory({ name: newCategoryName.trim() });
    setNewCategoryName("");
    setShowAddCategory(false);
    await loadData();
  };

  const handleAddItem = async (categoryId: string) => {
    if (!newItemName.trim()) return;
    await api.createItem(categoryId, { concept: newItemName.trim() });
    setNewItemName("");
    setAddingItemToCat(null);
    await loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setDeletingId(null);
    await loadData();
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    await api.deleteItem(categoryId, itemId);
    setDeletingId(null);
    await loadData();
  };

  const loadPayments = useCallback(async () => {
    const data = await api.getPayments();
    setPayments(data);
  }, []);

  const handleShowPayments = async () => {
    await loadPayments();
    setShowPayments(true);
  };

  const handleAddPayment = async () => {
    if (!newPayment.amount || !newPayment.dueDate) return;
    await api.createPayment({
      vendorName: newPayment.vendorName.trim(),
      concept: newPayment.concept.trim(),
      amount: Number(newPayment.amount),
      dueDate: newPayment.dueDate,
    });
    setNewPayment({ vendorName: "", concept: "", amount: "", dueDate: "" });
    setShowAddPayment(false);
    await loadPayments();
    await loadData();
  };

  const handleTogglePaid = async (payment: PaymentSchedule) => {
    await api.updatePayment(payment.id, { paid: !payment.paid });
    await loadPayments();
    await loadData();
  };

  const startEditPayment = (p: PaymentSchedule) => {
    setEditingPaymentId(p.id);
    setEditPaymentData({
      vendorName: p.vendorName || "",
      concept: p.concept,
      amount: String(p.amount),
      dueDate: p.dueDate,
    });
  };

  const saveEditPayment = async () => {
    if (!editingPaymentId || !editPaymentData.amount || !editPaymentData.dueDate) return;
    await api.updatePayment(editingPaymentId, {
      vendorName: editPaymentData.vendorName.trim(),
      concept: editPaymentData.concept.trim(),
      amount: Number(editPaymentData.amount),
      dueDate: editPaymentData.dueDate,
    });
    setEditingPaymentId(null);
    await loadPayments();
    await loadData();
  };

  const handleDeletePayment = async (id: string) => {
    await api.deletePayment(id);
    setDeletingPaymentId(null);
    await loadPayments();
    await loadData();
  };

  const isEditing = (id: string, field: string) =>
    editingCell?.id === id && editingCell?.field === field;

  if (!summary) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-brand text-[14px]">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[28px] text-text">Presupuesto</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleShowPayments}>
            Calendario de pagos
          </Button>
          <Button variant="cta" size="sm" className="gap-1.5" onClick={() => setShowAddCategory(true)}>
            <Plus size={14} />
            Nueva categoría
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <StatCard value={formatCurrency(summary.totalEstimated)} label="Estimado" />
        </Card>
        <Card className="text-center">
          <StatCard value={formatCurrency(summary.totalReal)} label="Real" />
        </Card>
        <Card className="text-center">
          <StatCard value={formatCurrency(summary.totalPaid)} label="Pagado" />
        </Card>
        <Card className="text-center">
          <StatCard value={formatCurrency(summary.totalPending)} label="Pendiente" />
        </Card>
      </div>

      {/* Budget table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg3">
                <th className="text-left text-[11px] font-bold text-brand uppercase tracking-[1px] px-4 py-3">
                  Concepto
                </th>
                <th className="text-right text-[11px] font-bold text-brand uppercase tracking-[1px] px-4 py-3">
                  Estimado
                </th>
                <th className="text-right text-[11px] font-bold text-brand uppercase tracking-[1px] px-4 py-3">
                  Real
                </th>
                <th className="text-right text-[11px] font-bold text-brand uppercase tracking-[1px] px-4 py-3">
                  Diferencia
                </th>
                <th className="text-right text-[11px] font-bold text-brand uppercase tracking-[1px] px-4 py-3 hidden lg:table-cell">
                  Pagado
                </th>
                <th className="text-right text-[11px] font-bold text-brand uppercase tracking-[1px] px-4 py-3 hidden lg:table-cell">
                  Pendiente
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const catEstimated = cat.items.reduce((s, i) => s + i.estimated, 0);
                const catReal = cat.items.reduce((s, i) => s + i.real, 0);
                const catPaid = cat.items.reduce((s, i) => s + i.paid, 0);
                const catDiff = catEstimated - catReal;
                const isCollapsed = collapsed.has(cat.id);

                return (
                  <CategoryGroup key={cat.id}>
                    {/* Category header */}
                    <tr className="bg-bg2 group/cat">
                      <td className="px-4 py-2.5" colSpan={6}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCollapse(cat.id)}
                            className="text-brand hover:text-text transition-colors"
                          >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                          </button>
                          {isEditing(cat.id, "catName") ? (
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={saveEdit}
                              onKeyDown={handleKeyDown}
                              className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] font-semibold text-text outline-none"
                            />
                          ) : (
                            <span
                              className="text-[13px] font-semibold text-text cursor-pointer hover:text-cta transition-colors"
                              onClick={() => startEdit(cat.id, "catName", cat.name)}
                            >
                              {cat.name}
                            </span>
                          )}
                          <span className="text-[11px] text-brand ml-auto mr-2 hidden group-hover/cat:inline">
                            {formatCurrency(catReal)}
                          </span>
                          {deletingId === `cat-${cat.id}` ? (
                            <span className="flex items-center gap-1">
                              <button onClick={() => handleDeleteCategory(cat.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                              <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeletingId(`cat-${cat.id}`)}
                              className="opacity-0 group-hover/cat:opacity-100 text-brand hover:text-danger transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Items */}
                    {!isCollapsed && cat.items.map((item) => {
                      const diff = item.estimated - item.real;
                      const pending = item.real - item.paid;
                      return (
                        <tr key={item.id} className="border-b border-border hover:bg-bg2 transition-colors group/item">
                          <td className="px-4 py-2.5 pl-10">
                            <div className="flex items-center gap-2">
                              {isEditing(item.id, "concept") ? (
                                <input
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={saveEdit}
                                  onKeyDown={handleKeyDown}
                                  className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] text-text outline-none flex-1"
                                />
                              ) : (
                                <span
                                  className="text-[13px] text-text cursor-pointer hover:text-cta transition-colors flex-1"
                                  onClick={() => startEdit(item.id, "concept", item.concept)}
                                >
                                  {item.concept}
                                </span>
                              )}
                              {deletingId === `item-${item.id}` ? (
                                <span className="flex items-center gap-1">
                                  <button onClick={() => handleDeleteItem(cat.id, item.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                                  <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setDeletingId(`item-${item.id}`)}
                                  className="opacity-0 group-hover/item:opacity-100 text-brand hover:text-danger transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                          <EditableNumberCell
                            value={item.estimated}
                            isEditing={isEditing(item.id, "estimated")}
                            editValue={editValue}
                            onStartEdit={() => startEdit(item.id, "estimated", item.estimated)}
                            onChange={setEditValue}
                            onSave={saveEdit}

                            onKeyDown={handleKeyDown}
                          />
                          <EditableNumberCell
                            value={item.real}
                            isEditing={isEditing(item.id, "actual")}
                            editValue={editValue}
                            onStartEdit={() => startEdit(item.id, "actual", item.real)}
                            onChange={setEditValue}
                            onSave={saveEdit}

                            onKeyDown={handleKeyDown}
                          />
                          <td
                            className="px-4 py-2.5 text-right text-[13px] font-medium"
                            style={{
                              color: diff < 0 ? "var(--color-danger)" : diff > 0 ? "var(--color-success)" : "var(--color-text)",
                            }}
                          >
                            {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-[13px] text-text hidden lg:table-cell">
                            {formatCurrency(item.paid)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-[13px] text-text hidden lg:table-cell">
                            {formatCurrency(pending)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Add item row */}
                    {!isCollapsed && (
                      <tr className="border-b border-border">
                        <td className="px-4 py-1.5 pl-10" colSpan={6}>
                          {addingItemToCat === cat.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddItem(cat.id);
                                  if (e.key === "Escape") { setAddingItemToCat(null); setNewItemName(""); }
                                }}
                                placeholder="Nombre del concepto..."
                                className="bg-white border border-cta rounded px-2 py-1 text-[13px] text-text outline-none w-48"
                              />
                              <Button variant="cta" size="sm" onClick={() => handleAddItem(cat.id)}>Añadir</Button>
                              <Button variant="ghost" size="sm" onClick={() => { setAddingItemToCat(null); setNewItemName(""); }}>Cancelar</Button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingItemToCat(cat.id)}
                              className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors"
                            >
                              <Plus size={12} />
                              Añadir concepto
                            </button>
                          )}
                        </td>
                      </tr>
                    )}

                    {/* Category subtotal */}
                    {!isCollapsed && (
                      <tr className="border-b-2 border-border">
                        <td className="px-4 py-2 pl-10 text-[12px] font-semibold text-accent">Subtotal</td>
                        <td className="px-4 py-2 text-right text-[12px] font-semibold text-accent">{formatCurrency(catEstimated)}</td>
                        <td className="px-4 py-2 text-right text-[12px] font-semibold text-accent">{formatCurrency(catReal)}</td>
                        <td className="px-4 py-2 text-right text-[12px] font-semibold" style={{ color: catDiff < 0 ? "var(--color-danger)" : catDiff > 0 ? "var(--color-success)" : "var(--color-accent)" }}>
                          {catDiff > 0 ? "+" : ""}{formatCurrency(catDiff)}
                        </td>
                        <td className="px-4 py-2 text-right text-[12px] font-semibold text-accent hidden lg:table-cell">{formatCurrency(catPaid)}</td>
                        <td className="px-4 py-2 text-right text-[12px] font-semibold text-accent hidden lg:table-cell">{formatCurrency(catReal - catPaid)}</td>
                      </tr>
                    )}
                  </CategoryGroup>
                );
              })}

              {/* Grand total */}
              <tr className="bg-bg3 font-semibold">
                <td className="px-4 py-3 text-[13px] text-text">Total</td>
                <td className="px-4 py-3 text-right text-[13px] text-text">{formatCurrency(summary.totalEstimated)}</td>
                <td className="px-4 py-3 text-right text-[13px] text-text">{formatCurrency(summary.totalReal)}</td>
                <td className="px-4 py-3 text-right text-[13px]" style={{ color: summary.totalEstimated - summary.totalReal < 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                  {summary.totalEstimated - summary.totalReal > 0 ? "+" : ""}{formatCurrency(summary.totalEstimated - summary.totalReal)}
                </td>
                <td className="px-4 py-3 text-right text-[13px] text-text hidden lg:table-cell">{formatCurrency(summary.totalPaid)}</td>
                <td className="px-4 py-3 text-right text-[13px] text-text hidden lg:table-cell">{formatCurrency(summary.totalPending)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal open={showAddCategory} onClose={() => { setShowAddCategory(false); setNewCategoryName(""); }}>
        <h2 className="font-display text-[22px] text-text mb-4">Nueva categoría</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="catName">Nombre</Label>
            <Input
              id="catName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ej: Decoración, Música..."
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); }}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}>Cancelar</Button>
            <Button variant="cta" onClick={handleAddCategory}>Crear categoría</Button>
          </div>
        </div>
      </Modal>

      {/* Payments Modal */}
      <Modal open={showPayments} onClose={() => { setShowPayments(false); setShowAddPayment(false); setEditingPaymentId(null); setDeletingPaymentId(null); }} className="max-w-lg">
        <div className="pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[22px] text-text">Calendario de pagos</h2>
            <Button variant="cta" size="sm" className="gap-1.5" onClick={() => setShowAddPayment(true)}>
              <Plus size={14} /> Nuevo pago
            </Button>
          </div>
        </div>

        {/* Add payment form */}
        {showAddPayment && (
          <div className="bg-bg2 rounded-lg p-3 mb-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                autoFocus
                value={newPayment.vendorName}
                onChange={(e) => setNewPayment({ ...newPayment, vendorName: e.target.value })}
                placeholder="Proveedor"
                className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
              />
              <input
                value={newPayment.concept}
                onChange={(e) => setNewPayment({ ...newPayment, concept: e.target.value })}
                placeholder="Concepto"
                className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                placeholder="Cantidad (EUR)"
                className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
              />
              <input
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => { setShowAddPayment(false); setNewPayment({ vendorName: "", concept: "", amount: "", dueDate: "" }); }}>
                Cancelar
              </Button>
              <Button variant="cta" size="sm" onClick={handleAddPayment}>Añadir</Button>
            </div>
          </div>
        )}

        {/* Payment list */}
        {payments.length === 0 && !showAddPayment ? (
          <p className="text-[14px] text-brand text-center py-8">No hay pagos programados</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {[...payments]
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((p) => (
                <div key={p.id}>
                  {editingPaymentId === p.id ? (
                    /* Edit mode */
                    <div className="bg-bg2 rounded-lg p-3 space-y-2 border border-cta">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          autoFocus
                          value={editPaymentData.vendorName}
                          onChange={(e) => setEditPaymentData({ ...editPaymentData, vendorName: e.target.value })}
                          placeholder="Proveedor"
                          className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
                        />
                        <input
                          value={editPaymentData.concept}
                          onChange={(e) => setEditPaymentData({ ...editPaymentData, concept: e.target.value })}
                          placeholder="Concepto"
                          className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={editPaymentData.amount}
                          onChange={(e) => setEditPaymentData({ ...editPaymentData, amount: e.target.value })}
                          placeholder="Cantidad"
                          className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
                        />
                        <input
                          type="date"
                          value={editPaymentData.dueDate}
                          onChange={(e) => setEditPaymentData({ ...editPaymentData, dueDate: e.target.value })}
                          className="bg-white border border-border rounded px-2 py-1.5 text-[13px] text-text outline-none focus:border-cta"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingPaymentId(null)}>Cancelar</Button>
                        <Button variant="cta" size="sm" onClick={saveEditPayment}>Guardar</Button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-bg2 group/pay hover:bg-bg3 transition-colors">
                      {/* Checkbox pagado */}
                      <button
                        onClick={() => handleTogglePaid(p)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${p.paid
                          ? "bg-success border-success text-white"
                          : "border-border hover:border-cta"
                          }`}
                      >
                        {p.paid && <Check size={12} />}
                      </button>

                      {/* Info */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => startEditPayment(p)}
                      >
                        <p className={`text-[13px] font-medium truncate ${p.paid ? "line-through text-brand" : "text-text"}`}>
                          {p.vendorName || p.concept || "Sin nombre"}
                        </p>
                        <div className="flex items-center gap-2">
                          {p.vendorName && p.concept && (
                            <span className="text-[11px] text-brand truncate">{p.concept}</span>
                          )}
                          <span className="text-[11px] text-brand">
                            {new Date(p.dueDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <span className={`text-[14px] font-display font-semibold shrink-0 ${p.paid ? "text-brand line-through" : "text-text"}`}>
                        {formatCurrency(p.amount)}
                      </span>

                      {/* Delete */}
                      {deletingPaymentId === p.id ? (
                        <span className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleDeletePayment(p.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                          <button onClick={() => setDeletingPaymentId(null)} className="text-[11px] text-brand hover:underline">No</button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeletingPaymentId(p.id)}
                          className="opacity-0 group-hover/pay:opacity-100 text-brand hover:text-danger transition-all shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Totals */}
        {payments.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="text-[12px] text-brand">
              {payments.filter((p) => p.paid).length} de {payments.length} pagados
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-success font-medium">
                Pagado: {formatCurrency(payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0))}
              </span>
              <span className="text-[12px] text-cta font-medium">
                Pendiente: {formatCurrency(payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CategoryGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function EditableNumberCell({
  value,
  isEditing,
  editValue,
  onStartEdit,
  onChange,
  onSave,
  onKeyDown,
}: {
  value: number;
  isEditing: boolean;
  editValue: string;
  onStartEdit: () => void;
  onChange: (v: string) => void;
  onSave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <td
      className="px-4 py-2.5 text-right text-[13px] text-text cursor-pointer"
      onClick={() => !isEditing && onStartEdit()}
    >
      {isEditing ? (
        <input
          autoFocus
          type="number"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onSave}
          onKeyDown={onKeyDown}
          className="w-24 bg-white border border-cta rounded px-2 py-0.5 text-[13px] text-right outline-none ml-auto block"
        />
      ) : (
        formatCurrency(value)
      )}
    </td>
  );
}
