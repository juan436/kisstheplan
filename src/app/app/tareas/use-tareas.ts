import { useState, useEffect, useMemo } from "react";
import { api } from "@/services";
import type { Task } from "@/types";
import { CATEGORY_ORDER } from "@/constants/task-constants";
import { isOverdue } from "@/constants/task-constants";

export { isOverdue };

export function useTareas() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [pendingNotes, setPendingNotes] = useState<Record<string, string>>({});
  const [pendingDates, setPendingDates] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Organización");
  const [newStage, setNewStage] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    setLoading(true);
    try { setTasks(await api.getTasks()); }
    finally { setLoading(false); }
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
    const notes = pendingNotes[task.id] !== undefined ? pendingNotes[task.id] : task.notes;
    const dueDate = pendingDates[task.id] !== undefined ? pendingDates[task.id] : task.dueDate;
    setSaving((p) => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, { notes: notes || undefined, dueDate: dueDate || undefined });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setPendingNotes((p) => { const n = { ...p }; delete n[task.id]; return n; });
      setPendingDates((p) => { const n = { ...p }; delete n[task.id]; return n; });
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
      const task = await api.createTask({ title: newTitle.trim(), category: newCategory, stage: newStage || undefined });
      setTasks((prev) => [...prev, task]);
      setNewTitle(""); setNewStage(""); setShowAddForm(false);
    } finally { setAddingTask(false); }
  }

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    if (expandedId === id) {
      setPendingNotes((p) => { const n = { ...p }; delete n[id]; return n; });
      setPendingDates((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const cat = task.category || "Otros";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(task);
    }
    const sorted: [string, Task[]][] = [];
    for (const cat of CATEGORY_ORDER) { if (map.has(cat)) sorted.push([cat, map.get(cat)!]); }
    for (const [cat, items] of map) { if (!CATEGORY_ORDER.includes(cat)) sorted.push([cat, items]); }
    return sorted;
  }, [tasks]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    tasks, loading, expandedId, collapsedCategories,
    pendingNotes, pendingDates, saving, toggling,
    showAddForm, newTitle, newCategory, newStage, addingTask,
    grouped, total, done, pct,
    setShowAddForm, setNewTitle, setNewCategory, setNewStage,
    setPendingNotes, setPendingDates,
    handleToggle, handleSaveDetails, handleDelete, handleAddTask,
    toggleCategory, toggleExpand,
  };
}
