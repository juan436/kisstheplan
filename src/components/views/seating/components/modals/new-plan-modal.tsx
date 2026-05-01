"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface NewPlanModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewPlanModal({ onClose, onCreate }: NewPlanModalProps) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[var(--color-bg)] rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        style={{ boxShadow: "0 16px 48px rgba(74,60,50,0.15)" }}
      >
        <h3 className="font-playfair text-xl text-[var(--color-text)] mb-4">Nuevo plano de mesas</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { onCreate(name.trim()); onClose(); } }}
          placeholder="Ej: Cena, Aperitivo..."
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)]/70 text-sm font-medium hover:bg-[var(--color-bg-2)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose(); } }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-colors"
            style={{ backgroundColor: "#866857" }}
          >
            Crear plano
          </button>
        </div>
      </motion.div>
    </div>
  );
}
