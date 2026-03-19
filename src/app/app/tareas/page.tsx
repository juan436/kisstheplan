"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Plus,
  Calendar,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { api } from "@/services";
import type { Task } from "@/types";

// Category display order
const CATEGORY_ORDER = [
  "Organización",
  "Finca",
  "Catering",
  "Foto",
  "Vídeo",
  "Música",
  "Vestuario",
  "Decoración",
  "Papelería",
  "Invitados",
  "Transporte",
  "Belleza",
];

const ALL_CATEGORIES = [...CATEGORY_ORDER, "Otros"];

// Stage color map
function stageColor(stage?: string) {
  if (!stage) return "bg-fill text-text/50";
  if (stage.includes("12")) return "bg-fill-2/60 text-text/60";
  if (stage.includes("9-12")) return "bg-fill-2/60 text-text/60";
  if (stage.includes("6-8")) return "bg-brand/20 text-text/60";
  if (stage.includes("3-5")) return "bg-cta/15 text-cta";
  if (stage.includes("1-2")) return "bg-cta/25 text-cta";
  if (stage.includes("semana") || stage.includes("Semana"))
    return "bg-danger/15 text-danger";
  return "bg-fill text-text/50";
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "done") return false;
  return new Date(task.dueDate) < new Date();
}

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  // Pending edits per task (before save)
  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});
  const [pendingDates, setPendingDates] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});

  // Add task form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Organización");
  const [newStage, setNewStage] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(task: Task) {
    const newStatus = task.status === "done" ? "pending" : "done";
    setToggling((p) => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } finally {
      setToggling((p) => ({ ...p, [task.id]: false }));
    }
  }

  async function handleSaveDetails(task: Task) {
    const notes =
      pendingNotes[task.id] !== undefined
        ? pendingNotes[task.id]
        : task.notes;
    const dueDate =
      pendingDates[task.id] !== undefined
        ? pendingDates[task.id]
        : task.dueDate;
    setSaving((p) => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, {
        notes: notes || undefined,
        dueDate: dueDate || undefined,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setPendingNotes((p) => {
        const n = { ...p };
        delete n[task.id];
        return n;
      });
      setPendingDates((p) => {
        const n = { ...p };
        delete n[task.id];
        return n;
      });
      setExpandedId(null);
    } finally {
      setSaving((p) => ({ ...p, [task.id]: false }));
    }
  }

  async function handleDelete(id: string) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  async function handleAddTask() {
    if (!newTitle.trim()) return;
    setAddingTask(true);
    try {
      const task = await api.createTask({
        title: newTitle.trim(),
        category: newCategory,
        stage: newStage || undefined,
      });
      setTasks((prev) => [...prev, task]);
      setNewTitle("");
      setNewStage("");
      setShowAddForm(false);
    } finally {
      setAddingTask(false);
    }
  }

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    // Clear pending on close
    if (expandedId === id) {
      setPendingNotes((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
      setPendingDates((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
    }
  }

  // Group tasks by category, respecting CATEGORY_ORDER
  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const cat = task.category || "Otros";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(task);
    }
    const sorted: [string, Task[]][] = [];
    for (const cat of CATEGORY_ORDER) {
      if (map.has(cat)) sorted.push([cat, map.get(cat)!]);
    }
    for (const [cat, items] of map) {
      if (!CATEGORY_ORDER.includes(cat)) sorted.push([cat, items]);
    }
    return sorted;
  }, [tasks]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-semibold text-text"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              To Do List
            </h1>
            {!loading && (
              <p className="text-sm text-text/50 mt-0.5">
                {done} de {total} tareas completadas
              </p>
            )}
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "#866857" }}
          >
            <Plus size={16} />
            Añadir Tarea
          </button>
        </div>

        {/* Progress bar */}
        {!loading && total > 0 && (
          <div className="mb-8">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--color-fill)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--color-accent)" }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-text/40">0%</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-accent)" }}
              >
                {pct}% completado
              </span>
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mb-6 rounded-xl border p-4"
              style={{
                background: "var(--color-bg-2)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-sm font-semibold text-text"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Nueva Tarea
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTitle("");
                  }}
                  className="text-text/40 hover:text-text/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                    if (e.key === "Escape") {
                      setShowAddForm(false);
                      setNewTitle("");
                    }
                  }}
                  placeholder="Descripción de la tarea..."
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors placeholder:text-text/30"
                  style={{ borderColor: "var(--color-border)" }}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-text/50 mb-1">
                      Categoría
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {ALL_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-text/50 mb-1">
                      Etapa (opcional)
                    </label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value)}
                      className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <option value="">Sin etapa</option>
                      <option value="+12 meses">+12 meses</option>
                      <option value="9-12 meses">9-12 meses</option>
                      <option value="6-8 meses">6-8 meses</option>
                      <option value="3-5 meses">3-5 meses</option>
                      <option value="1-2 meses">1-2 meses</option>
                      <option value="Última semana">Última semana</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTitle("");
                    }}
                    className="px-4 py-2 rounded-lg text-sm text-text/60 hover:text-text/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddTask}
                    disabled={!newTitle.trim() || addingTask}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-40 transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {addingTask ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Añadir
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl animate-pulse"
                style={{ background: "var(--color-fill)" }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-fill)" }}
            >
              <Check size={28} style={{ color: "var(--color-brand)" }} />
            </div>
            <p
              className="text-lg font-medium text-text mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Sin tareas aún
            </p>
            <p className="text-sm text-text/50 mb-4">
              Añade tu primera tarea o carga la plantilla predefinida.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2 rounded-lg text-sm text-white font-medium"
              style={{ background: "#866857" }}
            >
              Añadir primera tarea
            </button>
          </div>
        )}

        {/* Category groups */}
        {!loading && grouped.length > 0 && (
          <div className="space-y-2">
            {grouped.map(([category, catTasks]) => {
              const collapsed = collapsedCategories.has(category);
              const catDone = catTasks.filter(
                (t) => t.status === "done"
              ).length;

              return (
                <div key={category}>
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-fill/50 group"
                    style={{ background: collapsed ? "transparent" : undefined }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold tracking-widest uppercase text-text/40"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {category}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: "var(--color-fill)",
                          color: "var(--color-text)",
                          opacity: 0.6,
                        }}
                      >
                        {catDone}/{catTasks.length}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className="text-text/30 transition-transform duration-200"
                      style={{
                        transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* Task rows */}
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2">
                          {catTasks.map((task) => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              expanded={expandedId === task.id}
                              toggling={!!toggling[task.id]}
                              saving={!!saving[task.id]}
                              pendingNote={pendingNotes[task.id]}
                              pendingDate={pendingDates[task.id]}
                              onToggle={() => handleToggle(task)}
                              onExpand={() => toggleExpand(task.id)}
                              onNoteChange={(v) =>
                                setPendingNotes((p) => ({
                                  ...p,
                                  [task.id]: v,
                                }))
                              }
                              onDateChange={(v) =>
                                setPendingDates((p) => ({
                                  ...p,
                                  [task.id]: v,
                                }))
                              }
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

// ──────────────────────────────────────────────────────────────────────────────
// TaskRow component
// ──────────────────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Task;
  expanded: boolean;
  toggling: boolean;
  saving: boolean;
  pendingNote?: string;
  pendingDate?: string;
  onToggle: () => void;
  onExpand: () => void;
  onNoteChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

function TaskRow({
  task,
  expanded,
  toggling,
  saving,
  pendingNote,
  pendingDate,
  onToggle,
  onExpand,
  onNoteChange,
  onDateChange,
  onSave,
  onDelete,
}: TaskRowProps) {
  const done = task.status === "done";
  const overdue = isOverdue(task);
  const hasPendingChanges =
    pendingNote !== undefined || pendingDate !== undefined;

  const noteVal = pendingNote !== undefined ? pendingNote : task.notes ?? "";
  const dateVal = pendingDate !== undefined ? pendingDate : task.dueDate ?? "";

  return (
    <div
      className="rounded-xl overflow-hidden transition-shadow"
      style={{
        background: done ? "transparent" : "var(--color-bg-2)",
        border: `1px solid ${done ? "transparent" : "var(--color-border)"}`,
      }}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer group"
        onClick={onExpand}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          disabled={toggling}
          className="shrink-0 transition-all"
        >
          {toggling ? (
            <div
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
              style={{ borderColor: "var(--color-brand)" }}
            >
              <Loader2
                size={10}
                className="animate-spin"
                style={{ color: "var(--color-brand)" }}
              />
            </div>
          ) : done ? (
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "var(--color-accent)" }}
            >
              <Check size={12} className="text-white" strokeWidth={2.5} />
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded-md border-2 hover:border-accent transition-colors"
              style={{ borderColor: "var(--color-border)" }}
            />
          )}
        </button>

        {/* Title */}
        <span
          className="flex-1 text-sm transition-all"
          style={{
            color: done
              ? "var(--color-text)"
              : overdue
              ? "#866857"
              : "var(--color-text)",
            opacity: done ? 0.4 : 1,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {task.title}
        </span>

        {/* Stage badge */}
        {task.stage && !done && (
          <span
            className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium ${stageColor(task.stage)}`}
          >
            {task.stage}
          </span>
        )}

        {/* Overdue indicator */}
        {overdue && !done && (
          <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium bg-danger/10 text-danger">
            Vencida
          </span>
        )}

        {/* Expand chevron */}
        <ChevronDown
          size={14}
          className="shrink-0 text-text/20 transition-transform duration-200 group-hover:text-text/40"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-1 space-y-3 border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* Date picker */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-text/50 mb-1.5">
                  <Calendar size={12} />
                  Fecha específica
                </label>
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors cursor-pointer"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-text/50 mb-1.5">
                  Notas
                </label>
                <textarea
                  value={noteVal}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Añade un comentario o nota..."
                  rows={2}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors resize-none placeholder:text-text/25"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 text-xs text-danger/60 hover:text-danger transition-colors"
                >
                  <Trash2 size={12} />
                  Eliminar tarea
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onExpand}
                    className="px-3 py-1.5 rounded-lg text-xs text-text/50 hover:text-text/70 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onSave}
                    disabled={saving || !hasPendingChanges}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white font-medium disabled:opacity-40 transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {saving ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Check size={11} />
                    )}
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
