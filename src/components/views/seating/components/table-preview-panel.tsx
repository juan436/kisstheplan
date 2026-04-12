"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../constants/seating.constants";
import { tableRadius, rectDims, getTableDiameter, getRectTableDims } from "../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs, computeRoundChairRadius, computeRectChairRadius } from "../helpers/chair.helpers";
import { normalizeDish } from "@/lib/allergy-colors";

const PANEL_W    = 350;
const TOPO_SCALE = 42;   // px/m — compact topology, names live in the pill list

type ColorMode = "menu" | "alergia";

// ── Seat pill (HTML, crisp font rendering) ───────────────────────────────────
function SeatPill({ index, guest, allergyColors, mealColors, colorMode }: {
  index: number;
  guest: Guest | null;
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  colorMode: ColorMode;
}) {
  const dots: { key: string; color: string }[] = [];

  if (colorMode === "alergia" && guest?.allergies?.trim()) {
    guest.allergies.split(",").map((a) => a.trim()).filter(Boolean).forEach((a) => {
      dots.push({ key: a, color: allergyColors[a] ?? "#f59e0b" });
    });
  } else if (colorMode === "menu" && guest?.dish?.trim()) {
    const key = normalizeDish(guest.dish);
    dots.push({ key, color: mealColors[key] ?? "#a0a0a0" });
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 10px", borderRadius: 8, minWidth: 0,
      background: guest ? "#ffffff" : "#F5EFE9",
      border: `1px solid ${guest ? "#D4C9B8" : "#E5DDD0"}`,
      boxShadow: guest ? "0 1px 5px rgba(74,60,50,0.09)" : "none",
      flex: "1 1 140px",
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: "var(--color-text)", opacity: 0.28, minWidth: 14, textAlign: "right", flexShrink: 0 }}>
        {index + 1}
      </span>
      <span style={{
        fontSize: 12, fontWeight: guest ? 500 : 400,
        color: "var(--color-text)", opacity: guest ? 1 : 0.3,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {guest ? guest.name : "Libre"}
      </span>
      {dots.length > 0 && (
        <div style={{ display: "flex", gap: 2, marginLeft: "auto", flexShrink: 0 }}>
          {dots.map((d) => (
            <div key={d.key} title={d.key} style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Compact topology SVG ──────────────────────────────────────────────────────
function TopoSvg({ table, guests, allergyColors, mealColors, colorMode }: {
  table: TableSeat;
  guests: Guest[];
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  colorMode: ColorMode;
}) {
  const isRound = table.shape === "round";
  const s = TOPO_SCALE;
  const r  = tableRadius(table.physicalDiameter ?? getTableDiameter(table.capacity), s);
  const rw = table.physicalWidth  ?? getRectTableDims().width;
  const rh = table.physicalHeight ?? getRectTableDims().height;
  const { w, h } = rectDims(rw, rh, s);
  const rawR   = CHAIR_RADIUS_M * s;
  const chairR = isRound ? computeRoundChairRadius(table.capacity, r, rawR) : computeRectChairRadius(w, table.capacity, rawR);
  const chairs = isRound ? roundTableChairs(table.capacity, r, chairR) : rectTableChairs(w, h, table.capacity, chairR);
  const assigned = table.assignments.filter((a) => a.guestId).length;
  const hx = (isRound ? r : w / 2) + chairR + 4;
  const hy = (isRound ? r : h / 2) + chairR + 4;
  const svgW = Math.min(hx * 2, PANEL_W - 28);
  const svgH = hy * 2 * (svgW / (hx * 2));

  return (
    <svg width={svgW} height={svgH} viewBox={`${-hx} ${-hy} ${hx * 2} ${hy * 2}`} style={{ overflow: "visible" }}>
      {isRound
        ? <circle cx={0} cy={0} r={r} fill="#fff" stroke="#B4A494" strokeWidth={1.5} />
        : <rect x={-w/2} y={-h/2} width={w} height={h} rx={4} fill="#fff" stroke="#B4A494" strokeWidth={1.5} />
      }
      <text textAnchor="middle" dominantBaseline="middle" y={-6} fontSize={9} fontWeight={600}
        fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>{table.name}</text>
      <text textAnchor="middle" dominantBaseline="middle" y={5} fontSize={7.5} opacity={0.4}
        fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>{assigned}/{table.capacity}</text>
      {chairs.map((ch, i) => {
        const guest = table.assignments[i]?.guestId ? guests.find((g) => g.id === table.assignments[i].guestId) : null;
        let dotColor: string | null = null;
        if (colorMode === "alergia" && guest?.allergies?.trim()) {
          dotColor = allergyColors[guest.allergies.split(",")[0].trim()] ?? "#f59e0b";
        } else if (colorMode === "menu" && guest?.dish?.trim()) {
          dotColor = mealColors[normalizeDish(guest.dish)] ?? "#a0a0a0";
        }
        const dotR = Math.max(1.5, chairR * 0.32);
        return (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={chairR} fill={guest ? "#8c6f5f" : "#EDE4D9"} stroke={guest ? "#7a5f51" : "#C4B7A6"} strokeWidth={0.75} />
            <text x={ch.x} y={ch.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={Math.max(5, chairR * 0.65)} fill={guest ? "rgba(255,255,255,0.75)" : "rgba(74,60,50,0.3)"}
              style={{ pointerEvents: "none", userSelect: "none" }}>{i + 1}</text>
            {dotColor && (
              <circle cx={ch.x + chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR} fill={dotColor} stroke="white" strokeWidth={0.5} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
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
      {/* Header */}
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

      {/* Color mode toggle */}
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

      {/* Compact topology */}
      <div style={{ padding: "12px 14px 10px", display: "flex", justifyContent: "center", borderBottom: "1px solid var(--color-border)" }}>
        <TopoSvg table={table} guests={guests} allergyColors={allergyColors} mealColors={mealColors} colorMode={colorMode} />
      </div>

      {/* Seat pills */}
      <div style={{ padding: "10px 12px 12px", display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 260, overflowY: "auto" }}>
        {table.assignments.map((a, i) => {
          const guest = a.guestId ? guests.find((g) => g.id === a.guestId) ?? null : null;
          return <SeatPill key={i} index={i} guest={guest} allergyColors={allergyColors} mealColors={mealColors} colorMode={colorMode} />;
        })}
      </div>
    </div>
  );
}
