"use client";

import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../../constants/seating.constants";
import { tableRadius, rectDims, getTableDiameter, getRectTableDims } from "../../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs, computeRoundChairRadius, computeRectChairRadius } from "../../helpers/chair.helpers";
import { normalizeDish } from "@/lib/allergy-colors";

export type ColorMode = "menu" | "alergia";
export const PANEL_W = 350;
const TOPO_SCALE = 42;

export function SeatPill({ index, guest, allergyColors, mealColors, colorMode }: {
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

export function TopoSvg({ table, guests, allergyColors, mealColors, colorMode }: {
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
