"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Circle, Square } from "lucide-react";

interface AddTableModalProps {
  onClose: () => void;
  onAdd: (data: { name: string; shape: "round" | "rectangular"; capacity: number }) => void;
  defaultShape?: "round" | "rectangular";
}

export function AddTableModal({ onClose, onAdd, defaultShape = "round" }: AddTableModalProps) {
  const [name, setName] = useState("");
  const [shape, setShape] = useState<"round" | "rectangular">(defaultShape);
  const [capacity, setCapacity] = useState(8);

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
            <div className="flex gap-3">
              <button
                onClick={() => setShape("round")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  shape === "round"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <Circle size={16} />
                Redonda
              </button>
              <button
                onClick={() => setShape("rectangular")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  shape === "rectangular"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <Square size={16} />
                Rectangular
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">
              Capacidad: <span className="text-[var(--color-accent)] font-semibold">{capacity} personas</span>
            </label>
            <input
              type="range" min={1} max={20} value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-text)]/40 mt-1">
              <span>1</span><span>20</span>
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
