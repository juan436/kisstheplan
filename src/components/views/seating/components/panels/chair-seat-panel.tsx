"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Search, UserCheck } from "lucide-react";
import type { DecorationObject, Guest } from "@/types";

interface Props {
  deco: DecorationObject;
  guests: Guest[];
  onAssign: (guestId?: string) => void;
  onClose: () => void;
}

export function ChairSeatPanel({ deco, guests, onAssign, onClose }: Props) {
  const [search, setSearch] = useState("");

  const assignedGuest = deco.guestId ? guests.find((g) => g.id === deco.guestId) : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => !q || g.name.toLowerCase().includes(q));
  }, [guests, search]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="absolute top-3 right-3 bg-white rounded-xl border border-[var(--color-border)] z-10 overflow-hidden"
      style={{ width: 230, boxShadow: "0 12px 40px rgba(74,60,50,0.14)" }}>

      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg-2)]">
        <div className="flex items-center gap-2">
          <UserCheck size={13} className="text-[var(--color-accent)]" />
          <span className="font-quicksand font-semibold text-sm text-[var(--color-text)]">
            {deco.label ?? "Silla"}
          </span>
        </div>
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)]">
          <X size={14} />
        </button>
      </div>

      {assignedGuest ? (
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {assignedGuest.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-[var(--color-text)] flex-1 truncate">{assignedGuest.name}</span>
          <button onClick={() => onAssign(undefined)}
            className="text-[var(--color-danger)]/60 hover:text-[var(--color-danger)] flex-shrink-0">
            <X size={12} />
          </button>
        </div>
      ) : (
        <>
          <div className="px-3 py-2 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--color-bg-2)] border border-[var(--color-border)]">
              <Search size={11} className="text-[var(--color-text)]/35 flex-shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar invitado..."
                className="flex-1 bg-transparent text-xs text-[var(--color-text)] placeholder:text-[var(--color-text)]/30 outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
            {filtered.length === 0 && (
              <p className="text-xs text-[var(--color-text)]/35 text-center py-4">Sin resultados</p>
            )}
            {filtered.map((g) => (
              <button key={g.id} onClick={() => onAssign(g.id)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-2)] border-b border-[var(--color-border)]/40 last:border-0 transition-colors">
                <span className="truncate">{g.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
