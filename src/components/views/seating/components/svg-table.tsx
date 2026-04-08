"use client";

import { useState } from "react";
import type { TableSeat, Guest } from "@/types";
import {
  CHAIR_RADIUS,
  DEFAULT_ROUND_DIAMETER,
  DEFAULT_RECT_WIDTH,
  DEFAULT_RECT_HEIGHT,
} from "../constants/seating.constants";
import { tableRadius, rectDims, getGuestName } from "../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs } from "../helpers/chair.helpers";

interface SvgTableProps {
  table: TableSeat;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
  onDelete: () => void;
}

export function SvgTable({ table, guests, scale, mode, isSelected, onMouseDown, onClick, onDelete }: SvgTableProps) {
  const [hovered, setHovered] = useState(false);
  const isRound = table.shape === "round";

  const r = tableRadius(table.physicalDiameter ?? DEFAULT_ROUND_DIAMETER, scale);
  const { w, h } = rectDims(table.physicalWidth ?? DEFAULT_RECT_WIDTH, table.physicalHeight ?? DEFAULT_RECT_HEIGHT, scale);
  const chairs = isRound ? roundTableChairs(table.capacity, r) : rectTableChairs(w, h, table.capacity);

  const showNames = hovered || isSelected;
  const tableFill = isSelected ? "rgba(140,111,95,0.18)" : "rgba(230,216,200,0.8)";
  const stroke = isSelected ? "var(--color-accent)" : "var(--color-border)";
  const assigned = table.assignments.filter((a) => a.guestId).length;
  const delX = isRound ? r + 8 : w / 2 + 8;
  const delY = isRound ? -r - 8 : -h / 2 - 8;

  return (
    <g
      id={`table-g-${table.id}`}
      transform={`translate(${table.posX},${table.posY})`}
      style={{ cursor: mode === "layout" ? "grab" : "pointer" }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {chairs.map((ch, i) => {
        const a = table.assignments[i];
        const name = a?.guestId ? getGuestName(guests, a.guestId) : null;
        return (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={CHAIR_RADIUS}
              fill={a?.guestId ? "#8c6f5f" : "#E6D8C8"}
              stroke={stroke} strokeWidth={1} />
            {showNames && name && (
              <text x={ch.x} y={ch.y - CHAIR_RADIUS - 3}
                textAnchor="middle" fontSize={8} fill="var(--color-text)"
                style={{ pointerEvents: "none", userSelect: "none" }}>
                {name.split(" ")[0]}
              </text>
            )}
          </g>
        );
      })}

      {isRound
        ? <circle cx={0} cy={0} r={r} fill={tableFill} stroke={stroke} strokeWidth={2} />
        : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={tableFill} stroke={stroke} strokeWidth={2} />
      }

      <text textAnchor="middle" y={-5} fontSize={11} fontWeight={600}
        fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>
        {table.name}
      </text>
      <text textAnchor="middle" y={9} fontSize={9} fill="var(--color-text)" opacity={0.5}
        style={{ pointerEvents: "none", userSelect: "none" }}>
        {assigned}/{table.capacity}
      </text>

      {mode === "layout" && hovered && (
        <g transform={`translate(${delX},${delY})`} style={{ cursor: "pointer" }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <circle r={8} fill="var(--color-danger)" />
          <text textAnchor="middle" dominantBaseline="central" fontSize={13}
            fill="white" fontWeight={700} style={{ pointerEvents: "none", userSelect: "none" }}>
            ×
          </text>
        </g>
      )}
    </g>
  );
}
