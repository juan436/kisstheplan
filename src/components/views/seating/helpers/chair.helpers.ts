import { CHAIR_RADIUS, CHAIR_GAP } from "../constants/seating.constants";

export interface ChairPoint {
  x: number;
  y: number;
}

/**
 * Distribuye `capacity` sillas uniformemente alrededor de una mesa redonda.
 * Las coordenadas son relativas al centro (0,0) de la mesa.
 */
export function roundTableChairs(capacity: number, radius: number): ChairPoint[] {
  const r = radius + CHAIR_RADIUS + CHAIR_GAP;
  return Array.from({ length: capacity }, (_, i) => {
    const angle = (2 * Math.PI * i) / capacity - Math.PI / 2;
    return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
  });
}

/**
 * Distribuye `capacity` sillas en los lados largo superior e inferior
 * de una mesa rectangular. Coordenadas relativas al centro (0,0).
 */
export function rectTableChairs(w: number, h: number, capacity: number): ChairPoint[] {
  const top = Math.ceil(capacity / 2);
  const bottom = capacity - top;
  const chairs: ChairPoint[] = [];

  for (let i = 0; i < top; i++) {
    chairs.push({
      x: -w / 2 + (w / (top + 1)) * (i + 1),
      y: -h / 2 - CHAIR_GAP - CHAIR_RADIUS,
    });
  }
  for (let i = 0; i < bottom; i++) {
    chairs.push({
      x: -w / 2 + (w / (bottom + 1)) * (i + 1),
      y: h / 2 + CHAIR_GAP + CHAIR_RADIUS,
    });
  }
  return chairs;
}
