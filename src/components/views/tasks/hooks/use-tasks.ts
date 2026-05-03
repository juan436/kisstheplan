"use client";

/**
 * useTasks
 *
 * Qué hace: hook principal de tareas; carga, filtra, agrupa y expone CRUD de tareas.
 * Recibe:   nada (obtiene weddingId desde useAuth internamente).
 * Provee:   tasks agrupadas, filtros activos, handlers de completar/añadir/eliminar + estado UI.
 */

import { useState, useMemo } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useCrud } from "@/hooks/use-crud";
import type { Task } from "@/types";
import type { CreateTaskData } from "@/services/api";
import { CATEGORY_ORDER, STAGE_ORDER } from "../constants/tasks.constants";

export function useTasks() {
  const { wedding } = useAuth();
  const {
    items: tasks, setItems: setTasks, loading,
    create: createTask, remove: removeTask,
  } = useCrud<Task, CreateTaskData, never>({
    load:   () => api.getTasks(),
    create: (data) => api.createTask(data),
    remove: (id) => api.deleteTask(id),
  });

  const [view,       setView]       = useState<"category" | "stage">("category");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsed,  setCollapsed]  = useState<Set<string>>(new Set());
  const [pendingNotes,    setPendingNotes]    = useState<Record<string, string>>({});
  const [pendingDates,    setPendingDates]    = useState<Record<string, string>>({});
  const [pendingAssigned, setPendingAssigned] = useState<Record<string, string>>({});
  const [saving,   setSaving]   = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [showAdd,     setShowAdd]     = useState(false);
  const [newTitle,    setNewTitle]    = useState("");
  const [newCategory, setNewCategory] = useState("Organización");
  const [newStage,    setNewStage]    = useState("");
  const [addingTask,  setAddingTask]  = useState(false);

  const assigneeOptions = useMemo(() => {
    const opts: string[] = [];
    if (wedding?.partner1Name) opts.push(wedding.partner1Name);
    if (wedding?.partner2Name) opts.push(wedding.partner2Name);
    opts.push("Colaborador");
    return opts;
  }, [wedding]);

  async function handleToggle(e: React.MouseEvent, task: Task) {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "pending" : "done";
    setToggling(p => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      if (newStatus === "done") setExpandedId(null);
    } finally {
      setToggling(p => { const n = { ...p }; delete n[task.id]; return n; });
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    await removeTask(id);
    if (expandedId === id) setExpandedId(null);
  }

  async function handleSave(task: Task) {
    const notes   = pendingNotes[task.id]    !== undefined ? pendingNotes[task.id]    : task.notes;
    const dueDate = pendingDates[task.id]    !== undefined ? pendingDates[task.id]    : task.dueDate;
    const assigned = pendingAssigned[task.id];
    setSaving(p => ({ ...p, [task.id]: true }));
    try {
      const data: Parameters<typeof api.updateTask>[1] = {};
      if (notes    !== undefined) data.notes   = notes    || undefined;
      if (dueDate  !== undefined) data.dueDate = dueDate  || undefined;
      if (assigned && !notes?.startsWith("@")) data.notes = `@${assigned} ` + (notes || "");
      const updated = await api.updateTask(task.id, data);
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      setPendingNotes(p    => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingDates(p    => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingAssigned(p => { const n = { ...p }; delete n[task.id]; return n; });
      setExpandedId(null);
    } finally {
      setSaving(p => { const n = { ...p }; delete n[task.id]; return n; });
    }
  }

  async function handleAddTask() {
    if (!newTitle.trim()) return;
    setAddingTask(true);
    try {
      await createTask({ title: newTitle.trim(), category: newCategory, stage: newStage || undefined });
      setNewTitle(""); setNewStage(""); setShowAdd(false);
    } finally { setAddingTask(false); }
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setPendingNotes(p    => { const n = { ...p }; delete n[id]; return n; });
      setPendingDates(p    => { const n = { ...p }; delete n[id]; return n; });
      setPendingAssigned(p => { const n = { ...p }; delete n[id]; return n; });
      setExpandedId(null);
    } else { setExpandedId(id); }
  }

  function toggleSection(key: string) {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) { const k = t.category || "Otros"; if (!map.has(k)) map.set(k, []); map.get(k)!.push(t); }
    const result: [string, Task[]][] = [];
    for (const c of CATEGORY_ORDER) if (map.has(c)) result.push([c, map.get(c)!]);
    for (const [k, v] of map) if (!CATEGORY_ORDER.includes(k)) result.push([k, v]);
    return result;
  }, [tasks]);

  const groupedByStage = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) { const k = t.stage || "Sin etapa"; if (!map.has(k)) map.set(k, []); map.get(k)!.push(t); }
    const result: [string, Task[]][] = [];
    for (const s of STAGE_ORDER) if (map.has(s)) result.push([s, map.get(s)!]);
    if (map.has("Sin etapa")) result.push(["Sin etapa", map.get("Sin etapa")!]);
    return result;
  }, [tasks]);

  const grouped = view === "category" ? groupedByCategory : groupedByStage;
  const total = tasks.length;
  const done  = tasks.filter(t => t.status === "done").length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    tasks, loading, view, setView, expandedId, collapsed,
    pendingNotes, setPendingNotes, pendingDates, setPendingDates, pendingAssigned, setPendingAssigned,
    saving, toggling, showAdd, setShowAdd, newTitle, setNewTitle,
    newCategory, setNewCategory, newStage, setNewStage, addingTask,
    assigneeOptions, grouped, total, done, pct,
    handleToggle, handleDelete, handleSave, handleAddTask, toggleExpand, toggleSection,
  };
}
