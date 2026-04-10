"use client";

import type { SeatingPlan, Guest, DecorationObject, CalibZone } from "@/types";
import type { Guide } from "../hooks/use-canvas-guides";
import {
  WORLD_W, WORLD_H, DECORATION_META,
  ZONE_FILL_COLOR, ZONE_STROKE_COLOR, ZONE_GRID_COLOR, ZONE_GRID_MAX_LINES,
} from "../constants/seating.constants";
import { SvgTable } from "./svg-table";
import { getEffectiveScale } from "../helpers/seating.helpers";

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
  hoveredTableId?: string | null;
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
  zones, zonePoints, guides, zoningActive, resizeMode, showLabels, showName, deleteMode, decorations, selectedDecoId, calibPoints,
  hoveredTableId,
  onTableMouseDown, onTableClick, onTableRotate, onTableHover, onTableHoverEnd,
  onDecoMouseDown, onDecoClick, onSvgClick,
  onGuideMouseDown, onGuideDoubleClick,
}: CanvasSvgProps) {
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
        const emojiSize = Math.max(10, Math.min(28, Math.min(w, h) * 0.45));
        const isSelDeco = selectedDecoId === deco.id;
        const emoji = deco.customEmoji ?? m?.emoji ?? "?";
        const label = deco.label ?? m?.label ?? deco.type;
        return (
          <g key={deco.id} id={`deco-g-${deco.id}`}
            transform={`translate(${deco.posX},${deco.posY})`}
            style={{ cursor: deleteMode ? "crosshair" : (mode === "layout" ? "grab" : "default") }}
            onMouseDown={(e) => { e.stopPropagation(); onDecoMouseDown(e, deco.id); }}
            onClick={(e) => { e.stopPropagation(); if (mode === "layout") onDecoClick(deco.id, e.clientX, e.clientY); }}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6}
              fill={isSelDeco ? "rgba(140,111,95,0.18)" : "rgba(230,216,200,0.55)"}
              stroke={isSelDeco ? "var(--color-accent)" : "rgba(196,180,160,0.6)"}
              strokeWidth={isSelDeco ? 2 : 1} />
            <text textAnchor="middle" dominantBaseline="central" fontSize={emojiSize}
              style={{ pointerEvents: "none", userSelect: "none" }}>{emoji}</text>
            {/* Label pill — white rounded background so text is always legible over any image */}
            {(() => {
              const fs = 8.5;
              const pillW = Math.max(28, label.length * fs * 0.62 + 10);
              const pillH = 14;
              const pillY = h / 2 + 5;
              return (
                <g style={{ pointerEvents: "none", userSelect: "none" }}>
                  <rect x={-pillW / 2} y={pillY} width={pillW} height={pillH} rx={pillH / 2}
                    fill="white" opacity={0.92}
                    style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.18))" }} />
                  <text textAnchor="middle" y={pillY + pillH / 2 + 0.5}
                    dominantBaseline="central" fontSize={fs}
                    fill="#4A3C32" fontWeight={500}
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
