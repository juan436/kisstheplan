"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Check, LayoutList, Clock } from "lucide-react";
import { useTasks } from "./hooks/use-tasks";
import { TaskRow } from "./components/task-row";
import { AddTaskForm } from "./components/add-task-form";

export default function TasksView() {
  const {
    tasks, loading, view, setView, expandedId, collapsed,
    pendingNotes, setPendingNotes, pendingDates, setPendingDates, pendingAssigned, setPendingAssigned,
    saving, toggling, showAdd, setShowAdd, newTitle, setNewTitle,
    newCategory, setNewCategory, newStage, setNewStage, addingTask,
    assigneeOptions, grouped, total, done, pct,
    handleToggle, handleDelete, handleSave, handleAddTask, toggleExpand, toggleSection,
  } = useTasks();

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-text" style={{ fontFamily: "Playfair Display, serif" }}>To Do List</h1>
          {!loading && <p className="text-sm text-text/50 mt-0.5">{done} de {total} tareas completadas</p>}
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "#866857" }}>
          <Plus size={15} />Añadir Tarea
        </button>
      </div>

      {!loading && total > 0 && (
        <div className="mb-6">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-fill)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "var(--color-accent)" }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>{pct}% completado</span>
          </div>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="flex items-center gap-1 p-1 rounded-lg mb-6 w-fit" style={{ background: "var(--color-fill)" }}>
          {(["category", "stage"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{ background: view === v ? "white" : "transparent", color: "var(--color-text)", opacity: view === v ? 1 : 0.45, boxShadow: view === v ? "0 1px 3px rgba(74,60,50,0.1)" : "none" }}>
              {v === "category" ? <><LayoutList size={13} />Por categoría</> : <><Clock size={13} />Por fecha</>}
            </button>
          ))}
        </div>
      )}

      <AddTaskForm show={showAdd} newTitle={newTitle} newCategory={newCategory} newStage={newStage}
        addingTask={addingTask} onTitleChange={setNewTitle} onCategoryChange={setNewCategory}
        onStageChange={setNewStage} onAdd={handleAddTask}
        onClose={() => { setShowAdd(false); setNewTitle(""); }} />

      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-11 rounded-xl animate-pulse" style={{ background: "var(--color-fill)" }} />)}
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--color-fill)" }}>
            <Check size={24} style={{ color: "var(--color-brand)" }} />
          </div>
          <p className="text-lg font-medium text-text mb-1" style={{ fontFamily: "Playfair Display, serif" }}>Sin tareas aún</p>
          <p className="text-sm text-text/50 mb-5">Añade tu primera tarea para empezar a organizar tu boda.</p>
          <button onClick={() => setShowAdd(true)} className="px-5 py-2 rounded-lg text-sm text-white font-medium" style={{ background: "#866857" }}>
            Añadir primera tarea
          </button>
        </div>
      )}

      {!loading && grouped.length > 0 && (
        <div className="space-y-1">
          {grouped.map(([groupKey, groupTasks]) => {
            const isCollapsed = collapsed.has(groupKey);
            const groupDone = groupTasks.filter((t) => t.status === "done").length;
            return (
              <div key={groupKey}>
                <button onClick={() => toggleSection(groupKey)}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg transition-colors hover:bg-fill/40 group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] font-semibold tracking-wide text-text/70" style={{ fontFamily: "Playfair Display, serif" }}>{groupKey}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full text-text/40" style={{ background: "var(--color-fill)" }}>{groupDone}/{groupTasks.length}</span>
                  </div>
                  <ChevronDown size={13} className="text-text/25 transition-transform duration-200" style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }} />
                </button>
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
                      <div className="space-y-1 mb-3">
                        {groupTasks.map((task) => (
                          <TaskRow key={task.id} task={task} expanded={expandedId === task.id}
                            toggling={!!toggling[task.id]} saving={!!saving[task.id]}
                            pendingNote={pendingNotes[task.id]} pendingDate={pendingDates[task.id]}
                            pendingAssigned={pendingAssigned[task.id]} assigneeOptions={assigneeOptions}
                            onToggle={(e) => handleToggle(e, task)} onExpand={() => toggleExpand(task.id)}
                            onDelete={(e) => handleDelete(e, task.id)}
                            onNoteChange={(v) => setPendingNotes((p) => ({ ...p, [task.id]: v }))}
                            onDateChange={(v) => setPendingDates((p) => ({ ...p, [task.id]: v }))}
                            onAssignedChange={(v) => setPendingAssigned((p) => ({ ...p, [task.id]: v }))}
                            onSave={() => handleSave(task)} />
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
  );
}
