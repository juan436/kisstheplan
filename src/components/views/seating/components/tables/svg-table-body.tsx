"use client";

import type { TableSeat, Guest } from "@/types";
import { normalizeDish } from "@/lib/allergy-colors";

interface SvgTableBodyProps {
  table: TableSeat;
  guests: Guest[];
  chairs: { x: number; y: number }[];
  chairR: number;
  r: number;
  w: number;
  h: number;
  tableFill: string;
  stroke: string;
  strokeW: number;
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
}

export function SvgTableBody({ table, guests, chairs, chairR, r, w, h, tableFill, stroke, strokeW, allergyColors, mealColors }: SvgTableBodyProps) {
  const isRound      = table.shape === "round";
  const isSerpentine = table.shape === "serpentine";

  return (
    <>
      {chairs.map((ch, i) => {
        const a = table.assignments[i];
        const guest = a?.guestId ? guests.find((g) => g.id === a.guestId) : null;
        const allergies = guest?.allergies?.trim() ? guest.allergies.split(",").map((s) => s.trim()).filter(Boolean) : [];
        const allergyColor = allergies.length > 0 ? (allergyColors[allergies[0]] ?? "#f59e0b") : null;
        const mealColor = guest?.dish?.trim() ? (mealColors[normalizeDish(guest.dish)] ?? null) : null;
        const dotR = Math.max(1.5, chairR * 0.32);
        return (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={chairR} fill={guest ? "#8c6f5f" : "#EDE4D9"} stroke={guest ? "#7a5f51" : "#C4B7A6"} strokeWidth={0.75} />
            {allergyColor && <circle cx={ch.x + chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR} fill={allergyColor} stroke="white" strokeWidth={0.5} />}
            {mealColor    && <circle cx={ch.x - chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR} fill={mealColor}    stroke="white" strokeWidth={0.5} />}
          </g>
        );
      })}
      {isRound
        ? <circle cx={0} cy={0} r={r} fill={tableFill} stroke={stroke} strokeWidth={strokeW} />
        : isSerpentine
          ? (() => {
              const vy = r * 0.4, hw = r * 1.4, depth = r * 0.5;
              const sp = `M ${-hw},0 C ${-hw},${-vy} 0,${-vy} 0,0 C 0,${vy} ${hw},${vy} ${hw},0`;
              return (
                <>
                  <path d={sp} fill="none" stroke={stroke} strokeWidth={depth + strokeW * 2} strokeLinecap="round" />
                  <path d={sp} fill="none" stroke={tableFill} strokeWidth={depth} strokeLinecap="round" />
                </>
              );
            })()
          : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={tableFill} stroke={stroke} strokeWidth={strokeW} />
      }
    </>
  );
}
