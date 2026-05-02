"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { TableSeat, Guest } from "@/types";
import { SeatPill, TopoSvg, PANEL_W, type ColorMode } from "./table-preview-content";

interface Props {
  table: TableSeat | null;
  guests: Guest[];
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  /** When provided, renders an X close button (panel is "pinned" via click). */
  onClose?: () => void;
}

const outerStyle: React.CSSProperties = {
  position: "absolute", top: 8, right: 8, width: PANEL_W,
  background: "rgba(255,252,249,0.97)", backdropFilter: "blur(10px)",
  borderRadius: 14, border: "1px solid var(--color-border)",
  boxShadow: "0 6px 32px rgba(74,60,50,0.12), 0 1px 4px rgba(74,60,50,0.06)",
  zIndex: 10, overflow: "hidden",
  pointerEvents: "auto",
};

const tabBase: React.CSSProperties = {
  flex: 1, padding: "4px 0", fontSize: 10, fontWeight: 600,
  border: "none", cursor: "pointer", borderRadius: 6, transition: "all 0.15s",
};

export function TablePreviewPanel({ table, guests, allergyColors, mealColors, onClose }: Props) {
  const [colorMode, setColorMode] = useState<ColorMode>("alergia");

  if (!table) {
    return (
      <div style={outerStyle} onMouseDown={(e) => e.stopPropagation()}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border)", background: "rgba(140,111,95,0.04)", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text)", opacity: 0.4, flex: 1 }}>Vista de inspección</span>
          {onClose && (
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--color-text)", opacity: 0.35, lineHeight: 1 }}>
              <X size={13} />
            </button>
          )}
        </div>
        <div style={{ padding: "20px 14px", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--color-text)", opacity: 0.25, lineHeight: 1.7, margin: 0 }}>
            Pasa el cursor sobre una mesa<br />para ver sus detalles
          </p>
        </div>
      </div>
    );
  }

  const assigned = table.assignments.filter((a) => a.guestId).length;
  const free     = table.capacity - assigned;

  return (
    <div style={outerStyle} onMouseDown={(e) => e.stopPropagation()}>
      <div style={{ padding: "10px 14px 9px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 8, background: "rgba(140,111,95,0.05)" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text)" }}>{table.name}</span>
        <span style={{ fontSize: 11, color: "var(--color-text)", opacity: 0.38 }}>{assigned}/{table.capacity} asientos</span>
        {free > 0
          ? <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "var(--color-cta)" }}>{free} libre{free !== 1 ? "s" : ""}</span>
          : <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "var(--color-success)" }}>Completa</span>
        }
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--color-text)", opacity: 0.35, lineHeight: 1, marginLeft: 4 }}>
            <X size={13} />
          </button>
        )}
      </div>

      <div style={{ padding: "7px 14px", borderBottom: "1px solid var(--color-border)", display: "flex", gap: 4, background: "rgba(140,111,95,0.02)" }}>
        {(["alergia", "menu"] as const).map((m) => (
          <button key={m} onClick={() => setColorMode(m)} style={{
            ...tabBase,
            background: colorMode === m ? "var(--color-accent)" : "transparent",
            color: colorMode === m ? "white" : "var(--color-text)",
            opacity: colorMode === m ? 1 : 0.45,
          }}>
            {m === "alergia" ? "Alergia" : "Menú"}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 14px 10px", display: "flex", justifyContent: "center", borderBottom: "1px solid var(--color-border)" }}>
        <TopoSvg table={table} guests={guests} allergyColors={allergyColors} mealColors={mealColors} colorMode={colorMode} />
      </div>

      <div style={{ padding: "10px 12px 12px", display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 260, overflowY: "auto" }}>
        {table.assignments.map((a, i) => {
          const guest = a.guestId ? guests.find((g) => g.id === a.guestId) ?? null : null;
          return <SeatPill key={i} index={i} guest={guest} allergyColors={allergyColors} mealColors={mealColors} colorMode={colorMode} />;
        })}
      </div>
    </div>
  );
}
