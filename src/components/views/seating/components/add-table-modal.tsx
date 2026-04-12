"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Circle, Square } from "lucide-react";
import { IconSerpentineTable } from "./library-icons";

type TableShape = "round" | "rectangular" | "serpentine";

interface AddTableModalProps {
  onClose: () => void;
  onAdd: (data: { name: string; shape: TableShape; capacity: number }) => void;
  defaultShape?: TableShape;
}

export function AddTableModal({ onClose, onAdd, defaultShape = "round" }: AddTableModalProps) {
  const [name, setName] = useState("");
  const [shape, setShape] = useState<TableShape>(defaultShape);
  const [capacity, setCapacity] = useState(8);

  const maxCapacity = shape === "rectangular" ? 8 : 20;

  const switchShape = (s: TableShape) => {
    setShape(s);
    if (s === "rectangular") setCapacity((c) => Math.min(c, 8));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-[var(--color-bg)] rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        style={{ boxShadow: "0 16px 48px rgba(74,60,50,0.15)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-xl text-[var(--color-text)]">Añadir mesa</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Nombre de la mesa</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mesa 1, Mesa de honor..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Forma</label>
            <div className="flex gap-2">
              {(["round", "rectangular", "serpentine"] as TableShape[]).map((s) => (
                <button key={s} onClick={() => switchShape(s)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    shape === s
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                  }`}>
                  {s === "round" && <Circle size={18} />}
                  {s === "rectangular" && <Square size={18} />}
                  {s === "serpentine" && <IconSerpentineTable size={18} />}
                  {s === "round" ? "Redonda" : s === "rectangular" ? "Rectangular" : "Serpentina"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">
              Capacidad: <span className="text-[var(--color-accent)] font-semibold">{capacity} personas</span>
              {shape === "rectangular" && (
                <span className="ml-2 text-[11px] text-[var(--color-text)]/40">(máx. 8 — 4 por lado)</span>
              )}
              {shape === "serpentine" && (
                <span className="ml-2 text-[11px] text-[var(--color-text)]/40">(arco exterior + borde plano)</span>
              )}
            </label>
            <input
              type="range" min={1} max={maxCapacity} value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-text)]/40 mt-1">
              <span>1</span><span>{maxCapacity}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)]/70 text-sm font-medium hover:bg-[var(--color-bg-2)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { if (!name.trim()) return; onAdd({ name: name.trim(), shape, capacity }); onClose(); }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: "#866857" }}
          >
            Añadir mesa
          </button>
        </div>
      </motion.div>
    </div>
  );
}
