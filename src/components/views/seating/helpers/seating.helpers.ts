import type { Guest } from "@/types";
import {
  DEFAULT_SCALE,
  DEFAULT_ROUND_DIAMETER,
  DEFAULT_RECT_WIDTH,
  DEFAULT_RECT_HEIGHT,
} from "../constants/seating.constants";

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
