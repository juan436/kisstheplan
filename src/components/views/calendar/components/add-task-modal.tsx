"use client";

import { useState } from "react";
import { api } from "@/services";
import { Button } from "@/components/ui/button";
import type { CreateTaskData } from "@/services/api";

export function AddTaskModal({ initialDate, onClose, onCreated }: {
  initialDate: string; onClose: () => void; onCreated: () => void;
}) {
  const [title,    setTitle]    = useState("");
  const [dueDate,  setDueDate]  = useState(initialDate);
  const [category, setCategory] = useState("");
  const [saving,   setSaving]   = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const data: CreateTaskData = {
      title: title.trim(),
      dueDate: dueDate || undefined,
      category: category.trim() || undefined,
    };
    await api.createTask(data);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(74,60,50,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-[20px] italic text-text mb-5">Nueva tarea</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Tarea</label>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="¿Qué hay que hacer?"
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Fecha</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Categoría (opcional)</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Catering, Flores..."
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button variant="cta" onClick={handleSave} disabled={saving || !title.trim()} className="flex-1">
            {saving ? "Guardando..." : "Añadir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
