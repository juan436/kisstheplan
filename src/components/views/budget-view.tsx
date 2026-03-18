"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Trash2, ChevronDown, ChevronRight,
  Check, CalendarDays, FileDown, FileSpreadsheet,
} from "lucide-react";
import type { ExpenseCategory, BudgetSummary, PaymentSchedule } from "@/types";

/* ─────────────────────────────────────────────────────────────── */

interface PaymentContext { catName: string; vendorName?: string; }

export default function PresupuestoPage() {
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

  // Payments modal
  const [showPayments,    setShowPayments]    = useState(false);
  const [paymentContext,  setPaymentContext]  = useState<PaymentContext | null>(null);
  const [payments,        setPayments]        = useState<PaymentSchedule[]>([]);
  const [deletingPayId,   setDeletingPayId]   = useState<string | null>(null);
  const [showAddPay,      setShowAddPay]      = useState(false);
  const [newPay,          setNewPay]          = useState({ vendorName: "", concept: "", amount: "", dueDate: "", notes: "" });

  const loadData = useCallback(async () => {
    const [cats, sum] = await Promise.all([api.getBudgetCategories(), api.getBudgetSummary()]);
    setCategories(cats);
    setSummary(sum);
  }, []);

  const loadPayments = useCallback(async () => {
    setPayments(await api.getPayments());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Category / Item helpers ── */
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
        if (field === "concept")   d.concept   = editValue.trim();
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

  const handleAddCat  = async () => {
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

  /* ── Payment helpers ── */
  const openPayments = async (ctx: PaymentContext) => {
    setPaymentContext(ctx); await loadPayments(); setShowPayments(true);
  };
  const closePayments = () => { setShowPayments(false); setShowAddPay(false); setDeletingPayId(null); setNewPay({ vendorName: "", concept: "", amount: "", dueDate: "", notes: "" }); };

  const handleTogglePaid = async (p: PaymentSchedule) => {
    await api.updatePayment(p.id, { paid: !p.paid }); await loadPayments(); await loadData();
  };

  const handleAddPayment = async () => {
    if (!newPay.amount) return;
    await api.createPayment({
      categoryId: paymentContext?.catId,
      vendorName: newPay.vendorName.trim() || paymentContext?.vendorName,
      concept:    newPay.concept.trim(),
      amount:     Number(newPay.amount),
      dueDate:    newPay.dueDate || new Date().toISOString().split("T")[0],
      notes:      newPay.notes.trim() || undefined,
    });
    setNewPay({ vendorName: "", concept: "", amount: "", dueDate: "", notes: "" });
    setShowAddPay(false); await loadPayments(); await loadData();
  };

  const handleDeletePayment = async (id: string) => {
    await api.deletePayment(id); setDeletingPayId(null); await loadPayments(); await loadData();
  };

  const handleUpdateNotes = async (p: PaymentSchedule, notes: string) => {
    await api.updatePayment(p.id, { notes }); await loadPayments();
  };

  /* ── Progress bar values ── */
  const paidPct     = totalBudget > 0 ? Math.min((summary?.totalPaid  ?? 0) / totalBudget * 100, 100) : 0;
  const enteredPct  = totalBudget > 0 ? Math.min((summary?.totalReal  ?? 0) / totalBudget * 100, 100) : 0;

  if (!summary) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-brand text-[14px]">Cargando...</div>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">

      {/* ── Header: total + bar + actions ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <p className="font-display text-[22px] text-text">
            Presupuesto total:{" "}
            <span className="text-cta">{formatCurrency(totalBudget)}</span>
          </p>

          {/* Tricolor bar */}
          <div className="space-y-1.5">
            <div className="relative h-3 bg-[#e8e2d8] rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-[#8fba88]" style={{ width: `${enteredPct}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-[#4A773C]" style={{ width: `${paidPct}%` }} />
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4A773C] inline-block" />Pagado {formatCurrency(summary.totalPaid)}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8fba88] inline-block" />Comprometido {formatCurrency(summary.totalReal)}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#e8e2d8] inline-block" />Restante {formatCurrency(Math.max(0, totalBudget - summary.totalReal))}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setShowAddCat(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#CBA978] hover:bg-[#b08f5d] text-white text-[13px] font-semibold transition-colors"
          >
            <Plus size={15} />Proveedor
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8bfb5] hover:bg-[#b5aaa0] text-white text-[13px] font-semibold transition-colors">
            <FileDown size={15} />Importar a PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8bfb5] hover:bg-[#b5aaa0] text-white text-[13px] font-semibold transition-colors">
            <FileSpreadsheet size={15} />Importar a Excel
          </button>
        </div>
      </div>

      {/* ── Column header pills ── */}
      <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4">
        <div />
        {["Estimado", "Real", "Diferencia", "Pagado", "Pendiente"].map((label) => (
          <div key={label} className="flex justify-center">
            <span className="px-3 py-1 rounded-full bg-[#e8e0d8] text-[#866857] text-[11px] font-semibold uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Category cards ── */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const catEst  = cat.items.reduce((s, i) => s + i.estimated, 0);
          const catReal = cat.items.reduce((s, i) => s + i.real,      0);
          const catPaid = cat.items.reduce((s, i) => s + i.paid,      0);
          const catDiff = catEst - catReal;
          const isOpen  = !collapsed.has(cat.id);

          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-border shadow-card overflow-hidden group/card">
              {/* Category header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-bg2 relative">
                <button onClick={() => toggleCollapse(cat.id)} className="text-brand hover:text-text transition-colors">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isEditing(cat.id, "catName") ? (
                  <input autoFocus value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit} onKeyDown={handleKeyDown}
                    className="bg-white border border-cta rounded px-2 py-0.5 text-[14px] font-semibold text-text outline-none flex-1"
                  />
                ) : (
                  <button
                    className="text-[14px] font-semibold text-text hover:text-cta transition-colors cursor-pointer flex-1 text-left"
                    onClick={() => openPayments({ catName: cat.name })}
                    onDoubleClick={() => startEdit(cat.id, "catName", cat.name)}
                    title="Clic: ver pagos · Doble clic: editar nombre"
                  >
                    {cat.name}
                  </button>
                )}

                <span className="text-[13px] font-semibold text-[#866857] mr-6">{formatCurrency(catReal)}</span>

                {/* Trash — hover only */}
                {deletingId === `cat-${cat.id}` ? (
                  <span className="flex items-center gap-1 absolute right-3">
                    <button onClick={() => handleDeleteCat(cat.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                    <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
                  </span>
                ) : (
                  <button
                    onClick={() => setDeletingId(`cat-${cat.id}`)}
                    className="absolute right-3 opacity-0 group-hover/card:opacity-100 transition-opacity text-brand hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Items */}
              {isOpen && (
                <div>
                  {cat.items.map((item) => {
                    const diff    = item.estimated - item.real;
                    const pending = item.real - item.paid;
                    return (
                      <div key={item.id} className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 py-2.5 border-b border-border/50 hover:bg-bg2 transition-colors group/item items-center">
                        {/* Concept */}
                        <div className="flex items-center gap-2 pl-6">
                          {isEditing(item.id, "concept") ? (
                            <input autoFocus value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={saveEdit} onKeyDown={handleKeyDown}
                              className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] outline-none flex-1"
                            />
                          ) : (
                            <span
                              className="text-[13px] text-[#866857] cursor-pointer hover:text-cta transition-colors flex-1"
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
                            <button onClick={() => setDeletingId(`item-${item.id}`)} className="opacity-0 group-hover/item:opacity-100 text-brand hover:text-danger transition-all">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        {/* Estimado */}
                        <NumCell value={item.estimated} isEditing={isEditing(item.id, "estimated")} editValue={editValue}
                          onStart={() => startEdit(item.id, "estimated", item.estimated)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
                        {/* Real */}
                        <NumCell value={item.real} isEditing={isEditing(item.id, "actual")} editValue={editValue}
                          onStart={() => startEdit(item.id, "actual", item.real)} onChange={setEditValue} onSave={saveEdit} onKeyDown={handleKeyDown} />
                        {/* Diferencia */}
                        <div className="text-right text-[13px] font-medium pr-2" style={{ color: diff < 0 ? "var(--color-danger)" : diff > 0 ? "var(--color-success)" : "var(--color-text)" }}>
                          {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                        </div>
                        {/* Pagado */}
                        <div className="text-right text-[13px] text-[#866857] pr-2">{formatCurrency(item.paid)}</div>
                        {/* Pendiente */}
                        <div className="text-right text-[13px] text-[#866857] pr-2">{formatCurrency(pending)}</div>
                      </div>
                    );
                  })}

                  {/* Add item row */}
                  <div className="px-4 py-2 pl-10 border-b border-border/50">
                    {addingItemToCat === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input autoFocus value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(cat.id); if (e.key === "Escape") { setAddingItemToCat(null); setNewItemName(""); } }}
                          placeholder="Nombre del concepto..."
                          className="bg-white border border-cta rounded px-2 py-1 text-[13px] text-text outline-none w-48"
                        />
                        <Button variant="cta" size="sm" onClick={() => handleAddItem(cat.id)}>Añadir</Button>
                        <Button variant="ghost" size="sm" onClick={() => { setAddingItemToCat(null); setNewItemName(""); }}>Cancelar</Button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingItemToCat(cat.id)} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors">
                        <Plus size={12} />Añadir concepto
                      </button>
                    )}
                  </div>

                  {/* Subtotal */}
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

        {/* Add new category inline */}
        {showAddCat ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-cta">
            <input autoFocus value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddCat(); if (e.key === "Escape") { setShowAddCat(false); setNewCatName(""); } }}
              placeholder="Nombre de la categoría..."
              className="flex-1 bg-transparent text-[14px] font-semibold text-text outline-none"
            />
            <Button variant="cta" size="sm" onClick={handleAddCat}>Crear</Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowAddCat(false); setNewCatName(""); }}>Cancelar</Button>
          </div>
        ) : (
          <button onClick={() => setShowAddCat(true)} className="flex items-center gap-2 px-4 py-3 text-[13px] text-brand hover:text-cta transition-colors">
            <Plus size={14} />Nueva categoría
          </button>
        )}
      </div>

      {/* ── Footer total boxes ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        <TotalBox label="Real"       value={summary.totalReal}    />
        <TotalBox label="Diferencia" value={summary.totalEstimated - summary.totalReal} signed />
        <TotalBox label="Pagado"     value={summary.totalPaid}    color="text-[#4A773C]" />
        <TotalBox label="Pendiente"  value={summary.totalPending} color="text-cta" />
      </div>

      {/* ── Payment Modal ── */}
      <Modal open={showPayments} onClose={closePayments} className="max-w-xl">
        {/* Modal header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-[22px] text-text">Calendario de pagos</h2>
            {paymentContext && (
              <p className="text-[13px] text-brand mt-0.5">
                {paymentContext.catName}
                {paymentContext.vendorName && (
                  <> &mdash; <span className="italic">"{paymentContext.vendorName}"</span></>
                )}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="font-display text-[28px] text-cta leading-tight">
              {formatCurrency(payments.reduce((s, p) => s + p.amount, 0))}
            </div>
            <div className="text-[11px] text-brand uppercase tracking-wider">Total</div>
          </div>
        </div>

        {/* Add payment */}
        <button
          onClick={() => setShowAddPay((v) => !v)}
          className="flex items-center gap-1.5 text-[13px] text-cta hover:text-[#b08f5d] font-medium mb-4 transition-colors"
        >
          <Plus size={15} />
          {showAddPay ? "Cancelar" : "Añadir pago"}
        </button>

        {showAddPay && (
          <div className="bg-bg2 rounded-xl p-4 mb-4 space-y-3 border border-cta/30">
            <div className="grid grid-cols-2 gap-2">
              <input value={newPay.vendorName} onChange={(e) => setNewPay({ ...newPay, vendorName: e.target.value })}
                placeholder="Proveedor" autoFocus
                className="bg-[#f2efe9] border-none rounded-xl px-3 py-2 text-[13px] text-text outline-none focus:ring-2 focus:ring-cta/30" />
              <input type="number" value={newPay.amount} onChange={(e) => setNewPay({ ...newPay, amount: e.target.value })}
                placeholder="Cantidad (€)"
                className="bg-[#f2efe9] border-none rounded-xl px-3 py-2 text-[13px] text-text outline-none focus:ring-2 focus:ring-cta/30" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={newPay.dueDate} onChange={(e) => setNewPay({ ...newPay, dueDate: e.target.value })}
                className="bg-[#f2efe9] border-none rounded-xl px-3 py-2 text-[13px] text-text outline-none focus:ring-2 focus:ring-cta/30" />
              <input value={newPay.notes} onChange={(e) => setNewPay({ ...newPay, notes: e.target.value })}
                placeholder="Notas (ej: En efectivo)"
                className="bg-[#f2efe9] border-none rounded-xl px-3 py-2 text-[13px] text-text outline-none focus:ring-2 focus:ring-cta/30" />
            </div>
            <div className="flex justify-end">
              <Button variant="cta" size="sm" onClick={handleAddPayment} disabled={!newPay.amount}>Añadir</Button>
            </div>
          </div>
        )}

        {/* Column headers */}
        {payments.length > 0 && (
          <div className="grid grid-cols-[80px_1fr_100px_36px_1fr] gap-3 px-2 mb-1">
            {["Cantidad", "A pagar el", "Pagado", "", "Notas"].map((h) => (
              <div key={h} className="text-[10px] font-semibold text-brand uppercase tracking-wider">{h}</div>
            ))}
          </div>
        )}

        {/* Payment rows */}
        {payments.length === 0 && !showAddPay ? (
          <p className="text-[14px] text-brand text-center py-8">No hay pagos programados</p>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {[...payments]
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((p) => (
                <div key={p.id} className="grid grid-cols-[80px_1fr_100px_36px_1fr] gap-3 items-center px-2 py-2 rounded-xl hover:bg-bg2 transition-colors group/pay">
                  {/* Cantidad */}
                  <span className={`font-display text-[15px] font-semibold ${p.paid ? "line-through text-brand" : "text-text"}`}>
                    {formatCurrency(p.amount)}
                  </span>

                  {/* A pagar el */}
                  <div className="text-[12px] text-brand flex items-center gap-1.5">
                    {p.dueDate ? (
                      new Date(p.dueDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
                    ) : (
                      <CalendarDays size={16} className="text-brand/50" />
                    )}
                  </div>

                  {/* Vendor / concept label */}
                  <div className="text-[12px] text-text/60 truncate">
                    {p.vendorName || p.concept || "—"}
                  </div>

                  {/* Circle paid toggle */}
                  <button
                    onClick={() => handleTogglePaid(p)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      p.paid
                        ? "bg-[#4A773C] border-[#4A773C] text-white"
                        : "border-border hover:border-cta"
                    }`}
                  >
                    {p.paid && <Check size={13} strokeWidth={3} />}
                  </button>

                  {/* Notas */}
                  <input
                    defaultValue={p.notes ?? ""}
                    onBlur={(e) => handleUpdateNotes(p, e.target.value)}
                    placeholder="Notas..."
                    className="bg-transparent border-b border-border/50 focus:border-cta text-[12px] text-text/70 outline-none px-1 py-0.5 transition-colors placeholder:text-text/20"
                  />
                </div>
              ))}
          </div>
        )}

        {/* Footer totals */}
        {payments.length > 0 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
            <span className="text-[12px] text-brand">{payments.filter((p) => p.paid).length} de {payments.length} pagados</span>
            <div className="flex gap-4 text-[12px] font-medium">
              <span className="text-[#4A773C]">Pagado: {formatCurrency(payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0))}</span>
              <span className="text-cta">Pendiente: {formatCurrency(payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0))}</span>
            </div>
          </div>
        )}

        {/* Delete buttons */}
        {payments.length > 0 && (
          <div className="mt-2 space-y-1">
            {payments.map((p) =>
              deletingPayId === p.id ? (
                <span key={p.id} className="flex items-center gap-2 text-[12px] px-2">
                  <span className="text-text/50 truncate">{p.vendorName || p.concept}</span>
                  <button onClick={() => handleDeletePayment(p.id)} className="text-danger font-medium hover:underline">Eliminar</button>
                  <button onClick={() => setDeletingPayId(null)} className="text-brand hover:underline">Cancelar</button>
                </span>
              ) : null
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────── */

function TotalBox({ label, value, color = "text-text", signed = false }: {
  label: string; value: number; color?: string; signed?: boolean;
}) {
  const display = `${signed && value > 0 ? "+" : ""}${formatCurrency(value)}`;
  const actualColor = signed ? (value < 0 ? "text-danger" : value > 0 ? "text-success" : color) : color;
  return (
    <div className="bg-white border border-border rounded-2xl px-5 py-4 text-center shadow-card">
      <div className={`font-display text-[22px] font-semibold ${actualColor}`}>{display}</div>
      <div className="text-[11px] text-brand uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function NumCell({ value, isEditing, editValue, onStart, onChange, onSave, onKeyDown }: {
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
