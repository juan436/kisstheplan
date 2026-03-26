"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useTareas } from "./use-tareas";
import { TaskRow } from "./tareas-task-row";
import { TareasAddForm } from "./tareas-add-form";

export default function TareasPage() {
  const {
    loading, grouped, total, done, pct,
    expandedId, collapsedCategories, pendingNotes, pendingDates, saving, toggling,
    showAddForm, newTitle, newCategory, newStage, addingTask,
    setShowAddForm, setNewTitle, setNewCategory, setNewStage,
    setPendingNotes, setPendingDates,
    handleToggle, handleSaveDetails, handleDelete, handleAddTask,
    toggleCategory, toggleExpand,
  } = useTareas();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text" style={{ fontFamily: "Playfair Display, serif" }}>To Do List</h1>
            {!loading && <p className="text-sm text-text/50 mt-0.5">{done} de {total} tareas completadas</p>}
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: "#866857" }}>
            <Plus size={16} />Añadir Tarea
          </button>
        </div>

        {/* Progress bar */}
        {!loading && total > 0 && (
          <div className="mb-8">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-fill)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "var(--color-accent)" }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-text/40">0%</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>{pct}% completado</span>
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <AnimatePresence>
          {showAddForm && (
            <TareasAddForm
              newTitle={newTitle} newCategory={newCategory} newStage={newStage} addingTask={addingTask}
              setNewTitle={setNewTitle} setNewCategory={setNewCategory} setNewStage={setNewStage}
              onAdd={handleAddTask}
              onClose={() => { setShowAddForm(false); setNewTitle(""); }}
            />
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "var(--color-fill)" }} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && total === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--color-fill)" }}>
              <Check size={28} style={{ color: "var(--color-brand)" }} />
            </div>
            <p className="text-lg font-medium text-text mb-1" style={{ fontFamily: "Playfair Display, serif" }}>Sin tareas aún</p>
            <p className="text-sm text-text/50 mb-4">Añade tu primera tarea o carga la plantilla predefinida.</p>
            <button onClick={() => setShowAddForm(true)} className="px-5 py-2 rounded-lg text-sm text-white font-medium" style={{ background: "#866857" }}>Añadir primera tarea</button>
          </div>
        )}

        {/* Category groups */}
        {!loading && grouped.length > 0 && (
          <div className="space-y-2">
            {grouped.map(([category, catTasks]) => {
              const collapsed = collapsedCategories.has(category);
              const catDone = catTasks.filter((t) => t.status === "done").length;
              return (
                <div key={category}>
                  <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-fill/50 group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold tracking-widest uppercase text-text/40" style={{ fontFamily: "Playfair Display, serif" }}>{category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--color-fill)", color: "var(--color-text)", opacity: 0.6 }}>{catDone}/{catTasks.length}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text/30 transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} className="overflow-hidden">
                        <div className="space-y-1 pb-2">
                          {catTasks.map((task) => (
                            <TaskRow
                              key={task.id} task={task}
                              expanded={expandedId === task.id}
                              toggling={!!toggling[task.id]} saving={!!saving[task.id]}
                              pendingNote={pendingNotes[task.id]} pendingDate={pendingDates[task.id]}
                              onToggle={() => handleToggle(task)}
                              onExpand={() => toggleExpand(task.id)}
                              onNoteChange={(v) => setPendingNotes((p) => ({ ...p, [task.id]: v }))}
                              onDateChange={(v) => setPendingDates((p) => ({ ...p, [task.id]: v }))}
                              onSave={() => handleSaveDetails(task)}
                              onDelete={() => handleDelete(task.id)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
