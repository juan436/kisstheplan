"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  LayoutList,
  Clock,
} from "lucide-react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { Task } from "@/types";

// ─── constants ────────────────────────────────────────────────────────────────

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

const STAGE_ORDER = [
  "+12 meses",
  "9-12 meses",
  "6-8 meses",
  "3-5 meses",
  "1-2 meses",
  "Última semana",
];

const ALL_CATEGORIES = [...CATEGORY_ORDER, "Otros"];

function stageBadgeStyle(stage?: string): string {
  if (!stage) return "bg-fill text-text/40";
  if (stage.includes("+12")) return "bg-fill-2/70 text-text/50";
  if (stage.includes("9-12")) return "bg-fill-2/70 text-text/50";
  if (stage.includes("6-8")) return "bg-brand/20 text-text/50";
  if (stage.includes("3-5")) return "bg-cta/15 text-cta";
  if (stage.includes("1-2")) return "bg-cta/25 text-cta";
  if (stage.toLowerCase().includes("semana")) return "bg-danger/15 text-danger";
  return "bg-fill text-text/40";
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "done") return false;
  return new Date(task.dueDate) < new Date();
}

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

// ─── main component ───────────────────────────────────────────────────────────

export default function TasksView() {
  const { wedding } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"category" | "stage">("category");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Pending edits
  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});
  const [pendingDates, setPendingDates] = useState<Record<string, string>>({});
  const [pendingAssigned, setPendingAssigned] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Organización");
  const [newStage, setNewStage] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const assigneeOptions = useMemo(() => {
    const opts = [];
    if (wedding?.partner1Name) opts.push(wedding.partner1Name);
    if (wedding?.partner2Name) opts.push(wedding.partner2Name);
    opts.push("Colaborador");
    return opts;
  }, [wedding]);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      setTasks(await api.getTasks());
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(e: React.MouseEvent, task: Task) {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "pending" : "done";
    setToggling((p) => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      if (newStatus === "done") setExpandedId(null);
    } finally {
      setToggling((p) => ({ ...p, [task.id]: false }));
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  async function handleSave(task: Task) {
    const notes = pendingNotes[task.id] !== undefined ? pendingNotes[task.id] : task.notes;
    const dueDate = pendingDates[task.id] !== undefined ? pendingDates[task.id] : task.dueDate;
    const assigned = pendingAssigned[task.id] !== undefined ? pendingAssigned[task.id] : undefined;
    setSaving((p) => ({ ...p, [task.id]: true }));
    try {
      const updateData: Parameters<typeof api.updateTask>[1] = {};
      if (notes !== undefined) updateData.notes = notes || undefined;
      if (dueDate !== undefined) updateData.dueDate = dueDate || undefined;
      // assigned saved as note prefix for now (no collaborator API yet)
      if (assigned && !notes?.startsWith("@")) {
        updateData.notes = (assigned ? `@${assigned} ` : "") + (notes || "");
      }
      const updated = await api.updateTask(task.id, updateData);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setPendingNotes((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingDates((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingAssigned((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setExpandedId(null);
    } finally {
      setSaving((p) => ({ ...p, [task.id]: false }));
    }
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
      setShowAdd(false);
    } finally {
      setAddingTask(false);
    }
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setPendingNotes((p) => { const n = { ...p }; delete n[id]; return n; });
      setPendingDates((p) => { const n = { ...p }; delete n[id]; return n; });
      setPendingAssigned((p) => { const n = { ...p }; delete n[id]; return n; });
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  }

  function toggleSection(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // ── grouping ──────────────────────────────────────────────────────────────

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const k = t.category || "Otros";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    const result: [string, Task[]][] = [];
    for (const c of CATEGORY_ORDER) if (map.has(c)) result.push([c, map.get(c)!]);
    for (const [k, v] of map) if (!CATEGORY_ORDER.includes(k)) result.push([k, v]);
    return result;
  }, [tasks]);

  const groupedByStage = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const k = t.stage || "Sin etapa";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    const result: [string, Task[]][] = [];
    for (const s of STAGE_ORDER) if (map.has(s)) result.push([s, map.get(s)!]);
    if (map.has("Sin etapa")) result.push(["Sin etapa", map.get("Sin etapa")!]);
    return result;
  }, [tasks]);

  const grouped = view === "category" ? groupedByCategory : groupedByStage;

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
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
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "#866857" }}
        >
          <Plus size={15} />
          Añadir Tarea
        </button>
      </div>

      {/* Progress bar */}
      {!loading && total > 0 && (
        <div className="mb-6">
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
            <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>
              {pct}% completado
            </span>
          </div>
        </div>
      )}

      {/* View toggle */}
      {!loading && total > 0 && (
        <div
          className="flex items-center gap-1 p-1 rounded-lg mb-6 w-fit"
          style={{ background: "var(--color-fill)" }}
        >
          <button
            onClick={() => setView("category")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: view === "category" ? "white" : "transparent",
              color: view === "category" ? "var(--color-text)" : "var(--color-text)",
              opacity: view === "category" ? 1 : 0.45,
              boxShadow: view === "category" ? "0 1px 3px rgba(74,60,50,0.1)" : "none",
            }}
          >
            <LayoutList size={13} />
            Por categoría
          </button>
          <button
            onClick={() => setView("stage")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: view === "stage" ? "white" : "transparent",
              color: "var(--color-text)",
              opacity: view === "stage" ? 1 : 0.45,
              boxShadow: view === "stage" ? "0 1px 3px rgba(74,60,50,0.1)" : "none",
            }}
          >
            <Clock size={13} />
            Por fecha
          </button>
        </div>
      )}

      {/* Add Task Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mb-5 rounded-xl border p-4"
            style={{ background: "var(--color-bg-2)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold text-text"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Nueva Tarea
              </h3>
              <button
                onClick={() => { setShowAdd(false); setNewTitle(""); }}
                className="text-text/40 hover:text-text/70 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") { setShowAdd(false); setNewTitle(""); }
                }}
                placeholder="Descripción de la tarea..."
                className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors placeholder:text-text/30"
                style={{ borderColor: "var(--color-border)" }}
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-text/50 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-text/50 mb-1">Etapa</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <option value="">Sin etapa</option>
                    {STAGE_ORDER.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAdd(false); setNewTitle(""); }}
                  className="px-4 py-2 rounded-lg text-sm text-text/55 hover:text-text/75 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTitle.trim() || addingTask}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-40 transition-opacity hover:opacity-90"
                  style={{ background: "var(--color-accent)" }}
                >
                  {addingTask ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Añadir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-11 rounded-xl animate-pulse"
              style={{ background: "var(--color-fill)" }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && tasks.length === 0 && (
        <div className="text-center py-16">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--color-fill)" }}
          >
            <Check size={24} style={{ color: "var(--color-brand)" }} />
          </div>
          <p
            className="text-lg font-medium text-text mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Sin tareas aún
          </p>
          <p className="text-sm text-text/50 mb-5">
            Añade tu primera tarea para empezar a organizar tu boda.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-5 py-2 rounded-lg text-sm text-white font-medium"
            style={{ background: "#866857" }}
          >
            Añadir primera tarea
          </button>
        </div>
      )}

      {/* Grouped list */}
      {!loading && grouped.length > 0 && (
        <div className="space-y-1">
          {grouped.map(([groupKey, groupTasks]) => {
            const isCollapsed = collapsed.has(groupKey);
            const groupDone = groupTasks.filter((t) => t.status === "done").length;

            return (
              <div key={groupKey}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(groupKey)}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg transition-colors hover:bg-fill/40 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-[13px] font-semibold tracking-wide text-text/70"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {groupKey}
                    </span>
                    <span
                      className="text-[11px] px-1.5 py-0.5 rounded-full text-text/40"
                      style={{ background: "var(--color-fill)" }}
                    >
                      {groupDone}/{groupTasks.length}
                    </span>
                  </div>
                  <ChevronDown
                    size={13}
                    className="text-text/25 transition-transform duration-200"
                    style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 mb-3">
                        {groupTasks.map((task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            expanded={expandedId === task.id}
                            toggling={!!toggling[task.id]}
                            saving={!!saving[task.id]}
                            pendingNote={pendingNotes[task.id]}
                            pendingDate={pendingDates[task.id]}
                            pendingAssigned={pendingAssigned[task.id]}
                            assigneeOptions={assigneeOptions}
                            onToggle={(e) => handleToggle(e, task)}
                            onExpand={() => toggleExpand(task.id)}
                            onDelete={(e) => handleDelete(e, task.id)}
                            onNoteChange={(v) => setPendingNotes((p) => ({ ...p, [task.id]: v }))}
                            onDateChange={(v) => setPendingDates((p) => ({ ...p, [task.id]: v }))}
                            onAssignedChange={(v) => setPendingAssigned((p) => ({ ...p, [task.id]: v }))}
                            onSave={() => handleSave(task)}
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
  );
}

// ─── TaskRow ──────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Task;
  expanded: boolean;
  toggling: boolean;
  saving: boolean;
  pendingNote?: string;
  pendingDate?: string;
  pendingAssigned?: string;
  assigneeOptions: string[];
  onToggle: (e: React.MouseEvent) => void;
  onExpand: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onNoteChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onAssignedChange: (v: string) => void;
  onSave: () => void;
}

function TaskRow({
  task,
  expanded,
  toggling,
  saving,
  pendingNote,
  pendingDate,
  pendingAssigned,
  assigneeOptions,
  onToggle,
  onExpand,
  onDelete,
  onNoteChange,
  onDateChange,
  onAssignedChange,
  onSave,
}: TaskRowProps) {
  const done = task.status === "done";
  const overdue = isOverdue(task);
  const [hovered, setHovered] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  const noteVal = pendingNote !== undefined ? pendingNote : (task.notes ?? "");
  const dateVal = pendingDate !== undefined ? pendingDate : (task.dueDate ?? "");
  const assignedVal = pendingAssigned !== undefined ? pendingAssigned : "";

  const hasPending = pendingNote !== undefined || pendingDate !== undefined || pendingAssigned !== undefined;

  function handleStageBadgeClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowDatePicker(true);
    setTimeout(() => dateRef.current?.showPicker?.(), 50);
  }

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: done ? "transparent" : "var(--color-bg-2)",
        border: expanded
          ? "1.5px solid #7db87d"
          : done
          ? "1px solid transparent"
          : "1px solid var(--color-border)",
        boxShadow: expanded ? "0 0 0 3px rgba(125,184,125,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Main row ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onExpand}
      >
        {/* Task title */}
        <span
          className="flex-1 text-sm transition-all"
          style={{
            color: overdue && !done ? "#866857" : "var(--color-text)",
            opacity: done ? 0.38 : 1,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {task.title}
        </span>

        {/* Right side: date/stage indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Date / stage badge — clickable to set date */}
          {!done && (
            <div className="relative">
              <button
                onClick={handleStageBadgeClick}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                  task.dueDate
                    ? overdue
                      ? "bg-danger/10 text-danger"
                      : "bg-success/15 text-success"
                    : stageBadgeStyle(task.stage)
                }`}
                title="Cambiar fecha"
              >
                {task.dueDate
                  ? overdue
                    ? `Vencida · ${formatDate(task.dueDate)}`
                    : formatDate(task.dueDate)
                  : task.stage || "—"}
              </button>
              {/* Hidden date input */}
              {showDatePicker && (
                <input
                  ref={dateRef}
                  type="date"
                  value={dateVal}
                  onChange={(e) => {
                    onDateChange(e.target.value);
                    setShowDatePicker(false);
                  }}
                  onBlur={() => setShowDatePicker(false)}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  style={{ top: 0, left: 0 }}
                />
              )}
            </div>
          )}

          {/* Trash icon — visible on hover or expanded */}
          <AnimatePresence>
            {(hovered || expanded) && !done && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.12 }}
                onClick={onDelete}
                className="p-1 rounded-md text-text/25 hover:text-danger/70 transition-colors"
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Circle check */}
          <button
            onClick={onToggle}
            disabled={toggling}
            className="shrink-0 transition-all"
            title={done ? "Marcar como pendiente" : "Marcar como completada"}
          >
            {toggling ? (
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "var(--color-brand)" }}>
                <Loader2 size={10} className="animate-spin" style={{ color: "var(--color-brand)" }} />
              </div>
            ) : done ? (
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                <Check size={11} className="text-white" strokeWidth={2.5} />
              </div>
            ) : (
              <div
                className="w-5 h-5 rounded-full border-2 transition-colors"
                style={{
                  borderColor: hovered || expanded ? "var(--color-accent)" : "var(--color-border)",
                  background: "transparent",
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* ── Expanded panel ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-2 space-y-3 border-t"
              style={{ borderColor: "rgba(125,184,125,0.25)" }}
            >
              {/* Date picker (full) */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-text/45 mb-1.5">
                  <Calendar size={11} />
                  Fecha específica
                </label>
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-green-400/60 transition-colors cursor-pointer"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              {/* Assign collaborator */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-text/45 mb-1.5">
                  <User size={11} />
                  Asignar a
                </label>
                <select
                  value={assignedVal}
                  onChange={(e) => onAssignedChange(e.target.value)}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-green-400/60 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <option value="">Sin asignar</option>
                  {assigneeOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-xs text-text/45 mb-1.5">
                  <MessageSquare size={11} />
                  Añadir comentario
                </label>
                <textarea
                  value={noteVal}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Notas internas..."
                  rows={2}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-green-400/60 transition-colors resize-none placeholder:text-text/25"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              {/* Save / cancel */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={onExpand}
                  className="px-3 py-1.5 rounded-lg text-xs text-text/50 hover:text-text/70 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onSave}
                  disabled={saving || !hasPending}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs text-white font-medium disabled:opacity-35 transition-opacity hover:opacity-90"
                  style={{ background: "#7db87d" }}
                >
                  {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
