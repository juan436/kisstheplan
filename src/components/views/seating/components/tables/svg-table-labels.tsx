"use client";

import type { TableSeat, Guest } from "@/types";
import { resolveTagCollisions } from "../../helpers/seating.helpers";
import { normalizeDish } from "@/lib/allergy-colors";

const PILL_W = 48, PILL_H = 10, AVG_CHAR_W = 6.4, PILL_FONT = 7;
const PILL_CW = PILL_FONT * 0.63;
const PILL_MAX = Math.floor((PILL_W - 10) / PILL_CW);
const HOVER_H = 12;

function getShortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const suf = parts.length > 1 ? ` ${parts[1][0].toUpperCase()}.` : "";
  if ((first + suf).length <= PILL_MAX) return first + suf;
  const room = PILL_MAX - suf.length;
  return room >= 2 ? first.slice(0, room) + suf : first.slice(0, PILL_MAX - 1) + "…";
}
function fitName(name: string, availPx: number): string {
  const max = Math.max(3, Math.floor(availPx / AVG_CHAR_W));
  return name.length <= max ? name : name.slice(0, max - 1) + "…";
}
function abbreviateName(name: string, availPx: number): string {
  if (name.length * AVG_CHAR_W <= availPx) return name;
  const numMatch = name.match(/(\d+)\s*$/);
  if (numMatch && numMatch[1].length * AVG_CHAR_W <= availPx) return numMatch[1];
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    const abbr = words.map((w) => (/^\d+$/.test(w) ? w : w[0].toUpperCase() + ".")).join("");
    if (abbr.length * AVG_CHAR_W <= availPx) return abbr;
  }
  return name[0].toUpperCase() + ".";
}

interface SvgTableLabelsProps {
  table: TableSeat;
  guests: Guest[];
  chairs: { x: number; y: number }[];
  chairR: number;
  r: number;
  w: number;
  h: number;
  rot: number;
  showLabels: boolean;
  showName: boolean;
  hovered: boolean;
  isSelected: boolean;
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
}

export function SvgTableLabels({ table, guests, chairs, chairR, r, w, h, rot, showLabels, showName, hovered, isSelected, allergyColors, mealColors }: SvgTableLabelsProps) {
  const isRound = table.shape === "round", isSerpentine = table.shape === "serpentine";
  const isRect = table.shape === "rectangular";
  const isVertical = isRect && (rot % 180 !== 0);
  const tagGap = (isRect || isSerpentine) && rot % 180 === 0 ? 6 : 18;
  const TAG_DIST = chairR + PILL_H / 2 + tagGap;
  const rotRad = (rot * Math.PI) / 180;
  const cr = Math.cos(rotRad), sr = Math.sin(rotRad);

  const availW = isRound ? r * 1.72 : isSerpentine ? r * 1.4 : (isVertical ? h * 0.78 : w * 0.82);
  const displayName = (isVertical || isSerpentine) ? abbreviateName(table.name, availW) : fitName(table.name, availW);
  const innerHalf = isRound ? r : isSerpentine ? r * 0.5 : (isVertical ? w / 2 : h / 2);
  const nameFontSize = Math.min(11, Math.max(7, innerHalf * 0.35));
  const nameFullyVisible = showLabels && showName && displayName === table.name;

  const HOVER_W = Math.min(Math.max(table.name.length * AVG_CHAR_W + 12, 40), 110);
  const chairEdge = isRect ? h / 2 : isSerpentine ? r * 0.65 : r;
  const pillY = -(chairEdge + 1.4 * chairR + TAG_DIST + PILL_H / 2 + 4 + HOVER_H / 2);
  const pillYEmpty = -(chairEdge + 1.4 * chairR + TAG_DIST);

  const hasGuests = table.assignments.some((a) => !!a?.guestId);
  const showTags = hovered || isSelected;

  type TagEntry = { idx: number; name: string; allergyColor: string | null; mealColor: string | null; lx: number; ly: number };
  const resolvedTags: TagEntry[] = [];
  if (showTags && hasGuests) {
    const raw: (TagEntry & { wx: number; wy: number })[] = [];
    chairs.forEach((ch, i) => {
      const a = table.assignments[i];
      const guest = a?.guestId ? guests.find((g) => g.id === a.guestId) : null;
      if (!guest) return;
      let dx = 0, dy = 0;
      if (isRound) { const d = Math.hypot(ch.x, ch.y); dx = d > 0 ? ch.x / d : 0; dy = d > 0 ? ch.y / d : 1; }
      else { dy = ch.y < 0 ? -1 : 1; }
      const lx0 = ch.x + dx * TAG_DIST, ly0 = ch.y + dy * TAG_DIST;
      const allergies = guest.allergies?.trim() ? guest.allergies.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const allergyColor = allergies.length > 0 ? (allergyColors[allergies[0]] ?? "#f59e0b") : null;
      const mealColor = guest.dish?.trim() ? (mealColors[normalizeDish(guest.dish)] ?? null) : null;
      raw.push({ idx: i, name: getShortName(guest.name), allergyColor, mealColor, lx: lx0, ly: ly0, wx: cr * lx0 - sr * ly0, wy: sr * lx0 + cr * ly0 });
    });
    const forceAxis = isRound ? undefined : (rot % 180 === 0 ? "x" : "y") as "x" | "y";
    const resolved = resolveTagCollisions(raw.map((t) => ({ cx: t.wx, cy: t.wy, w: PILL_W, h: PILL_H })), 8, 2, forceAxis);
    raw.forEach((t, i) => { const rwx = resolved[i].cx, rwy = resolved[i].cy; resolvedTags.push({ ...t, lx: cr * rwx + sr * rwy, ly: -sr * rwx + cr * rwy }); });
  }

  return (
    <>
      {showLabels && showName && (
        <g transform={`rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <text textAnchor="middle" dominantBaseline="middle" fontSize={nameFontSize} fontWeight={600} fill="var(--color-text)">{displayName}</text>
        </g>
      )}
      {resolvedTags.map((tag) => (
        <g key={`tag-${tag.idx}`} transform={`translate(${tag.lx},${tag.ly}) rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <rect x={-PILL_W / 2} y={-PILL_H / 2} width={PILL_W} height={PILL_H} rx={PILL_H / 2} fill="white" stroke="#C4B7A6" strokeWidth={0.5} style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.12))" }} />
          {tag.allergyColor && <circle cx={-PILL_W / 2 + 7} cy={0} r={2.5} fill={tag.allergyColor} />}
          <text x={tag.allergyColor ? -PILL_W / 2 + 13 : 0} textAnchor={tag.allergyColor ? "start" : "middle"} dominantBaseline="central" fontSize={7} fill="var(--color-text)">{tag.name}</text>
        </g>
      ))}
      {hovered && (!nameFullyVisible || !hasGuests) && (
        <g transform={`rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <g transform={`translate(0,${hasGuests ? pillY : pillYEmpty})`}>
            <rect x={-HOVER_W / 2} y={-HOVER_H / 2} width={HOVER_W} height={HOVER_H} rx={HOVER_H / 2} fill="white" stroke="#C4B7A6" strokeWidth={0.6} style={{ filter: "drop-shadow(0 1px 4px rgba(74,60,50,0.16))" }} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize={7.5} fill="var(--color-text)">{table.name}</text>
          </g>
        </g>
      )}
    </>
  );
}
