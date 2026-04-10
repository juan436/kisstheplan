/**
 * Constantes y utilidades compartidas para el módulo de tareas.
 * Usadas tanto en `src/app/app/tasks/` como en `src/components/views/tasks/`.
 * No duplicar estas constantes en ningún otro archivo — importar desde aquí.
 */
import type { Task } from "@/types";

export const CATEGORY_ORDER = [
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

export const STAGE_ORDER = [
  "+12 meses",
  "9-12 meses",
  "6-8 meses",
  "3-5 meses",
  "1-2 meses",
  "Última semana",
];

export const ALL_CATEGORIES = [...CATEGORY_ORDER, "Otros"];

export function stageBadgeStyle(stage?: string): string {
  if (!stage) return "bg-fill text-text/40";
  if (stage.includes("+12")) return "bg-fill-2/70 text-text/50";
  if (stage.includes("9-12")) return "bg-fill-2/70 text-text/50";
  if (stage.includes("6-8")) return "bg-brand/20 text-text/50";
  if (stage.includes("3-5")) return "bg-cta/15 text-cta";
  if (stage.includes("1-2")) return "bg-cta/25 text-cta";
  if (stage.toLowerCase().includes("semana")) return "bg-danger/15 text-danger";
  return "bg-fill text-text/40";
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "done") return false;
  return new Date(task.dueDate) < new Date();
}

export function formatTaskDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

/** Alias for formatTaskDate — use this name in view components */
export const formatDate = formatTaskDate;
