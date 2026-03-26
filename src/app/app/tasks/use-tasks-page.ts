import { useState, useMemo } from "react";
import { api } from "@/services";
import { useCrud } from "@/hooks/use-crud";
import { usePendingMap } from "@/hooks/use-pending-map";
import type { Task } from "@/types";
import type { CreateTaskData } from "@/services/api";
import { CATEGORY_ORDER, isOverdue } from "@/constants/task-constants";

export { isOverdue };

export function useTasksPage() {
  const {
    items: tasks, setItems: setTasks, loading,
    create: createTask, remove: removeTask,
  } = useCrud<Task, CreateTaskData, never>({
    load:   () => api.getTasks(),
    create: (data) => api.createTask(data),
    remove: (id)   => api.deleteTask(id),
  });

  const pendingNotes = usePendingMap<string>();
  const pendingDates = usePendingMap<string>();

  const [expandedId,           setExpandedId]           = useState<string | null>(null);
  const [collapsedCategories,  setCollapsedCategories]  = useState<Set<string>>(new Set());
  const [saving,               setSaving]               = useState<Record<string, boolean>>({});
  const [toggling,             setToggling]             = useState<Record<string, boolean>>({});
  const [showAddForm,          setShowAddForm]          = useState(false);
  const [newTitle,             setNewTitle]             = useState("");
  const [newCategory,          setNewCategory]          = useState("Organización");
  const [newStage,             setNewStage]             = useState("");
  const [addingTask,           setAddingTask]           = useState(false);

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
    const notes   = pendingNotes.get(task.id, task.notes);
    const dueDate = pendingDates.get(task.id, task.dueDate);
    setSaving((p) => ({ ...p, [task.id]: true }));
    try {
      const updated = await api.updateTask(task.id, { notes: notes || undefined, dueDate: dueDate || undefined });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      pendingNotes.remove(task.id);
      pendingDates.remove(task.id);
      setExpandedId(null);
    } finally {
      setSaving((p) => ({ ...p, [task.id]: false }));
    }
  }

  async function handleDelete(id: string) {
    await removeTask(id);
    if (expandedId === id) setExpandedId(null);
  }

  async function handleAddTask() {
    if (!newTitle.trim()) return;
    setAddingTask(true);
    try {
      await createTask({ title: newTitle.trim(), category: newCategory, stage: newStage || undefined });
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
    if (expandedId === id) {
      pendingNotes.remove(id);
      pendingDates.remove(id);
      setExpandedId(null);
    } else { setExpandedId(id); }
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
  const done  = tasks.filter((t) => t.status === "done").length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    tasks, loading, expandedId, collapsedCategories,
    pendingNotes: pendingNotes.map, pendingDates: pendingDates.map,
    saving, toggling,
    showAddForm, newTitle, newCategory, newStage, addingTask,
    grouped, total, done, pct,
    setShowAddForm, setNewTitle, setNewCategory, setNewStage,
    setPendingNotes: pendingNotes.setMap, setPendingDates: pendingDates.setMap,
    handleToggle, handleSaveDetails, handleDelete, handleAddTask,
    toggleCategory, toggleExpand,
  };
}
