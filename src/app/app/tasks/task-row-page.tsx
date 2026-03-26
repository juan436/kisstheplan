import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Calendar, Trash2, Loader2 } from "lucide-react";
import type { Task } from "@/types";
import { isOverdue } from "@/constants/task-constants";

function stageColor(stage?: string) {
  if (!stage) return "bg-fill text-text/50";
  if (stage.includes("12")) return "bg-fill-2/60 text-text/60";
  if (stage.includes("9-12")) return "bg-fill-2/60 text-text/60";
  if (stage.includes("6-8")) return "bg-brand/20 text-text/60";
  if (stage.includes("3-5")) return "bg-cta/15 text-cta";
  if (stage.includes("1-2")) return "bg-cta/25 text-cta";
  if (stage.includes("semana") || stage.includes("Semana")) return "bg-danger/15 text-danger";
  return "bg-fill text-text/50";
}

export interface TaskRowProps {
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

export function TaskRow({
  task, expanded, toggling, saving, pendingNote, pendingDate,
  onToggle, onExpand, onNoteChange, onDateChange, onSave, onDelete,
}: TaskRowProps) {
  const done = task.status === "done";
  const overdue = isOverdue(task);
  const hasPendingChanges = pendingNote !== undefined || pendingDate !== undefined;
  const noteVal = pendingNote !== undefined ? pendingNote : task.notes ?? "";
  const dateVal = pendingDate !== undefined ? pendingDate : task.dueDate ?? "";

  return (
    <div className="rounded-xl overflow-hidden transition-shadow" style={{ background: done ? "transparent" : "var(--color-bg-2)", border: `1px solid ${done ? "transparent" : "var(--color-border)"}` }}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer group" onClick={onExpand}>
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} disabled={toggling} className="shrink-0 transition-all">
          {toggling ? (
            <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center" style={{ borderColor: "var(--color-brand)" }}>
              <Loader2 size={10} className="animate-spin" style={{ color: "var(--color-brand)" }} />
            </div>
          ) : done ? (
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
              <Check size={12} className="text-white" strokeWidth={2.5} />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-md border-2 hover:border-accent transition-colors" style={{ borderColor: "var(--color-border)" }} />
          )}
        </button>
        <span className="flex-1 text-sm transition-all" style={{ color: done ? "var(--color-text)" : overdue ? "#866857" : "var(--color-text)", opacity: done ? 0.4 : 1, textDecoration: done ? "line-through" : "none" }}>
          {task.title}
        </span>
        {task.stage && !done && <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium ${stageColor(task.stage)}`}>{task.stage}</span>}
        {overdue && !done && <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium bg-danger/10 text-danger">Vencida</span>}
        <ChevronDown size={14} className="shrink-0 text-text/20 transition-transform duration-200 group-hover:text-text/40" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 space-y-3 border-t" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <label className="flex items-center gap-1.5 text-xs text-text/50 mb-1.5"><Calendar size={12} />Fecha específica</label>
                <input type="date" value={dateVal} onChange={(e) => onDateChange(e.target.value)} className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors cursor-pointer" style={{ borderColor: "var(--color-border)" }} />
              </div>
              <div>
                <label className="block text-xs text-text/50 mb-1.5">Notas</label>
                <textarea value={noteVal} onChange={(e) => onNoteChange(e.target.value)} placeholder="Añade un comentario o nota..." rows={2} className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors resize-none placeholder:text-text/25" style={{ borderColor: "var(--color-border)" }} />
              </div>
              <div className="flex items-center justify-between">
                <button onClick={onDelete} className="flex items-center gap-1 text-xs text-danger/60 hover:text-danger transition-colors">
                  <Trash2 size={12} />Eliminar tarea
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={onExpand} className="px-3 py-1.5 rounded-lg text-xs text-text/50 hover:text-text/70 transition-colors">Cancelar</button>
                  <button onClick={onSave} disabled={saving || !hasPendingChanges} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white font-medium disabled:opacity-40 transition-opacity hover:opacity-90" style={{ background: "var(--color-accent)" }}>
                    {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
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
