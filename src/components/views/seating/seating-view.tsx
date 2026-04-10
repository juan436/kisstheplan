"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Download, Users } from "lucide-react";
import { useSeating } from "./hooks/use-seating";
import { PlanSelector } from "./components/plan-selector";
import { NewPlanModal } from "./components/new-plan-modal";
import { AddTableModal } from "./components/add-table-modal";
import { CanvasTab } from "./components/canvas-tab";
import { ListTab } from "./components/list-tab";

export default function SeatingView() {
  const {
    plans, guests, selectedPlanId, setSelectedPlanId,
    mode, setMode, activeTab, setActiveTab,
    loading, error,
    showNewPlan, setShowNewPlan,
    showAddTable, setShowAddTable,
    selectedPlan,
    handleCreatePlan, handleDeletePlan,
    handleAddTable, handleUpdateTablePos, handleUpdateTableSize, handleDeleteTable,
    handleRenameTable, handleAssignSeat,
  } = useSeating();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-[var(--color-text)]/60 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "#866857" }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <PlanSelector plans={plans} selectedId={selectedPlanId} onSelect={setSelectedPlanId} onNew={() => setShowNewPlan(true)} />

        {selectedPlan && (
          <div className="flex rounded-xl border border-[var(--color-border)] overflow-hidden bg-white" style={{ boxShadow: "0 2px 8px rgba(74,60,50,0.06)" }}>
            {(["layout", "seating"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 text-sm font-medium transition-all ${mode === m ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:bg-[var(--color-bg-2)]"}`}>
                {m === "layout" ? "DISTRIBUCIÓN" : "ASIENTOS"}
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => alert("Exportar a PDF — próximamente")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-white transition-colors" style={{ backgroundColor: "#866857" }}>
            <Download size={14} />
            Exportar PDF
          </button>
        </div>
      </div>

      {plans.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(140,111,95,0.12)" }}>
            <Users size={28} style={{ color: "#866857" }} />
          </div>
          <h3 className="font-playfair text-2xl text-[var(--color-text)] mb-2">Sin planos de mesas</h3>
          <p className="text-[var(--color-text)]/50 mb-6 max-w-sm">Crea tu primer plano para empezar a asignar asientos a los invitados</p>
          <button onClick={() => setShowNewPlan(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors" style={{ backgroundColor: "#866857" }}>
            <Plus size={16} />
            Crear primer plano
          </button>
        </motion.div>
      )}

      {selectedPlan && (
        <>
          <div className="flex gap-1 mb-4 border-b border-[var(--color-border)]">
            {(["canvas", "list"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-transparent text-[var(--color-text)]/50 hover:text-[var(--color-text)]"}`}>
                {tab === "canvas" ? "Plano visual" : "Listado por mesas"}
              </button>
            ))}
            <button onClick={() => handleDeletePlan(selectedPlan.id)} className="ml-auto mb-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text)]/40 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors">
              <Trash2 size={12} />
              Eliminar plano
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "canvas" ? (
              <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CanvasTab plan={selectedPlan} guests={guests} mode={mode} onUpdateTablePos={handleUpdateTablePos} onUpdateTableSize={handleUpdateTableSize} onAddTable={(shape) => setShowAddTable(shape)} onDeleteTable={handleDeleteTable} onAssignSeat={handleAssignSeat} />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ListTab plan={selectedPlan} guests={guests} onAddTable={(shape) => setShowAddTable(shape)} onDeleteTable={handleDeleteTable} onRenameTable={handleRenameTable} onAssignSeat={handleAssignSeat} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
        {showNewPlan && <NewPlanModal onClose={() => setShowNewPlan(false)} onCreate={handleCreatePlan} />}
        {showAddTable && (
          <AddTableModal defaultShape={showAddTable} onClose={() => setShowAddTable(null)} onAdd={({ name, shape, capacity }) => handleAddTable(shape, name, capacity)} />
        )}
      </AnimatePresence>
    </div>
  );
}
