import type { Guest, CalibZone } from "@/types";
import {
  DEFAULT_SCALE,
  DEFAULT_ROUND_DIAMETER,
  DEFAULT_RECT_WIDTH,
  DEFAULT_RECT_HEIGHT,
  ROUND_DIAMETER_STD,
  ROUND_DIAMETER_LARGE,
  RECT_FIXED_WIDTH,
  RECT_FIXED_HEIGHT,
  WORLD_W,
  WORLD_H,
} from "../constants/seating.constants";

/**
 * Clamps panOffset so the world never drifts outside the canvas viewport.
 * - If the world is smaller than the canvas in one axis → force 0 (centering handled by offsetX/offsetY).
 * - If the world is larger → constrain so no empty space appears at any edge.
 */
export function clampPan(
  pan: { x: number; y: number },
  zoom: number,
  canvasW: number,
  canvasH: number,
): { x: number; y: number } {
  const worldW = WORLD_W * zoom;
  const worldH = WORLD_H * zoom;
  return {
    x: worldW <= canvasW ? 0 : Math.min(0, Math.max(canvasW - worldW, pan.x)),
    y: worldH <= canvasH ? 0 : Math.min(0, Math.max(canvasH - worldH, pan.y)),
  };
}

/** Radio en px de una mesa redonda según su diámetro físico y escala actual */
export function tableRadius(
  physicalDiameter = DEFAULT_ROUND_DIAMETER,
  scale = DEFAULT_SCALE
): number {
  return (physicalDiameter * scale) / 2;
}

/** Dimensiones en px de una mesa rectangular según sus medidas físicas y escala */
export function rectDims(
  physicalW = DEFAULT_RECT_WIDTH,
  physicalH = DEFAULT_RECT_HEIGHT,
  scale = DEFAULT_SCALE
): { w: number; h: number } {
  return { w: physicalW * scale, h: physicalH * scale };
}

// ─── Zone-aware scale helpers ─────────────────────────────────────────────────

/** Ray-casting point-in-polygon test (exported so drag hooks can reuse it). */
export function pointInPolygon(px: number, py: number, poly: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi))
      inside = !inside;
  }
  return inside;
}

/**
 * Returns the local scale (px/m) of the first zone that contains (posX, posY).
 * Falls back to `fallback` when the point is outside every zone.
 *
 * Rule: Pixels = PhysicalMeters × LocalScale
 */
export function getEffectiveScale(
  posX: number, posY: number,
  zones: CalibZone[],
  fallback: number,
): number {
  for (const zone of zones) {
    if (pointInPolygon(posX, posY, zone.points)) return zone.localScale;
  }
  return fallback;
}

/** Legacy: tamaño en px basado en capacidad (usado en list-tab) */
export function tableSize(capacity: number): number {
  return Math.max(80, 80 + capacity * 8);
}

export function getGuestName(guests: Guest[], guestId?: string): string {
  if (!guestId) return "";
  const g = guests.find((g) => g.id === guestId);
  return g ? g.name : "Invitado";
}

export function formatMeters(px: number, scale: number): string {
  return `${(px / scale).toFixed(1)} m`;
}

/** Diámetro estándar de mesa redonda según capacidad (sector banquetero) */
export function getTableDiameter(capacity: number): number {
  return capacity >= 11 ? ROUND_DIAMETER_LARGE : ROUND_DIAMETER_STD;
}

/** Dimensiones estándar fijas de mesa rectangular (sector banquetero) */
export function getRectTableDims(): { width: number; height: number } {
  return { width: RECT_FIXED_WIDTH, height: RECT_FIXED_HEIGHT };
}

// ─── Guest tag collision resolution ──────────────────────────────────────────

export interface TagRect { cx: number; cy: number; w: number; h: number; }

/**
 * Iteratively push-apart axis-aligned rectangles (world-space AABB) to eliminate overlaps.
 * Counter-rotated guest tags are always horizontal → safe to treat as AABB.
 */
export function resolveTagCollisions(rects: TagRect[], maxIter = 8, gap = 2): TagRect[] {
  const out = rects.map((r) => ({ ...r }));
  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i], b = out[j];
        const ox = (a.w + b.w) / 2 + gap - Math.abs(a.cx - b.cx);
        const oy = (a.h + b.h) / 2 + gap - Math.abs(a.cy - b.cy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox <= oy) {
          const half = ox / 2;
          if (a.cx <= b.cx) { a.cx -= half; b.cx += half; } else { a.cx += half; b.cx -= half; }
        } else {
          const half = oy / 2;
          if (a.cy <= b.cy) { a.cy -= half; b.cy += half; } else { a.cy += half; b.cy -= half; }
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}
