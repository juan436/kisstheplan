"use client";

import { useState } from "react";
import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS } from "../constants/seating.constants";
import { tableRadius, rectDims, getGuestName, getTableDiameter, getRectTableDims } from "../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs } from "../helpers/chair.helpers";

interface SvgTableProps {
  table: TableSeat;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  resizeMode: boolean;
  deleteMode: boolean;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const PILL_W = 52;
const PILL_H = 13;
const TAG_DIST = CHAIR_RADIUS + 6 + 26; // ensures pill never overlaps chair

function getShortName(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 9);
  return `${parts[0]} ${parts[1][0]}.`;
}

export function SvgTable({ table, guests, scale, mode, resizeMode, deleteMode, isSelected, onMouseDown, onClick }: SvgTableProps) {
  const [hovered, setHovered] = useState(false);
  const isRound = table.shape === "round";

  // Prefer explicit physical dimensions (set via resize tool) over capacity-based defaults
  const r = tableRadius(table.physicalDiameter ?? getTableDiameter(table.capacity), scale);
  const rw = table.physicalWidth  ?? getRectTableDims().width;
  const rh = table.physicalHeight ?? getRectTableDims().height;
  const { w, h } = rectDims(rw, rh, scale);
  const chairs = isRound ? roundTableChairs(table.capacity, r) : rectTableChairs(w, h, table.capacity);

  const showTags  = hovered || isSelected;
  const tableFill = deleteMode && hovered ? "rgba(196,122,122,0.12)" : isSelected ? "rgba(140,111,95,0.10)" : "#ffffff";
  const stroke    = deleteMode && hovered ? "var(--color-danger)" : isSelected ? "var(--color-accent)" : "#B4A494";
  const strokeW   = (deleteMode && hovered) || isSelected ? 1.5 : 1;
  const assigned  = table.assignments.filter((a) => a.guestId).length;

  return (
    <g
      id={`table-g-${table.id}`}
      transform={`translate(${table.posX},${table.posY})`}
      style={{ cursor: deleteMode ? "crosshair" : (mode === "layout" && !resizeMode ? "grab" : "pointer") }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {chairs.map((ch, i) => {
        const a = table.assignments[i];
        const guest = a?.guestId ? guests.find((g) => g.id === a.guestId) : null;
        const hasAllergy = !!guest?.allergies?.trim();
        const dist = Math.hypot(ch.x, ch.y);
        const dx = dist > 0 ? ch.x / dist : 0;
        const dy = dist > 0 ? ch.y / dist : 1;

        return (
          <g key={i}>
            {/* Chair circle */}
            <circle cx={ch.x} cy={ch.y} r={CHAIR_RADIUS}
              fill={guest ? "#8c6f5f" : "#EDE4D9"}
              stroke={guest ? "#7a5f51" : "#C4B7A6"}
              strokeWidth={0.75} />

            {/* Floating name-tag pill */}
            {showTags && guest && (
              <g transform={`translate(${ch.x + dx * TAG_DIST},${ch.y + dy * TAG_DIST})`}>
                <rect x={-PILL_W / 2} y={-PILL_H / 2} width={PILL_W} height={PILL_H}
                  rx={PILL_H / 2} fill="white"
                  stroke="#C4B7A6" strokeWidth={0.5}
                  style={{ filter: "drop-shadow(0 1px 3px rgba(74,60,50,0.14))" }} />
                {hasAllergy && (
                  <circle cx={-PILL_W / 2 + 8} cy={0} r={3} fill="#f59e0b" />
                )}
                <text
                  x={hasAllergy ? -PILL_W / 2 + 15 : 0}
                  textAnchor={hasAllergy ? "start" : "middle"}
                  dominantBaseline="central"
                  fontSize={7}
                  fill="var(--color-text)"
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {getShortName(getGuestName(guests, a.guestId))}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Table shape (drawn after chairs so it renders on top) */}
      {isRound
        ? <circle cx={0} cy={0} r={r} fill={tableFill} stroke={stroke} strokeWidth={strokeW} />
        : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={tableFill} stroke={stroke} strokeWidth={strokeW} />
      }

      {/* Table labels */}
      <text textAnchor="middle" y={-5} fontSize={11} fontWeight={600}
        fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>
        {table.name}
      </text>
      <text textAnchor="middle" y={9} fontSize={9} fill="var(--color-text)" opacity={0.5}
        style={{ pointerEvents: "none", userSelect: "none" }}>
        {assigned}/{table.capacity}
      </text>

    </g>
  );
}
