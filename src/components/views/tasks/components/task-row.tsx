import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, Loader2 } from "lucide-react";
import type { Task } from "@/types";
import { isOverdue, stageBadgeStyle, formatDate } from "../constants/tasks.constants";
import { ExpandedPanel } from "./task-row-expanded";

export interface TaskRowProps {
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

export function TaskRow({
  task, expanded, toggling, saving, pendingNote, pendingDate, pendingAssigned,
  assigneeOptions, onToggle, onExpand, onDelete, onNoteChange, onDateChange, onAssignedChange, onSave,
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
    <div className="rounded-xl overflow-hidden transition-all"
      style={{
        background: done ? "transparent" : "var(--color-bg-2)",
        border: expanded ? "1.5px solid #7db87d" : done ? "1px solid transparent" : "1px solid var(--color-border)",
        boxShadow: expanded ? "0 0 0 3px rgba(125,184,125,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={onExpand}>
        <span className="flex-1 text-sm transition-all"
          style={{ color: overdue && !done ? "#866857" : "var(--color-text)", opacity: done ? 0.38 : 1, textDecoration: done ? "line-through" : "none" }}>
          {task.title}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {!done && (
            <div className="relative">
              <button onClick={handleStageBadgeClick}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${task.dueDate ? overdue ? "bg-danger/10 text-danger" : "bg-success/15 text-success" : stageBadgeStyle(task.stage)}`}
                title="Cambiar fecha">
                {task.dueDate ? (overdue ? `Vencida · ${formatDate(task.dueDate)}` : formatDate(task.dueDate)) : task.stage || "—"}
              </button>
              {showDatePicker && (
                <input ref={dateRef} type="date" value={dateVal}
                  onChange={(e) => { onDateChange(e.target.value); setShowDatePicker(false); }}
                  onBlur={() => setShowDatePicker(false)}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none" style={{ top: 0, left: 0 }} />
              )}
            </div>
          )}
          <AnimatePresence>
            {(hovered || expanded) && !done && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.12 }}
                onClick={onDelete} className="p-1 rounded-md text-text/25 hover:text-danger/70 transition-colors">
                <Trash2 size={13} />
              </motion.button>
            )}
          </AnimatePresence>
          <button onClick={onToggle} disabled={toggling} className="shrink-0 transition-all"
            title={done ? "Marcar como pendiente" : "Marcar como completada"}>
            {toggling ? (
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "var(--color-brand)" }}>
                <Loader2 size={10} className="animate-spin" style={{ color: "var(--color-brand)" }} />
              </div>
            ) : done ? (
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                <Check size={11} className="text-white" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 transition-colors"
                style={{ borderColor: hovered || expanded ? "var(--color-accent)" : "var(--color-border)", background: "transparent" }} />
            )}
          </button>
        </div>
      </div>
      {expanded && (
        <ExpandedPanel dateVal={dateVal} assignedVal={assignedVal} noteVal={noteVal}
          saving={saving} hasPending={hasPending} assigneeOptions={assigneeOptions}
          onDateChange={onDateChange} onAssignedChange={onAssignedChange} onNoteChange={onNoteChange}
          onSave={onSave} onCancel={onExpand} />
      )}
    </div>
  );
}
