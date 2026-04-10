"use client";

import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../constants/seating.constants";
import { tableRadius, rectDims, getGuestName, getTableDiameter, getRectTableDims } from "../helpers/seating.helpers";
import {
  roundTableChairs, rectTableChairs,
  computeRoundChairRadius, computeRectChairRadius,
} from "../helpers/chair.helpers";

/** Fixed px/m used for the popover — always comfortable to read regardless of canvas zoom */
const PREVIEW_SCALE = 52;

function shortName(full: string): string {
  const p = full.trim().split(" ");
  return p.length === 1 ? p[0].slice(0, 10) : `${p[0]} ${p[1][0]}.`;
}

interface Props {
  table: TableSeat;
  guests: Guest[];
  /** Coords already relative to the canvas container div */
  x: number;
  y: number;
  containerW: number;
  containerH: number;
}

export function TablePreviewPopover({ table, guests, x, y, containerW, containerH }: Props) {
  const isRound = table.shape === "round";
  const s = PREVIEW_SCALE;

  const r  = tableRadius(table.physicalDiameter ?? getTableDiameter(table.capacity), s);
  const rw = table.physicalWidth  ?? getRectTableDims().width;
  const rh = table.physicalHeight ?? getRectTableDims().height;
  const { w, h } = rectDims(rw, rh, s);

  const rawR  = CHAIR_RADIUS_M * s;
  const chairR = isRound
    ? computeRoundChairRadius(table.capacity, r, rawR)
    : computeRectChairRadius(w, table.capacity, rawR);

  const chairs = isRound
    ? roundTableChairs(table.capacity, r, chairR)
    : rectTableChairs(w, h, table.capacity, chairR);

  const assigned = table.assignments.filter((a) => a.guestId).length;

  // SVG viewBox: encompass table + chairs + name labels
  const nameDist = chairR + 4;
  const textH    = 10;
  const hx = (isRound ? r : w / 2) + chairR + nameDist + textH;
  const hy = (isRound ? r : h / 2) + chairR + nameDist + textH;

  // Cap popover width at 300px; scale SVG display to fit
  const PADDING  = 14;
  const HEADER_H = 38;
  const svgW = Math.min(hx * 2, 300 - PADDING * 2);
  const svgH = (hy * 2) * (svgW / (hx * 2));
  const popW = svgW + PADDING * 2;
  const popH = HEADER_H + svgH + PADDING;

  // Smart positioning: right of cursor, flip if near edges
  let left = x + 22;
  let top  = y - popH / 2;
  if (left + popW > containerW - 8) left = x - popW - 22;
  if (top < 8)                       top  = 8;
  if (top + popH > containerH - 8)   top  = containerH - popH - 8;

  return (
    <div style={{
      position: "absolute", left, top, width: popW,
      background: "#FFFCF9",
      borderRadius: 14,
      boxShadow: "0 12px 40px rgba(74,60,50,0.16), 0 2px 8px rgba(74,60,50,0.07)",
      border: "1px solid var(--color-border)",
      pointerEvents: "none",
      zIndex: 20,
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        padding: "9px 14px 8px",
        borderBottom: "1px solid var(--color-border)",
        display: "flex", alignItems: "baseline", gap: 8,
        background: "rgba(140,111,95,0.04)",
      }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--color-text)" }}>
          {table.name}
        </span>
        <span style={{ fontSize: 11, color: "var(--color-text)", opacity: 0.4 }}>
          {assigned}/{table.capacity} asientos
        </span>
        {assigned > 0 && (
          <span style={{
            marginLeft: "auto", fontSize: 10, fontWeight: 600,
            color: assigned === table.capacity ? "var(--color-success)" : "var(--color-cta)",
          }}>
            {assigned === table.capacity ? "Completa" : `${table.capacity - assigned} libres`}
          </span>
        )}
      </div>

      {/* SVG preview */}
      <div style={{ padding: `${PADDING}px`, display: "flex", justifyContent: "center" }}>
        <svg width={svgW} height={svgH}
          viewBox={`${-hx} ${-hy} ${hx * 2} ${hy * 2}`}
          style={{ overflow: "visible" }}>

          {/* Table shape */}
          {isRound
            ? <circle cx={0} cy={0} r={r} fill="#ffffff" stroke="#B4A494" strokeWidth={1.5} />
            : <rect x={-w/2} y={-h/2} width={w} height={h} rx={5} fill="#ffffff" stroke="#B4A494" strokeWidth={1.5} />
          }
          <text textAnchor="middle" y={-4} fontSize={10} fontWeight={600}
            fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>
            {table.name}
          </text>
          <text textAnchor="middle" y={8} fontSize={8} opacity={0.4}
            fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>
            {assigned}/{table.capacity}
          </text>

          {/* Chairs + floating names */}
          {chairs.map((ch, i) => {
            const a     = table.assignments[i];
            const guest = a?.guestId ? guests.find((g) => g.id === a.guestId) : null;
            const name  = guest ? shortName(getGuestName(guests, a.guestId)) : null;
            const dist  = Math.hypot(ch.x, ch.y);
            const dx = dist > 0 ? ch.x / dist : 0;
            const dy = dist > 0 ? ch.y / dist : 1;
            const nx = ch.x + dx * nameDist;
            const ny = ch.y + dy * nameDist;
            const fs = Math.max(6, Math.min(9, chairR * 0.72));

            return (
              <g key={i}>
                <circle cx={ch.x} cy={ch.y} r={chairR}
                  fill={guest ? "#8c6f5f" : "#EDE4D9"}
                  stroke={guest ? "#7a5f51" : "#C4B7A6"}
                  strokeWidth={0.75} />
                {name && (
                  <text x={nx} y={ny}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize={fs} fill="var(--color-text)"
                    style={{ pointerEvents: "none", userSelect: "none" }}>
                    {name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
