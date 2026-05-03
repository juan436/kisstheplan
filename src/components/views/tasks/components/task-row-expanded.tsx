/**
 * TaskRowExpanded
 *
 * Qué hace: panel expandible de una tarea con campos de fecha, asignado y notas editables.
 * Recibe:   ExpandedPanelProps (task, handlers de guardar fecha/nota/asignado, saving flag).
 * Provee:   export { TaskRowExpanded } — usado por TaskRow al expandirse.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, MessageSquare, Check, Loader2 } from "lucide-react";

export interface ExpandedPanelProps {
  dateVal: string;
  assignedVal: string;
  noteVal: string;
  saving: boolean;
  hasPending: boolean;
  assigneeOptions: string[];
  onDateChange: (v: string) => void;
  onAssignedChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ExpandedPanel({
  dateVal, assignedVal, noteVal, saving, hasPending,
  assigneeOptions, onDateChange, onAssignedChange, onNoteChange, onSave, onCancel,
}: ExpandedPanelProps) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pt-2 space-y-3 border-t" style={{ borderColor: "rgba(125,184,125,0.25)" }}>
          <div>
            <label className="flex items-center gap-1.5 text-xs text-text/45 mb-1.5">
              <Calendar size={11} />Fecha específica
            </label>
            <input type="date" value={dateVal} onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-green-400/60 transition-colors cursor-pointer"
              style={{ borderColor: "var(--color-border)" }} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs text-text/45 mb-1.5">
              <User size={11} />Asignar a
            </label>
            <select value={assignedVal} onChange={(e) => onAssignedChange(e.target.value)}
              className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-green-400/60 transition-colors"
              style={{ borderColor: "var(--color-border)" }}>
              <option value="">Sin asignar</option>
              {assigneeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs text-text/45 mb-1.5">
              <MessageSquare size={11} />Añadir comentario
            </label>
            <textarea value={noteVal} onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Notas internas..." rows={2}
              className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-green-400/60 transition-colors resize-none placeholder:text-text/25"
              style={{ borderColor: "var(--color-border)" }} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel}
              className="px-3 py-1.5 rounded-lg text-xs text-text/50 hover:text-text/70 transition-colors">
              Cancelar
            </button>
            <button onClick={onSave} disabled={saving || !hasPending}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs text-white font-medium disabled:opacity-35 transition-opacity hover:opacity-90"
              style={{ background: "#7db87d" }}>
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
              Guardar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
