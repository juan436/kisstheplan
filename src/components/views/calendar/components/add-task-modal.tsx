"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "@/services";
import { Button } from "@/components/ui/button";
import type { CreateTaskData } from "@/services/api";

export function AddTaskModal({ initialDate, onClose, onCreated }: {
  initialDate: string; onClose: () => void; onCreated: () => void;
}) {
  const [title,      setTitle]      = useState("");
  const [dueDate,    setDueDate]    = useState(initialDate);
  const [category,   setCategory]   = useState("");
  const [saving,     setSaving]     = useState(false);
  const [categories,    setCategories]    = useState<string[]>([]);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getTaskCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

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
          <div ref={dropdownRef} className="relative">
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Categoría (opcional)</label>
            <button type="button" onClick={() => setDropdownOpen(v => !v)}
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors flex items-center justify-between cursor-pointer">
              <span className={category ? "text-text" : "text-brand/60"}>{category || "— Sin categoría —"}</span>
              <ChevronDown size={14} className={`text-brand transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-dropdown z-10 max-h-48 overflow-y-auto">
                <button type="button" onClick={() => { setCategory(""); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[13px] text-brand/60 hover:bg-bg2 transition-colors">
                  — Sin categoría —
                </button>
                {categories.map((c) => (
                  <button key={c} type="button" onClick={() => { setCategory(c); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-bg2 ${category === c ? "text-cta font-medium" : "text-text"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-1">Fecha</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
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
