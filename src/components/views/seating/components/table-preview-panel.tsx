"use client";

import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../constants/seating.constants";
import { tableRadius, rectDims, getTableDiameter, getRectTableDims } from "../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs, computeRoundChairRadius, computeRectChairRadius } from "../helpers/chair.helpers";

const PANEL_W    = 350;
const TOPO_SCALE = 42;   // px/m — compact topology, names live in the pill list

// ── Seat pill (HTML, crisp font rendering) ───────────────────────────────────
function SeatPill({ index, guest }: { index: number; guest: Guest | null }) {
  const hasAllergy = !!guest?.allergies?.trim();
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
      {hasAllergy && (
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", marginLeft: "auto", flexShrink: 0 }} />
      )}
    </div>
  );
}

// ── Compact topology SVG (chairs coloured, seat numbers inside, no name text) ─
function TopoSvg({ table, guests }: { table: TableSeat; guests: Guest[] }) {
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
        return (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={chairR} fill={guest ? "#8c6f5f" : "#EDE4D9"} stroke={guest ? "#7a5f51" : "#C4B7A6"} strokeWidth={0.75} />
            <text x={ch.x} y={ch.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={Math.max(5, chairR * 0.65)} fill={guest ? "rgba(255,255,255,0.75)" : "rgba(74,60,50,0.3)"}
              style={{ pointerEvents: "none", userSelect: "none" }}>{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
interface Props { table: TableSeat | null; guests: Guest[] }

const outerStyle: React.CSSProperties = {
  position: "absolute", top: 8, right: 8, width: PANEL_W,
  background: "rgba(255,252,249,0.97)", backdropFilter: "blur(10px)",
  borderRadius: 14, border: "1px solid var(--color-border)",
  boxShadow: "0 6px 32px rgba(74,60,50,0.12), 0 1px 4px rgba(74,60,50,0.06)",
  zIndex: 10, overflow: "hidden",
  pointerEvents: "auto",
};

export function TablePreviewPanel({ table, guests }: Props) {
  if (!table) {
    return (
      <div style={outerStyle} onMouseDown={(e) => e.stopPropagation()}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border)", background: "rgba(140,111,95,0.04)" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text)", opacity: 0.4 }}>Vista de inspección</span>
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
      <div style={{ padding: "10px 14px 9px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "baseline", gap: 8, background: "rgba(140,111,95,0.05)" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text)" }}>{table.name}</span>
        <span style={{ fontSize: 11, color: "var(--color-text)", opacity: 0.38 }}>{assigned}/{table.capacity} asientos</span>
        {free > 0
          ? <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "var(--color-cta)" }}>{free} libre{free !== 1 ? "s" : ""}</span>
          : <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "var(--color-success)" }}>Completa</span>
        }
      </div>

      {/* Compact topology */}
      <div style={{ padding: "12px 14px 10px", display: "flex", justifyContent: "center", borderBottom: "1px solid var(--color-border)" }}>
        <TopoSvg table={table} guests={guests} />
      </div>

      {/* Seat pills */}
      <div style={{ padding: "10px 12px 12px", display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 260, overflowY: "auto" }}>
        {table.assignments.map((a, i) => {
          const guest = a.guestId ? guests.find((g) => g.id === a.guestId) ?? null : null;
          return <SeatPill key={i} index={i} guest={guest} />;
        })}
      </div>
    </div>
  );
}
