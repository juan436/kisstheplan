"use client";

import { useState } from "react";
import type { SeatingPlan, Guest, DecorationObject, CalibZone } from "@/types";
import type { Guide } from "../hooks/use-canvas-guides";
import {
  WORLD_W, WORLD_H, DECORATION_META,
  ZONE_FILL_COLOR, ZONE_STROKE_COLOR, ZONE_GRID_COLOR, ZONE_GRID_MAX_LINES,
} from "../constants/seating.constants";
import { SvgTable } from "./svg-table";
import { getEffectiveScale } from "../helpers/seating.helpers";
import { hasDecoIcon, DecoIconContent } from "./deco-icon-content";
import { normalizeDish } from "@/lib/allergy-colors";

/** Abbreviates to "Name S." or "Name" (≤9 chars), matching svg-table behaviour. */
function getShortName(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length === 1 ? parts[0].slice(0, 9) : `${parts[0]} ${parts[1][0]}.`;
}

const GUIDE_COLOR  = "rgba(0, 210, 255, 0.75)";
const GUIDE_HIT_W  = 10; // invisible wider stroke for easy drag

interface CanvasSvgProps {
  plan: SeatingPlan;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  bgImage: string | null;
  seatingTable: string | null;
  snapEnabled: boolean;
  zones: CalibZone[];
  zonePoints: { x: number; y: number }[];
  guides: Guide[];
  zoningActive: boolean;
  resizeMode: boolean;
  showLabels: boolean;
  showName: boolean;
  decorations: DecorationObject[];
  selectedDecoId: string | null;
  calibPoints: { x: number; y: number }[];
  deleteMode: boolean;
  hideObjectLabels?: boolean;
  hoveredTableId?: string | null;
  allergyColors?: Record<string, string>;
  mealColors?: Record<string, string>;
  onTableMouseDown: (e: React.MouseEvent, tableId: string) => void;
  onTableClick: (tableId: string) => void;
  onTableRotate: (tableId: string) => void;
  onTableHover: (tableId: string) => void;
  onTableHoverEnd: () => void;
  onDecoMouseDown: (e: React.MouseEvent, id: string) => void;
  onDecoClick: (id: string, clientX: number, clientY: number) => void;
  onSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onGuideMouseDown: (e: React.MouseEvent, id: string) => void;
  onGuideDoubleClick: (id: string) => void;
}

function polyPoints(pts: { x: number; y: number }[]): string {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

/** Neon grid lines for a zone, clipped to its polygon and rendered with glow. */
function ZoneNeonGrid({ zone }: { zone: CalibZone }) {
  const pts = zone.points;
  const minX = Math.min(...pts.map((p) => p.x));
  const maxX = Math.max(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  const maxY = Math.max(...pts.map((p) => p.y));

  const s = zone.localScale;
  const startX = Math.floor(minX / s) * s;
  const startY = Math.floor(minY / s) * s;

  const cols = Math.min(Math.ceil((maxX - startX) / s) + 2, ZONE_GRID_MAX_LINES);
  const rows = Math.min(Math.ceil((maxY - startY) / s) + 2, ZONE_GRID_MAX_LINES);

  const vLines = Array.from({ length: cols }, (_, i) => startX + i * s);
  const hLines = Array.from({ length: rows }, (_, i) => startY + i * s);

  return (
    <g clipPath={`url(#zone-clip-${zone.id})`} filter="url(#neon-glow)">
      {vLines.map((x, i) => (
        <line key={`v${i}`} x1={x} y1={minY - s} x2={x} y2={maxY + s}
          stroke={ZONE_GRID_COLOR} strokeWidth={1} opacity={0.95} />
      ))}
      {hLines.map((y, i) => (
        <line key={`h${i}`} x1={minX - s} y1={y} x2={maxX + s} y2={y}
          stroke={ZONE_GRID_COLOR} strokeWidth={1} opacity={0.95} />
      ))}
    </g>
  );
}

export function CanvasSvg({
  plan, guests, scale, mode, bgImage, seatingTable, snapEnabled,
  zones, zonePoints, guides, zoningActive, resizeMode, showLabels, showName, deleteMode, hideObjectLabels = false, decorations, selectedDecoId, calibPoints,
  hoveredTableId, allergyColors = {}, mealColors = {},
  onTableMouseDown, onTableClick, onTableRotate, onTableHover, onTableHoverEnd,
  onDecoMouseDown, onDecoClick, onSvgClick,
  onGuideMouseDown, onGuideDoubleClick,
}: CanvasSvgProps) {
  const [hoveredDecoId, setHoveredDecoId] = useState<string | null>(null);

  // Sort tables so hovered/selected renders last → highest SVG stacking order → names on top
  const sortedTables = [...plan.tables].sort((a, b) => {
    const aTop = a.id === hoveredTableId || a.id === seatingTable ? 1 : 0;
    const bTop = b.id === hoveredTableId || b.id === seatingTable ? 1 : 0;
    return aTop - bTop;
  });
  return (
    <svg width={WORLD_W} height={WORLD_H} onClick={onSvgClick}
      style={{ display: "block", overflow: "visible", userSelect: "none" }}
      onDragStart={(e) => e.preventDefault()}>
      <defs>
        {/* Neon glow filter: triple-layer blur for vivid electric effect */}
        <filter id="neon-glow" x="-80%" y="-80%" width="260%" height="260%"
          colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow-outer" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow-mid" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="glow-inner" />
          <feMerge>
            <feMergeNode in="glow-outer" />
            <feMergeNode in="glow-mid" />
            <feMergeNode in="glow-inner" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Zone clip paths */}
        {zones.map((z) => (
          <clipPath key={`clip-${z.id}`} id={`zone-clip-${z.id}`}>
            <polygon points={polyPoints(z.points)} />
          </clipPath>
        ))}
      </defs>

      {/* Background — purely visual, never interactive */}
      {bgImage
        ? <image href={bgImage} width={WORLD_W} height={WORLD_H} preserveAspectRatio="xMidYMid slice"
            style={{ pointerEvents: "none", userSelect: "none" }} />
        : <rect width={WORLD_W} height={WORLD_H} fill="#EDE4D9" style={{ pointerEvents: "none" }} />
      }

      {/* Zones: always show subtle fill + dashed border */}
      {zones.map((z) => (
        <g key={`zone-${z.id}`}>
          <polygon points={polyPoints(z.points)} fill={ZONE_FILL_COLOR} />
          <polygon points={polyPoints(z.points)} fill="none"
            stroke={ZONE_STROKE_COLOR} strokeWidth={1.5} strokeDasharray="8 5" />
          <text x={z.points[0].x + 6} y={z.points[0].y + 14}
            fontSize={10} fill={ZONE_GRID_COLOR} fontWeight={700} opacity={0.7}
            style={{ pointerEvents: "none", userSelect: "none" }}>
            {z.physicalWidth}×{z.physicalHeight} m
          </text>
        </g>
      ))}

      {/* Neon grid — ONLY when snap is active, ONLY inside zones */}
      {snapEnabled && zones.map((z) => (
        <ZoneNeonGrid key={`grid-${z.id}`} zone={z} />
      ))}

      {/* In-progress zone polygon while placing 4 points */}
      {zonePoints.length > 0 && (
        <g>
          {zonePoints.length > 1 && (
            <polyline points={polyPoints(zonePoints)} fill="none"
              stroke={ZONE_GRID_COLOR} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.8} />
          )}
          {zonePoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4}
              fill={ZONE_GRID_COLOR} stroke="white" strokeWidth={1} />
          ))}
        </g>
      )}

      {/* Guide lines — rendered below objects but above zones */}
      {guides.map((g) => {
        const isV = g.type === "vertical";
        const cur = isV ? "ew-resize" : "ns-resize";
        const x1 = isV ? g.position : 0;
        const y1 = isV ? 0 : g.position;
        const x2 = isV ? g.position : WORLD_W;
        const y2 = isV ? WORLD_H : g.position;
        return (
          <g key={g.id}>
            {/* Hit-area: fully transparent to pointer events while in zone-drawing mode
                so clicks reach the SVG canvas and can place zone points correctly. */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="transparent" strokeWidth={GUIDE_HIT_W}
              style={{ cursor: zoningActive ? "default" : cur, pointerEvents: zoningActive ? "none" : "all" }}
              onMouseDown={zoningActive ? undefined : (e) => { e.stopPropagation(); onGuideMouseDown(e, g.id); }}
              onClick={zoningActive ? undefined : (e) => e.stopPropagation()}
              onDoubleClick={zoningActive ? undefined : (e) => { e.stopPropagation(); onGuideDoubleClick(g.id); }} />
            {/* Visible guide line — always non-interactive */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={GUIDE_COLOR} strokeWidth={1} strokeDasharray="6 4"
              style={{ pointerEvents: "none" }} />
          </g>
        );
      })}

      {/* Decorations */}
      {decorations.map((deco) => {
        const m = deco.type !== "custom_emoji" ? DECORATION_META[deco.type] : null;
        const pw = deco.physicalWidth ?? m?.physicalW ?? 1;
        const ph = deco.physicalHeight ?? m?.physicalH ?? 1;
        const decoScale = getEffectiveScale(deco.posX, deco.posY, zones, scale);
        const w = pw * decoScale;
        const h = ph * decoScale;
        const isSelDeco = selectedDecoId === deco.id;
        const useIcon = hasDecoIcon(deco.objectType);
        const emoji = deco.customEmoji ?? m?.emoji ?? "?";
        const emojiSize = Math.max(10, Math.min(28, Math.min(w, h) * 0.45));
        const label = deco.label ?? m?.label ?? deco.type;
        const isChair = deco.objectType === "chair";
        const chairGuest = isChair && deco.guestId ? guests.find((g) => g.id === deco.guestId) : null;
        const isHovered = hoveredDecoId === deco.id;

        // Allergy / meal colors for chairs (same logic as svg-table chairs)
        const guestAllergies = chairGuest?.allergies?.trim()
          ? chairGuest.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        const firstAllergyColor = guestAllergies.length > 0
          ? (allergyColors[guestAllergies[0]] ?? "#f59e0b") : null;
        const mealColor = chairGuest?.dish?.trim()
          ? (mealColors[normalizeDish(chairGuest.dish)] ?? null) : null;
        const dotR = Math.max(2, Math.min(w, h) * 0.15);

        const chairFill = isChair
          ? (chairGuest ? "rgba(140,111,95,0.22)" : "rgba(230,216,200,0.55)")
          : "rgba(230,216,200,0.55)";

        return (
          <g key={deco.id} id={`deco-g-${deco.id}`}
            transform={`translate(${deco.posX},${deco.posY})`}
            style={{ cursor: deleteMode ? "crosshair" : (mode === "seating" && isChair ? "pointer" : mode === "layout" ? "grab" : "default") }}
            onMouseDown={(e) => { e.stopPropagation(); onDecoMouseDown(e, deco.id); }}
            onMouseEnter={() => setHoveredDecoId(deco.id)}
            onMouseLeave={() => setHoveredDecoId(null)}
            onClick={(e) => { e.stopPropagation(); if (mode === "layout" || (mode === "seating" && isChair)) onDecoClick(deco.id, e.clientX, e.clientY); }}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6}
              fill={isSelDeco ? "rgba(140,111,95,0.18)" : chairFill}
              stroke={isSelDeco ? "var(--color-accent)" : (isChair && chairGuest ? "#8c6f5f" : "rgba(196,180,160,0.6)")}
              strokeWidth={isSelDeco ? 2 : (isChair && chairGuest ? 1.5 : 1)} />
            {useIcon ? (
              <g transform={`translate(${-w / 2},${-h / 2}) scale(${w / 32},${h / 32})`}
                style={{ pointerEvents: "none" }}>
                <DecoIconContent objectType={deco.objectType!} />
              </g>
            ) : (
              <text textAnchor="middle" dominantBaseline="central" fontSize={emojiSize}
                style={{ pointerEvents: "none", userSelect: "none" }}>{emoji}</text>
            )}

            {/* Chair: allergy dot top-right, meal dot top-left — always visible when assigned */}
            {isChair && firstAllergyColor && (
              <circle cx={w / 2 - dotR - 1} cy={-h / 2 + dotR + 1} r={dotR}
                fill={firstAllergyColor} stroke="white" strokeWidth={0.5}
                style={{ pointerEvents: "none" }} />
            )}
            {isChair && mealColor && (
              <circle cx={-w / 2 + dotR + 1} cy={-h / 2 + dotR + 1} r={dotR}
                fill={mealColor} stroke="white" strokeWidth={0.5}
                style={{ pointerEvents: "none" }} />
            )}

            {/* Chair: short-name pill — always visible when guest assigned (white, truncated) */}
            {!hideObjectLabels && isChair && chairGuest && (() => {
              const shortName = getShortName(chairGuest.name);
              const fs = 7;
              const pH = 12;
              const pW = Math.max(28, shortName.length * fs * 0.65 + 10);
              const py = h / 2 + 4;
              return (
                <g style={{ pointerEvents: "none", userSelect: "none" }}>
                  <rect x={-pW / 2} y={py} width={pW} height={pH} rx={pH / 2}
                    fill="white" stroke="#C4B7A6" strokeWidth={0.5}
                    style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.14))" }} />
                  {firstAllergyColor && (
                    <circle cx={-pW / 2 + 6} cy={py + pH / 2} r={2.5} fill={firstAllergyColor} />
                  )}
                  <text x={firstAllergyColor ? -pW / 2 + 13 : 0}
                    textAnchor={firstAllergyColor ? "start" : "middle"}
                    y={py + pH / 2} dominantBaseline="central"
                    fontSize={fs} fill="var(--color-text)"
                    style={{ pointerEvents: "none", userSelect: "none" }}>{shortName}</text>
                </g>
              );
            })()}

            {/* Chair: floating name pill on hover — above the chair, same style as table chairs */}
            {!hideObjectLabels && isChair && isHovered && (() => {
              const text = chairGuest?.name ?? label;
              const fs = 8;
              const pH = 14;
              const pW = Math.max(32, text.length * fs * 0.62 + 12);
              const py = -(h / 2 + 5 + pH);
              return (
                <g style={{ pointerEvents: "none", userSelect: "none" }}>
                  <rect x={-pW / 2} y={py} width={pW} height={pH} rx={pH / 2}
                    fill="white" stroke="#C4B7A6" strokeWidth={0.5}
                    style={{ filter: "drop-shadow(0 1px 4px rgba(74,60,50,0.16))" }} />
                  {firstAllergyColor && (
                    <circle cx={-pW / 2 + 7} cy={py + pH / 2} r={3} fill={firstAllergyColor} />
                  )}
                  <text x={firstAllergyColor ? -pW / 2 + 14 : 0}
                    textAnchor={firstAllergyColor ? "start" : "middle"}
                    y={py + pH / 2} dominantBaseline="central"
                    fontSize={fs} fill="var(--color-text)"
                    style={{ pointerEvents: "none", userSelect: "none" }}>{text}</text>
                </g>
              );
            })()}

            {/* Non-chair: label pill below — hidden when hideObjectLabels is active */}
            {!hideObjectLabels && !isChair && (() => {
              const fs = 8.5;
              const pillW = Math.max(28, label.length * fs * 0.62 + 10);
              const pillH = 14;
              return (
                <g style={{ pointerEvents: "none", userSelect: "none" }}>
                  <rect x={-pillW / 2} y={h / 2 + 5} width={pillW} height={pillH} rx={pillH / 2}
                    fill="white" opacity={0.92}
                    style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.18))" }} />
                  <text textAnchor="middle" y={h / 2 + 5 + pillH / 2 + 0.5}
                    dominantBaseline="central" fontSize={fs} fill="#4A3C32" fontWeight={500}
                    style={{ pointerEvents: "none", userSelect: "none" }}>{label}</text>
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* Tables — each gets the scale of the zone it sits in; hovered/selected renders last (SVG stacking = on top) */}
      {sortedTables.map((table) => (
        <SvgTable key={table.id} table={table} guests={guests}
          scale={getEffectiveScale(table.posX, table.posY, zones, scale)}
          mode={mode} resizeMode={resizeMode} deleteMode={deleteMode}
          showLabels={showLabels} showName={showName} isSelected={seatingTable === table.id}
          allergyColors={allergyColors}
          mealColors={mealColors}
          onMouseDown={(e) => onTableMouseDown(e, table.id)}
          onClick={() => onTableClick(table.id)}
          onRotate={() => onTableRotate(table.id)}
          onHover={() => onTableHover(table.id)}
          onHoverEnd={onTableHoverEnd}
        />
      ))}

      {/* Legacy calibration markers — hidden, kept for compat */}
      {calibPoints.length === 2 && (
        <line x1={calibPoints[0].x} y1={calibPoints[0].y}
          x2={calibPoints[1].x} y2={calibPoints[1].y}
          stroke="#c7a977" strokeWidth={2} strokeDasharray="8 4" opacity={0.4} />
      )}
    </svg>
  );
}
