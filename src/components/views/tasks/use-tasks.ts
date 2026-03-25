"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { Task } from "@/types";
import { CATEGORY_ORDER, STAGE_ORDER } from "./tasks-constants";

export function useTasks() {
  const { wedding } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"category" | "stage">("category");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});
  const [pendingDates, setPendingDates] = useState<Record<string, string>>({});
  const [pendingAssigned, setPendingAssigned] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});

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
    try { setTasks(await api.getTasks()); } finally { setLoading(false); }
  }

  async function handleToggle(e: React.MouseEvent, task: Task) {
    e.stopPropagation();
    const newStatus = task.status === "done" ? "pending" : "done";
    setToggling((p) => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      if (newStatus === "done") setExpandedId(null);
    } finally { setToggling((p) => ({ ...p, [task.id]: false })); }
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
      if (assigned && !notes?.startsWith("@")) {
        updateData.notes = (assigned ? `@${assigned} ` : "") + (notes || "");
      }
      const updated = await api.updateTask(task.id, updateData);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setPendingNotes((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingDates((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingAssigned((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setExpandedId(null);
    } finally { setSaving((p) => ({ ...p, [task.id]: false })); }
  }

  async function handleAddTask() {
    if (!newTitle.trim()) return;
    setAddingTask(true);
    try {
      const task = await api.createTask({ title: newTitle.trim(), category: newCategory, stage: newStage || undefined });
      setTasks((prev) => [...prev, task]);
      setNewTitle(""); setNewStage(""); setShowAdd(false);
    } finally { setAddingTask(false); }
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setPendingNotes((p) => { const n = { ...p }; delete n[id]; return n; });
      setPendingDates((p) => { const n = { ...p }; delete n[id]; return n; });
      setPendingAssigned((p) => { const n = { ...p }; delete n[id]; return n; });
      setExpandedId(null);
    } else { setExpandedId(id); }
  }

  function toggleSection(key: string) {
    setCollapsed((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
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
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    tasks, loading, view, setView, expandedId, collapsed,
    pendingNotes, setPendingNotes, pendingDates, setPendingDates, pendingAssigned, setPendingAssigned,
    saving, toggling, showAdd, setShowAdd, newTitle, setNewTitle,
    newCategory, setNewCategory, newStage, setNewStage, addingTask,
    assigneeOptions, grouped, total, done, pct,
    handleToggle, handleDelete, handleSave, handleAddTask, toggleExpand, toggleSection,
  };
}
