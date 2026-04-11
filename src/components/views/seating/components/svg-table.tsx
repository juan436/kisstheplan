"use client";

import { useState } from "react";
import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../constants/seating.constants";
import { tableRadius, rectDims, getGuestName, getTableDiameter, getRectTableDims } from "../helpers/seating.helpers";
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

const PILL_W    = 52;
const PILL_H    = 13;
const AVG_CHAR_W = 6.4; // avg char width px at fontSize 11, Quicksand

function getShortName(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length === 1 ? parts[0].slice(0, 9) : `${parts[0]} ${parts[1][0]}.`;
}

/** Standard truncation: clip to fit `availPx` with "…". */
function fitName(name: string, availPx: number): string {
  const max = Math.max(3, Math.floor(availPx / AVG_CHAR_W));
  return name.length <= max ? name : name.slice(0, max - 1) + "…";
}

/**
 * Aggressive abbreviation for narrow spaces (vertical rect tables).
 * Cascade: full → trailing number → word initials → single initial.
 * "Mesa Principal" → "M.P." | "Mesa 3" → "3" | "Novios" → "N."
 */
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
  const isRound       = table.shape === "round";
  const isSerpentine  = table.shape === "serpentine";
  const isRect        = table.shape === "rectangular";

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
  const TAG_DIST = chairR + 6 + 26;

  const chairs = isRound
    ? roundTableChairs(table.capacity, r, chairR)
    : isSerpentine
      ? serpentineTableChairs(table.capacity, r, chairR)
      : rectTableChairs(w, h, table.capacity, chairR);

  const rot = table.rotation ?? 0;
  // Rect rotated 90°/270°: visual width shrinks to h, needs aggressive abbreviation.
  const isVertical = isRect && (rot % 180 !== 0);

  // ── Name display ──────────────────────────────────────────────────────────────
  const availW = isRound
    ? r * 1.72
    : isSerpentine
      ? r * 1.5
      : (isVertical ? h * 0.78 : w * 0.82);
  const displayName = isVertical
    ? abbreviateName(table.name, availW)
    : fitName(table.name, availW);

  const innerHalf    = isRound ? r : isSerpentine ? r * 0.5 : (isVertical ? w / 2 : h / 2);
  const nameFontSize = Math.min(11, Math.max(7, innerHalf * 0.35));
  // For serpentine: label at center of S-curve (inflection point = origin).
  const nameLabelY   = 0;

  const nameFullyVisible = showLabels && showName && displayName === table.name;

  // ── Hover pill ────────────────────────────────────────────────────────────────
  const HOVER_H = 16;
  const HOVER_W = Math.min(Math.max(table.name.length * AVG_CHAR_W + 18, 50), 130);
  // serpentine: top edge ≈ half the depth (r*0.25) + the upper bulge (r)
  const topEdge = isRect ? (isVertical ? w / 2 : h / 2) : isSerpentine ? r * 0.75 : r;
  const pillY   = -(topEdge + chairR + 4 + HOVER_H / 2);

  // ── Visuals ───────────────────────────────────────────────────────────────────
  const showTags  = hovered || isSelected;
  const tableFill = deleteMode && hovered ? "rgba(196,122,122,0.12)" : isSelected ? "rgba(140,111,95,0.10)" : "#ffffff";
  const stroke    = deleteMode && hovered ? "var(--color-danger)" : isSelected ? "var(--color-accent)" : "#B4A494";
  const strokeW   = (deleteMode && hovered) || isSelected ? 1.5 : 1;

  return (
    <g id={`table-g-${table.id}`} data-rotation={rot}
      transform={`translate(${table.posX},${table.posY}) rotate(${rot})`}
      style={{ cursor: deleteMode ? "crosshair" : (mode === "layout" && !resizeMode ? "grab" : "pointer") }}
      onMouseDown={onMouseDown} onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); if (mode === "layout" && !deleteMode && !resizeMode) onRotate?.(); }}
      onMouseEnter={() => { setHovered(true); onHover?.(); }}
      onMouseLeave={() => { setHovered(false); onHoverEnd?.(); }}>

      {/* Chairs */}
      {chairs.map((ch, i) => {
        const a = table.assignments[i];
        const guest = a?.guestId ? guests.find((g) => g.id === a.guestId) : null;
        const guestAllergies = guest?.allergies?.trim()
          ? guest.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        const firstAllergyColor = guestAllergies.length > 0
          ? (allergyColors[guestAllergies[0]] ?? "#f59e0b")
          : null;
        const mealColor = guest?.dish?.trim() ? (mealColors[normalizeDish(guest.dish)] ?? null) : null;
        const dist = Math.hypot(ch.x, ch.y);
        const dx = dist > 0 ? ch.x / dist : 0;
        const dy = dist > 0 ? ch.y / dist : 1;
        const dotR = Math.max(1.5, chairR * 0.32);
        return (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={chairR}
              fill={guest ? "#8c6f5f" : "#EDE4D9"} stroke={guest ? "#7a5f51" : "#C4B7A6"} strokeWidth={0.75} />
            {firstAllergyColor && (
              <circle cx={ch.x + chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR}
                fill={firstAllergyColor} stroke="white" strokeWidth={0.5} />
            )}
            {mealColor && (
              <circle cx={ch.x - chairR * 0.55} cy={ch.y - chairR * 0.55} r={dotR}
                fill={mealColor} stroke="white" strokeWidth={0.5} />
            )}
            {showTags && guest && (
              <g transform={`translate(${ch.x + dx * TAG_DIST},${ch.y + dy * TAG_DIST})`}>
                <rect x={-PILL_W / 2} y={-PILL_H / 2} width={PILL_W} height={PILL_H} rx={PILL_H / 2} fill="white"
                  stroke="#C4B7A6" strokeWidth={0.5} style={{ filter: "drop-shadow(0 1px 3px rgba(74,60,50,0.14))" }} />
                {firstAllergyColor && <circle cx={-PILL_W / 2 + 8} cy={0} r={3} fill={firstAllergyColor} />}
                <text x={firstAllergyColor ? -PILL_W / 2 + 15 : 0} textAnchor={firstAllergyColor ? "start" : "middle"}
                  dominantBaseline="central" fontSize={7} fill="var(--color-text)"
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {getShortName(getGuestName(guests, a.guestId))}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Table shape */}
      {isRound
        ? <circle cx={0} cy={0} r={r} fill={tableFill} stroke={stroke} strokeWidth={strokeW} />
        : isSerpentine
          ? (() => {
              // Horizontal S: spine from (-r,0) curves UP to (0,0), then curves DOWN to (r,0)
              const sp = `M ${-r},0 C ${-r},${-r} 0,${-r} 0,0 C 0,${r} ${r},${r} ${r},0`;
              const depth = r * 0.5;
              return (
                <>
                  <path d={sp} fill="none" stroke={stroke} strokeWidth={depth + strokeW * 2} strokeLinecap="round" />
                  <path d={sp} fill="none" stroke={tableFill} strokeWidth={depth} strokeLinecap="round" />
                </>
              );
            })()
          : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={tableFill} stroke={stroke} strokeWidth={strokeW} />
      }

      {/*
        Name label — single text, perfectly centred (x=0 y=0) inside the table shape.
        Counter-rotated so it stays horizontal regardless of table rotation.
        Only renders when showLabels AND showName are both true (LOD gates).
        Capacity is intentionally omitted here — visible in the Preview Panel only.
      */}
      {showLabels && showName && (
        <g transform={`rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <text textAnchor="middle" dominantBaseline="middle" y={nameLabelY}
            fontSize={nameFontSize} fontWeight={600} fill="var(--color-text)">
            {displayName}
          </text>
        </g>
      )}

      {/*
        Floating name pill — appears on hover when the name is NOT fully visible inside:
        (a) showName=false (zoom too low) or (b) the name was truncated / abbreviated.
        Counter-rotated and positioned above the visual top edge of the (possibly rotated) table.
      */}
      {hovered && !nameFullyVisible && (
        <g transform={`rotate(${-rot})`} style={{ pointerEvents: "none", userSelect: "none" }}>
          <g transform={`translate(0,${pillY})`}>
            <rect x={-HOVER_W / 2} y={-HOVER_H / 2} width={HOVER_W} height={HOVER_H} rx={HOVER_H / 2}
              fill="white" stroke="#C4B7A6" strokeWidth={0.6}
              style={{ filter: "drop-shadow(0 1px 4px rgba(74,60,50,0.16))" }} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize={8.5} fill="var(--color-text)">
              {table.name}
            </text>
          </g>
        </g>
      )}

    </g>
  );
}
