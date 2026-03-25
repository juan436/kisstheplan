import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { ALL_CATEGORIES, STAGE_ORDER } from "./tasks-constants";

interface AddTaskFormProps {
  show: boolean;
  newTitle: string;
  newCategory: string;
  newStage: string;
  addingTask: boolean;
  onTitleChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onStageChange: (v: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

export function AddTaskForm({
  show, newTitle, newCategory, newStage, addingTask,
  onTitleChange, onCategoryChange, onStageChange, onAdd, onClose,
}: AddTaskFormProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
          className="mb-5 rounded-xl border p-4"
          style={{ background: "var(--color-bg-2)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text" style={{ fontFamily: "Playfair Display, serif" }}>
              Nueva Tarea
            </h3>
            <button onClick={onClose} className="text-text/40 hover:text-text/70 transition-colors">
              <X size={15} />
            </button>
          </div>
          <div className="space-y-3">
            <input autoFocus value={newTitle} onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onAdd(); if (e.key === "Escape") onClose(); }}
              placeholder="Descripción de la tarea..."
              className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors placeholder:text-text/30"
              style={{ borderColor: "var(--color-border)" }} />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-text/50 mb-1">Categoría</label>
                <select value={newCategory} onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none"
                  style={{ borderColor: "var(--color-border)" }}>
                  {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-text/50 mb-1">Etapa</label>
                <select value={newStage} onChange={(e) => onStageChange(e.target.value)}
                  className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none"
                  style={{ borderColor: "var(--color-border)" }}>
                  <option value="">Sin etapa</option>
                  {STAGE_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-text/55 hover:text-text/75 transition-colors">
                Cancelar
              </button>
              <button onClick={onAdd} disabled={!newTitle.trim() || addingTask}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ background: "var(--color-accent)" }}>
                {addingTask ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Añadir
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
