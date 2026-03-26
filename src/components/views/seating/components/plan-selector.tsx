"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import type { SeatingPlan } from "@/types";

interface PlanSelectorProps {
  plans: SeatingPlan[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function PlanSelector({ plans, selectedId, onSelect, onNew }: PlanSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedPlan = plans.find((p) => p.id === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm font-medium hover:border-[var(--color-accent)]/50 transition-colors"
        style={{ minWidth: 160 }}
      >
        <span className="flex-1 text-left">{selectedPlan?.name ?? "Seleccionar plano"}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[var(--color-border)] shadow-lg z-20 overflow-hidden"
            style={{ minWidth: 180, boxShadow: "0 12px 40px rgba(74,60,50,0.12)" }}
          >
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-bg-2)] transition-colors ${
                  p.id === selectedId ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-text)]"
                }`}
              >
                {p.name}
              </button>
            ))}
            <div className="border-t border-[var(--color-border)]">
              <button
                onClick={() => { onNew(); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-accent)] hover:bg-[var(--color-bg-2)] transition-colors flex items-center gap-2"
              >
                <Plus size={14} />
                Nuevo plano
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
