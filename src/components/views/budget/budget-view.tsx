"use client";

import { Plus, FileDown, FileSpreadsheet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useBudget } from "./hooks/use-budget";
import { BudgetTable } from "./components/table/budget-table";
import { CategoryModal } from "./components/payments/modals/category-modal";
import { TotalBox } from "./components/utils/total-box";

export default function PresupuestoPage() {
  const b = useBudget();

  if (!b.summary) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-brand text-[14px]">Cargando...</div>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header: total + bar + actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <p className="font-display text-[22px] text-text">
            Presupuesto total: <span className="text-cta">{formatCurrency(b.totalBudget)}</span>
          </p>
          <div className="space-y-1.5">
            <div className="relative h-3 bg-[#e8e2d8] rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-[#8fba88]" style={{ width: `${b.enteredPct}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-[#4A773C]" style={{ width: `${b.paidPct}%` }} />
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4A773C] inline-block" />Pagado {formatCurrency(b.summary.totalPaid)}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8fba88] inline-block" />Comprometido {formatCurrency(b.summary.totalReal)}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#e8e2d8] inline-block" />Restante {formatCurrency(Math.max(0, b.totalBudget - b.summary.totalReal))}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={() => b.setShowAddCat(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#CBA978] hover:bg-[#b08f5d] text-white text-[13px] font-semibold transition-colors">
            <Plus size={15} />Añadir Categoría
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8bfb5] hover:bg-[#b5aaa0] text-white text-[13px] font-semibold transition-colors">
            <FileDown size={15} />Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c8bfb5] hover:bg-[#b5aaa0] text-white text-[13px] font-semibold transition-colors">
            <FileSpreadsheet size={15} />Exportar Excel
          </button>
        </div>
      </div>

      {/* Column headers + table — scroll horizontal en mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 mb-3">
            <div />
            {["Estimado", "Real", "Diferencia", "Pagado", "Pendiente"].map((label) => (
              <div key={label} className="flex justify-center">
                <span className="px-3 py-1 rounded-full bg-[#e8e0d8] text-[#866857] text-[11px] font-semibold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>

          <BudgetTable
            categories={b.categories} collapsed={b.collapsed} toggleCollapse={b.toggleCollapse}
            isEditing={b.isEditing} editValue={b.editValue} setEditValue={b.setEditValue} startEdit={b.startEdit}
            saveEdit={b.saveEdit} handleKeyDown={b.handleKeyDown}
            deletingId={b.deletingId} setDeletingId={b.setDeletingId}
            addingItemToCat={b.addingItemToCat} newItemName={b.newItemName}
            setAddingItemToCat={b.setAddingItemToCat} setNewItemName={b.setNewItemName}
            handleAddItem={b.handleAddItem} handleDeleteCat={b.handleDeleteCat} handleDeleteItem={b.handleDeleteItem}
            openPayments={b.openPayments} showAddCat={b.showAddCat} newCatName={b.newCatName}
            setShowAddCat={b.setShowAddCat} setNewCatName={b.setNewCatName} handleAddCat={b.handleAddCat}
            loadData={b.loadData}
          />
        </div>
      </div>

      {/* Footer totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        <TotalBox label="Real"       value={b.summary.totalReal} />
        <TotalBox label="Diferencia" value={b.summary.totalEstimated - b.summary.totalReal} signed />
        <TotalBox label="Pagado"     value={b.summary.totalPaid}    color="text-[#4A773C]" />
        <TotalBox label="Pendiente"  value={b.summary.totalPending} color="text-cta" />
      </div>

      <CategoryModal
        open={b.showPayments} onClose={b.closePayments}
        paymentCat={b.paymentCat} onRefresh={b.loadData}
      />
    </div>
  );
}
