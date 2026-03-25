"use client";

import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import type { TableSeat, Guest } from "@/types";
import { getGuestName } from "./seating-helpers";

interface TableCardProps {
  table: TableSeat;
  guests: Guest[];
  isEditing: boolean;
  editName: string;
  onStartEdit: () => void;
  onEditNameChange: (v: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onDrop: (seatNumber: number) => void;
  onUnassign: (seatNumber: number) => void;
}

export function TableCard({ table, guests, isEditing, editName, onStartEdit, onEditNameChange, onSaveEdit, onCancelEdit, onDelete, onDrop, onUnassign }: TableCardProps) {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(74,60,50,0.06)" }}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg-2)]">
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text" value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSaveEdit(); if (e.key === "Escape") onCancelEdit(); }}
              className="flex-1 text-sm font-semibold bg-transparent border-b border-[var(--color-accent)] outline-none text-[var(--color-text)] min-w-0"
              autoFocus
            />
            <button onClick={onSaveEdit} className="text-[var(--color-success)]"><Check size={14} /></button>
            <button onClick={onCancelEdit} className="text-[var(--color-text)]/40"><X size={14} /></button>
          </div>
        ) : (
          <button onClick={onStartEdit} className="font-quicksand font-semibold text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors text-left flex-1 truncate">
            {table.name}
          </button>
        )}
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <span className="text-xs text-[var(--color-text)]/40">{table.assignments.filter((a) => a.guestId).length}/{table.capacity}</span>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="text-[var(--color-text)]/30 hover:text-[var(--color-danger)] transition-colors ml-1">
              <Trash2 size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-1 ml-1">
              <button onClick={onDelete} className="text-[var(--color-danger)] text-xs font-medium">Sí</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[var(--color-text)]/50 text-xs">No</button>
            </div>
          )}
        </div>
      </div>

      <div className="p-2">
        {table.assignments.map((seat) => {
          const guestName = getGuestName(guests, seat.guestId);
          const isOccupied = !!seat.guestId;
          return (
            <div
              key={seat.seatNumber}
              onDragOver={(e) => { if (!isOccupied) { e.preventDefault(); setHoveredSeat(seat.seatNumber); } }}
              onDragLeave={() => setHoveredSeat(null)}
              onDrop={(e) => { e.preventDefault(); setHoveredSeat(null); onDrop(seat.seatNumber); }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 last:mb-0 transition-colors ${
                hoveredSeat === seat.seatNumber && !isOccupied
                  ? "bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30"
                  : isOccupied ? "bg-[var(--color-bg-2)]" : "hover:bg-[var(--color-bg-2)]"
              }`}
            >
              <span className="text-xs text-[var(--color-text)]/40 w-4 text-right flex-shrink-0">{seat.seatNumber}.</span>
              {isOccupied ? (
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <span className="text-sm text-[var(--color-text)] truncate flex-1">{guestName}</span>
                  <button onClick={() => onUnassign(seat.seatNumber)} className="text-[var(--color-text)]/25 hover:text-[var(--color-danger)] transition-colors flex-shrink-0">
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-[var(--color-text)]/25 italic flex-1">
                  {hoveredSeat === seat.seatNumber ? "Soltar aquí" : "Libre"}
                </span>
              )}
            </div>
          );
        })}
        {table.assignments.length === 0 && (
          <div className="text-center py-3 text-xs text-[var(--color-text)]/30 italic">Sin asientos configurados</div>
        )}
      </div>
    </div>
  );
}
