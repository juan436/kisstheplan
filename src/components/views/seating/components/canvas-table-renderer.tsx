"use client";

import { Image as ImageIcon, X } from "lucide-react";
import type { SeatingPlan, TableSeat, Guest } from "@/types";
import { tableSize, getGuestName } from "../helpers/seating.helpers";

interface CanvasTableRendererProps {
  plan: SeatingPlan;
  guests: Guest[];
  mode: "layout" | "seating";
  seatingTable: string | null;
  setSeatingTable: (id: string | null) => void;
  bgImage: string | null;
  onMouseDown: (e: React.MouseEvent, table: TableSeat) => void;
  onDeleteTable: (tableId: string) => void;
}

export function CanvasTableRenderer({ plan, guests, mode, seatingTable, setSeatingTable, bgImage, onMouseDown, onDeleteTable }: CanvasTableRendererProps) {
  return (
    <>
      {!bgImage && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #C4B7A6", borderRadius: 12, pointerEvents: "none", color: "#8c6f5f" }}>
          <ImageIcon size={32} style={{ opacity: 0.35, marginBottom: 10 }} />
          <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.6 }}>Sin plano de fondo</span>
          <span style={{ fontSize: 12, opacity: 0.45, marginTop: 4 }}>
            Sube una imagen del espacio · Dimensiones recomendadas: 1200 × 800 px (ratio 3:2)
          </span>
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(196,180,160,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(196,180,160,0.25) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {plan.tables.map((table) => {
        const size = tableSize(table.capacity);
        const isRound = table.shape === "round";
        const assignedCount = table.assignments.filter((a) => a.guestId).length;
        return (
          <div
            key={table.id}
            id={`table-${table.id}`}
            onMouseDown={(e) => onMouseDown(e, table)}
            onClick={() => { if (mode === "seating") setSeatingTable(table.id === seatingTable ? null : table.id); }}
            style={{
              position: "absolute", left: table.posX, top: table.posY,
              width: size, height: isRound ? size : size * 0.6,
              borderRadius: isRound ? "50%" : 12,
              cursor: mode === "layout" ? "grab" : "pointer", userSelect: "none",
              border: `2px solid ${seatingTable === table.id ? "var(--color-accent)" : "var(--color-border)"}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.15s, box-shadow 0.15s",
              boxShadow: seatingTable === table.id ? "0 4px 20px rgba(140,111,95,0.25)" : "none",
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center rounded-inherit" style={{ background: seatingTable === table.id ? "rgba(140, 111, 95, 0.12)" : "rgba(230, 216, 200, 0.6)", borderRadius: "inherit" }}>
              <span className="font-quicksand font-semibold text-[var(--color-text)] text-sm leading-tight px-2 text-center truncate w-full" style={{ maxWidth: size - 16 }}>
                {table.name}
              </span>
              <span className="text-xs text-[var(--color-text)]/50 mt-0.5">{assignedCount}/{table.capacity}</span>
            </div>
            {mode === "layout" && (
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onDeleteTable(table.id); }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity shadow"
                style={{ fontSize: 10 }}
              >
                <X size={10} />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
