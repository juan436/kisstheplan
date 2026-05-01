"use client";

import type { CalibZone } from "@/types";
import type { Guide } from "../../hooks/use-canvas-guides";
import {
  WORLD_W, WORLD_H,
  ZONE_FILL_COLOR, ZONE_STROKE_COLOR, ZONE_GRID_COLOR, ZONE_GRID_MAX_LINES,
} from "../../constants/seating.constants";

const GUIDE_COLOR = "rgba(0, 210, 255, 0.75)";
const GUIDE_HIT_W = 10;

function polyPoints(pts: { x: number; y: number }[]): string {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

function ZoneNeonGrid({ zone }: { zone: CalibZone }) {
  const pts = zone.points;
  const minX = Math.min(...pts.map((p) => p.x)), maxX = Math.max(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y)), maxY = Math.max(...pts.map((p) => p.y));
  const s = zone.localScale;
  const startX = Math.floor(minX / s) * s, startY = Math.floor(minY / s) * s;
  const cols = Math.min(Math.ceil((maxX - startX) / s) + 2, ZONE_GRID_MAX_LINES);
  const rows = Math.min(Math.ceil((maxY - startY) / s) + 2, ZONE_GRID_MAX_LINES);
  const vLines = Array.from({ length: cols }, (_, i) => startX + i * s);
  const hLines = Array.from({ length: rows }, (_, i) => startY + i * s);
  return (
    <g clipPath={`url(#zone-clip-${zone.id})`} filter="url(#neon-glow)">
      {vLines.map((x, i) => <line key={`v${i}`} x1={x} y1={minY - s} x2={x} y2={maxY + s} stroke={ZONE_GRID_COLOR} strokeWidth={1} opacity={0.95} />)}
      {hLines.map((y, i) => <line key={`h${i}`} x1={minX - s} y1={y} x2={maxX + s} y2={y} stroke={ZONE_GRID_COLOR} strokeWidth={1} opacity={0.95} />)}
    </g>
  );
}

interface CanvasSvgOverlaysProps {
  zones: CalibZone[];
  zonePoints: { x: number; y: number }[];
  guides: Guide[];
  snapEnabled: boolean;
  zoningActive: boolean;
  onGuideMouseDown: (e: React.MouseEvent, id: string) => void;
  onGuideDoubleClick: (id: string) => void;
}

export function CanvasSvgOverlays({ zones, zonePoints, guides, snapEnabled, zoningActive, onGuideMouseDown, onGuideDoubleClick }: CanvasSvgOverlaysProps) {
  return (
    <>
      {zones.map((z) => (
        <g key={`zone-${z.id}`}>
          <polygon points={polyPoints(z.points)} fill={ZONE_FILL_COLOR} />
          <polygon points={polyPoints(z.points)} fill="none" stroke={ZONE_STROKE_COLOR} strokeWidth={1.5} strokeDasharray="8 5" />
          <text x={z.points[0].x + 6} y={z.points[0].y + 14} fontSize={10} fill={ZONE_GRID_COLOR} fontWeight={700} opacity={0.7} style={{ pointerEvents: "none", userSelect: "none" }}>
            {z.physicalWidth}×{z.physicalHeight} m
          </text>
        </g>
      ))}
      {snapEnabled && zones.map((z) => <ZoneNeonGrid key={`grid-${z.id}`} zone={z} />)}
      {zonePoints.length > 0 && (
        <g>
          {zonePoints.length > 1 && (
            <polyline points={polyPoints(zonePoints)} fill="none" stroke={ZONE_GRID_COLOR} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.8} />
          )}
          {zonePoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={ZONE_GRID_COLOR} stroke="white" strokeWidth={1} />)}
        </g>
      )}
      {guides.map((g) => {
        const isV = g.type === "vertical";
        const cur = isV ? "ew-resize" : "ns-resize";
        const x1 = isV ? g.position : 0,   y1 = isV ? 0 : g.position;
        const x2 = isV ? g.position : WORLD_W, y2 = isV ? WORLD_H : g.position;
        return (
          <g key={g.id}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={GUIDE_HIT_W}
              style={{ cursor: zoningActive ? "default" : cur, pointerEvents: zoningActive ? "none" : "all" }}
              onMouseDown={zoningActive ? undefined : (e) => { e.stopPropagation(); onGuideMouseDown(e, g.id); }}
              onClick={zoningActive ? undefined : (e) => e.stopPropagation()}
              onDoubleClick={zoningActive ? undefined : (e) => { e.stopPropagation(); onGuideDoubleClick(g.id); }} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GUIDE_COLOR} strokeWidth={1} strokeDasharray="6 4" style={{ pointerEvents: "none" }} />
          </g>
        );
      })}
    </>
  );
}
