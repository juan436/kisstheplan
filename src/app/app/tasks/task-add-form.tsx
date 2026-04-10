import { motion } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { ALL_CATEGORIES } from "@/constants/task-constants";

interface AddFormProps {
  newTitle: string;
  newCategory: string;
  newStage: string;
  addingTask: boolean;
  setNewTitle: (v: string) => void;
  setNewCategory: (v: string) => void;
  setNewStage: (v: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

export function TaskAddForm({
  newTitle, newCategory, newStage, addingTask,
  setNewTitle, setNewCategory, setNewStage, onAdd, onClose,
}: AddFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="mb-6 rounded-xl border p-4"
      style={{ background: "var(--color-bg-2)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text" style={{ fontFamily: "Playfair Display, serif" }}>Nueva Tarea</h3>
        <button onClick={onClose} className="text-text/40 hover:text-text/70 transition-colors"><X size={16} /></button>
      </div>
      <div className="space-y-3">
        <input
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onAdd(); if (e.key === "Escape") onClose(); }}
          placeholder="Descripción de la tarea..."
          className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors placeholder:text-text/30"
          style={{ borderColor: "var(--color-border)" }}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-text/50 mb-1">Categoría</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors" style={{ borderColor: "var(--color-border)" }}>
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-text/50 mb-1">Etapa (opcional)</label>
            <select value={newStage} onChange={(e) => setNewStage(e.target.value)} className="w-full bg-white/60 border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-cta/60 transition-colors" style={{ borderColor: "var(--color-border)" }}>
              <option value="">Sin etapa</option>
              <option value="+12 meses">+12 meses</option>
              <option value="9-12 meses">9-12 meses</option>
              <option value="6-8 meses">6-8 meses</option>
              <option value="3-5 meses">3-5 meses</option>
              <option value="1-2 meses">1-2 meses</option>
              <option value="Última semana">Última semana</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-text/60 hover:text-text/80 transition-colors">Cancelar</button>
          <button onClick={onAdd} disabled={!newTitle.trim() || addingTask} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-40 transition-opacity hover:opacity-90" style={{ background: "var(--color-accent)" }}>
            {addingTask ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Añadir
          </button>
        </div>
      </div>
    </motion.div>
  );
}
