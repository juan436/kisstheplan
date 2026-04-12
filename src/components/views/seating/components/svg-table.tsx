"use client";

import { useState } from "react";
import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../constants/seating.constants";
import { tableRadius, rectDims, getTableDiameter, getRectTableDims, resolveTagCollisions } from "../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs, serpentineTableChairs, computeRoundChairRadius, computeRectChairRadius, computeSerpentineChairRadius } from "../helpers/chair.helpers";
import { normalizeDish } from "@/lib/allergy-colors";

interface SvgTableProps {
  table: TableSeat;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  resizeMode: boolean;
  deleteMode: boolean;
  isSelected: boolean;
  /** LOD outer gate: when false, no text renders at all. */
  showLabels: boolean;
  /** LOD inner gate: when false, name hides internally and shows on hover as floating pill. */
  showName: boolean;
  allergyColors?: Record<string, string>;
  mealColors?: Record<string, string>;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
  onRotate?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
}

const PILL_W    = 48;
const PILL_H    = 10;
const AVG_CHAR_W = 6.4;
const PILL_FONT  = 7;                              // font-size inside pill (px)
const PILL_CW    = PILL_FONT * 0.63;               // ≈ 4.4 px/char at 7px Quicksand
const PILL_MAX   = Math.floor((PILL_W - 10) / PILL_CW); // ≈ 8 chars usable

/** "Maximiliano García" → "Maxim G." (always fits within PILL_W) */
function getShortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const suf   = parts.length > 1 ? ` ${parts[1][0].toUpperCase()}.` : "";
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

export function SvgTable({
  table, guests, scale, mode, resizeMode, deleteMode, isSelected,
  showLabels, showName, allergyColors = {}, mealColors = {},
  onMouseDown, onClick, onRotate, onHover, onHoverEnd,
}: SvgTableProps) {
  const [hovered, setHovered] = useState(false);
  const isRound      = table.shape === "round";
  const isSerpentine = table.shape === "serpentine";
  const isRect       = table.shape === "rectangular";

  // ── Geometry ──────────────────────────────────────────────────────────────────
  const r  = tableRadius(table.physicalDiameter ?? getTableDiameter(table.capacity), scale);
  const rw = table.physicalWidth  ?? getRectTableDims().width;
  const rh = table.physicalHeight ?? getRectTableDims().height;
  const { w, h } = rectDims(rw, rh, scale);

  const rawChairR = CHAIR_RADIUS_M * scale;
  const chairR = isRound
    ? computeRoundChairRadius(table.capacity, r, rawChairR)
    : isSerpentine
      ? computeSerpentineChairRadius(table.capacity, r, rawChairR)
      : computeRectChairRadius(w, table.capacity, rawChairR);

  const chairs = isRound
    ? roundTableChairs(table.capacity, r, chairR)
    : isSerpentine
      ? serpentineTableChairs(table.capacity, r, chairR)
      : rectTableChairs(w, h, table.capacity, chairR);

  const rot = table.rotation ?? 0;
  const isVertical = isRect && (rot % 180 !== 0);
  // Horizontal rect/serpentine: bring names closer to the chairs
  const tagGap = (isRect || isSerpentine) && rot % 180 === 0 ? 6 : 18;
  const TAG_DIST = chairR + PILL_H / 2 + tagGap;
  const rotRad = (rot * Math.PI) / 180;
  const cr = Math.cos(rotRad), sr = Math.sin(rotRad);

  // ── Name display ──────────────────────────────────────────────────────────────
  const availW = isRound
    ? r * 1.72
    : isSerpentine
      ? r * 1.4
      : (isVertical ? h * 0.78 : w * 0.82);
  const displayName = (isVertical || isSerpentine)
    ? abbreviateName(table.name, availW)
    : fitName(table.name, availW);

  const innerHalf    = isRound ? r : isSerpentine ? r * 0.5 : (isVertical ? w / 2 : h / 2);
  const nameFontSize = Math.min(11, Math.max(7, innerHalf * 0.35));
  const nameFullyVisible = showLabels && showName && displayName === table.name;

  // ── Hover pill geometry ────────────────────────────────────────────────────────
  const HOVER_H  = 12;
  const HOVER_W  = Math.min(Math.max(table.name.length * AVG_CHAR_W + 12, 40), 110);
  // For pill positioning always use the chair-row edge (h/2 for both rect orientations,
  // r*0.65 for serpentine), NOT w/2 for vertical — that would push pills too far sideways.
  const chairEdge = isRect ? h / 2 : isSerpentine ? r * 0.65 : r;
  // Above outermost guest tag:
  const pillY      = -(chairEdge + 1.4 * chairR + TAG_DIST + PILL_H / 2 + 4 + HOVER_H / 2);
  // For empty table: where top guest tag would sit:
  const pillYEmpty = -(chairEdge + 1.4 * chairR + TAG_DIST);

  // ── Visuals ───────────────────────────────────────────────────────────────────
  const showTags  = hovered || isSelected;
  const hasGuests = table.assignments.some(a => !!a?.guestId);
  const tableFill = deleteMode && hovered ? "rgba(196,122,122,0.12)" : isSelected ? "rgba(140,111,95,0.10)" : "#ffffff";
  const stroke    = deleteMode && hovered ? "var(--color-danger)" : isSelected ? "var(--color-accent)" : "#B4A494";
  const strokeW   = (deleteMode && hovered) || isSelected ? 1.5 : 1;

  // ── Pre-compute guest tags with collision resolution ───────────────────────────
  type TagEntry = { idx: number; name: string; allergyColor: string | null; mealColor: string | null; lx: number; ly: number; };
  const resolvedTags: TagEntry[] = [];
  if (showTags && hasGuests) {
    const raw: (TagEntry & { wx: number; wy: number })[] = [];
    chairs.forEach((ch, i) => {
      const a = table.assignments[i];
      const guest = a?.guestId ? guests.find(g => g.id === a.guestId) : null;
      if (!guest) return;
      // Round: radial outward from center. Rect/serpentine: perpendicular to nearest edge
      // (all chairs sit at y<0 = top side, y>0 = bottom side in local space).
      let dx: number, dy: number;
      if (isRound) {
        const dist = Math.hypot(ch.x, ch.y);
        dx = dist > 0 ? ch.x / dist : 0;
        dy = dist > 0 ? ch.y / dist : 1;
      } else {
        dx = 0;
        dy = ch.y < 0 ? -1 : 1;
      }
      const lx0 = ch.x + dx * TAG_DIST, ly0 = ch.y + dy * TAG_DIST;
      const allergies = guest.allergies?.trim() ? guest.allergies.split(",").map(s => s.trim()).filter(Boolean) : [];
      const allergyColor = allergies.length > 0 ? (allergyColors[allergies[0]] ?? "#f59e0b") : null;
      const mealColor = guest.dish?.trim() ? (mealColors[normalizeDish(guest.dish)] ?? null) : null;
      raw.push({ idx: i, name: getShortName(guest.name), allergyColor, mealColor, lx: lx0, ly: ly0, wx: cr * lx0 - sr * ly0, wy: sr * lx0 + cr * ly0 });
    });
    // Round: 2D resolver. Rect/serpentine: force axis matching table's long axis in world space.
    // Horizontal (rot%180==0) → long axis = world-X → forceAxis 'x' (spread tags horizontally).
    // Vertical  (rot%180!=0) → long axis = world-Y → forceAxis 'y' (spread tags vertically).
    const forceAxis = isRound ? undefined : (rot % 180 === 0 ? 'x' : 'y') as 'x' | 'y';
    const resolved = resolveTagCollisions(raw.map(t => ({ cx: t.wx, cy: t.wy, w: PILL_W, h: PILL_H })), 8, 2, forceAxis);
    raw.forEach((t, i) => {
      const rwx = resolved[i].cx, rwy = resolved[i].cy;
      resolvedTags.push({ ...t, lx: cr * rwx + sr * rwy, ly: -sr * rwx + cr * rwy });
    });
  }

  return (
    <g id={`table-g-${table.id}`} data-rotation={rot}
      transform={`translate(${table.posX},${table.posY}) rotate(${rot})`}
      style={{ cursor: deleteMode ? "crosshair" : (mode === "layout" && !resizeMode ? "grab" : "pointer") }}
      onMouseDown={onMouseDown} onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); if (mode === "layout" && !deleteMode && !resizeMode) onRotate?.(); }}
      onMouseEnter={() => { setHovered(true); onHover?.(); }}
      onMouseLeave={() => { setHovered(false); onHoverEnd?.(); }}>

      {/* Chairs — circles + allergy/meal dots */}
      {chairs.map((ch, i) => {
        const a = table.assignments[i];
        const guest = a?.guestId ? guests.find(g => g.id === a.guestId) : null;
        const allergies = guest?.allergies?.trim() ? guest.allergies.split(",").map(s => s.trim()).filter(Boolean) : [];
        const allergyColor = allergies.length > 0 ? (allergyColors[allergies[0]] ?? "#f59e0b") : null;
        const mealColor = guest?.dish?.trim() ? (mealColors[normalizeDish(guest.dish)] ?? null) : null;
        const dotR = Math.max(1.5, chairR * 0.32);
        return (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={chairR}
              fill={guest ? "#8c6f5f" : "#EDE4D9"} stroke={guest ? "#7a5f51" : "#C4B7A6"} strokeWidth={0.75} />
            {allergyColor && <circle cx={ch.x + chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR} fill={allergyColor} stroke="white" strokeWidth={0.5} />}
            {mealColor    && <circle cx={ch.x - chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR} fill={mealColor}    stroke="white" strokeWidth={0.5} />}
          </g>
        );
      })}

      {/* Table shape */}
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

      {/* Table name inside shape */}
      {showLabels && showName && (
        <g transform={`rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <text textAnchor="middle" dominantBaseline="middle" fontSize={nameFontSize} fontWeight={600} fill="var(--color-text)">
            {displayName}
          </text>
        </g>
      )}

      {/* Guest tags — collision-resolved, always horizontal */}
      {resolvedTags.map((tag) => (
        <g key={`tag-${tag.idx}`} transform={`translate(${tag.lx},${tag.ly}) rotate(${-rot})`}
          style={{ pointerEvents: "none", userSelect: "none" }}>
          <rect x={-PILL_W / 2} y={-PILL_H / 2} width={PILL_W} height={PILL_H} rx={PILL_H / 2}
            fill="white" stroke="#C4B7A6" strokeWidth={0.5}
            style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.12))" }} />
          {tag.allergyColor && <circle cx={-PILL_W / 2 + 7} cy={0} r={2.5} fill={tag.allergyColor} />}
          <text x={tag.allergyColor ? -PILL_W / 2 + 13 : 0}
            textAnchor={tag.allergyColor ? "start" : "middle"} dominantBaseline="central"
            fontSize={7} fill="var(--color-text)">{tag.name}</text>
        </g>
      ))}

      {/*
        Hover pill — two cases:
        (a) Table has guests but name was truncated → show above outermost tag (pillY).
        (b) Table has no guests → show where top tag would be (pillYEmpty), as contextual hint.
      */}
      {hovered && (!nameFullyVisible || !hasGuests) && (
        <g transform={`rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <g transform={`translate(0,${hasGuests ? pillY : pillYEmpty})`}>
            <rect x={-HOVER_W / 2} y={-HOVER_H / 2} width={HOVER_W} height={HOVER_H} rx={HOVER_H / 2}
              fill="white" stroke="#C4B7A6" strokeWidth={0.6}
              style={{ filter: "drop-shadow(0 1px 4px rgba(74,60,50,0.16))" }} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize={7.5} fill="var(--color-text)">
              {table.name}
            </text>
          </g>
        </g>
      )}

    </g>
  );
}
