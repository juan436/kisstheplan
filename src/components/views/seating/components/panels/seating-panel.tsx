"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { TableSeat, Guest } from "@/types";
import { getGuestName } from "../../helpers/seating.helpers";

interface SeatingPanelProps {
  table: TableSeat;
  guests: Guest[];
  onClose: () => void;
  onUnassign: (seatNumber: number) => void;
}

export function SeatingPanel({ table, guests, onClose, onUnassign }: SeatingPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="absolute top-3 right-3 bg-white rounded-xl border border-[var(--color-border)] z-10 overflow-hidden"
      style={{ width: 240, maxHeight: 380, boxShadow: "0 12px 40px rgba(74,60,50,0.14)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-2)]">
        <span className="font-quicksand font-semibold text-sm text-[var(--color-text)]">{table.name}</span>
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)]">
          <X size={14} />
        </button>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
        {table.assignments.map((seat) => (
          <div key={seat.seatNumber}
            className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--color-bg-2)] border-b border-[var(--color-border)]/50 last:border-0">
            <span className="text-xs text-[var(--color-text)]/40 w-5 text-right flex-shrink-0">
              {seat.seatNumber}.
            </span>
            {seat.guestId ? (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-sm text-[var(--color-text)] truncate flex-1">
                  {getGuestName(guests, seat.guestId)}
                </span>
                <button onClick={() => onUnassign(seat.seatNumber)}
                  className="text-[var(--color-danger)]/60 hover:text-[var(--color-danger)] flex-shrink-0">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <span className="text-sm text-[var(--color-text)]/30 italic flex-1">Libre</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
