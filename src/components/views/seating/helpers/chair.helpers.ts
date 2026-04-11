export interface ChairPoint {
  x: number;
  y: number;
}

/**
 * Distribuye `capacity` sillas uniformemente alrededor de una mesa redonda.
 * `chairR` es el radio del asiento en píxeles (ya escalado).
 * El radio orbital se garantiza para que las sillas nunca se toquen.
 */
export function roundTableChairs(
  capacity: number,
  tableRadius: number,
  chairR: number,
): ChairPoint[] {
  if (capacity <= 0) return [];
  const minAir = chairR * 0.4;                  // 40 % del radio como "aire" mínimo
  const orbitR = tableRadius + chairR + minAir;

  // Ángulo que ocupa cada silla en el orbit + su espacio de aire
  const arcPerChair = (2 * Math.PI) / capacity;
  const chordNeeded = 2 * chairR + minAir * 2;  // cuerda mínima entre centros
  const minOrbit    = chordNeeded / (2 * Math.sin(arcPerChair / 2));
  const finalOrbit  = Math.max(orbitR, minOrbit);

  return Array.from({ length: capacity }, (_, i) => {
    const angle = (2 * Math.PI * i) / capacity - Math.PI / 2;
    return { x: finalOrbit * Math.cos(angle), y: finalOrbit * Math.sin(angle) };
  });
}

/**
 * Distribuye `capacity` sillas en los lados largos (superior e inferior)
 * de una mesa rectangular. `chairR` ya está en píxeles escalados.
 */
export function rectTableChairs(
  w: number,
  h: number,
  capacity: number,
  chairR: number,
): ChairPoint[] {
  if (capacity <= 0) return [];
  const top    = Math.ceil(capacity / 2);
  const bottom = capacity - top;
  const minAir = chairR * 0.4;
  const gap    = chairR + minAir;   // distance from table edge to chair center
  const chairs: ChairPoint[] = [];

  const placeRow = (count: number, ySign: number) => {
    const slotW = w / (count + 1);
    // clamp so chair fits within slot with air on both sides
    const safeR = Math.min(chairR, slotW / 2 - minAir);
    for (let i = 0; i < count; i++) {
      chairs.push({
        x: -w / 2 + slotW * (i + 1),
        y: ySign * (h / 2 + gap),
      });
    }
    return safeR;   // returned so caller can override render radius if needed
  };

  placeRow(top, -1);
  placeRow(bottom, 1);
  return chairs;
}

/**
 * Calcula el radio del asiento en píxeles que garantiza que todas las
 * sillas de una mesa redonda tengan aire suficiente entre sí.
 */
export function computeRoundChairRadius(
  capacity: number,
  tableRadius: number,
  rawChairR: number,
): number {
  if (capacity <= 1) return rawChairR;
  const arcPerChair = (2 * Math.PI) / capacity;
  // Maximum radius so two adjacent chairs don't touch at their closest orbit
  const orbitR = tableRadius + rawChairR + rawChairR * 0.4;
  const halfChord = orbitR * Math.sin(arcPerChair / 2);
  const maxR = halfChord * 0.82;  // leave ~18 % as air
  return Math.min(rawChairR, Math.max(maxR, 3));
}

// ── Helpers for S-curve (Bezier) geometry ─────────────────────────────────────

function bzPt(t: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): [number, number] {
  const m = 1 - t;
  return [m*m*m*ax + 3*m*m*t*bx + 3*m*t*t*cx + t*t*t*dx, m*m*m*ay + 3*m*m*t*by + 3*m*t*t*cy + t*t*t*dy];
}

function bzTan(t: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): [number, number] {
  const m = 1 - t;
  return [3*(m*m*(bx-ax)+2*m*t*(cx-bx)+t*t*(dx-cx)), 3*(m*m*(by-ay)+2*m*t*(cy-by)+t*t*(dy-cy))];
}

/**
 * Distribuye `capacity` sillas a lo largo de la curva en S HORIZONTAL:
 * La espina va de (-r,0) → C(-r,-r)(0,-r) → (0,0) → C(0,r)(r,r) → (r,0).
 * La mitad izquierda tiene sus sillas ARRIBA (normal = -Y),
 * la mitad derecha las tiene ABAJO (normal = +Y).
 */
export function serpentineTableChairs(
  capacity: number,
  r: number,
  chairR: number,
): ChairPoint[] {
  if (capacity <= 0) return [];
  const tableHalfDepth = r * 0.25;
  const orbitDist = tableHalfDepth + chairR + chairR * 0.4;
  const leftCount = Math.ceil(capacity / 2);
  const rightCount = capacity - leftCount;
  const chairs: ChairPoint[] = [];

  // Left bezier: (-r,0)→(-r,-r)→(0,-r)→(0,0)  — outer = TOP (normal = UP = -Y)
  // Right-perpendicular of tangent (ty,-tx): at t=0 tangent≈(0,-3r) → perp=(-3r,0) WRONG.
  // Use LEFT-perp (-ty,tx): at t=0 tangent=(0,-1) → left-perp=(1,0) → LEFT. Wrong.
  // Use top-normal (CCW of tangent = (-ty,tx)) but check sign per curve:
  // At t=0.5: point≈(-r/2,-r/2), tangent≈(3r/2,0) → CW perp=(0,-3r/2) → UP ✓
  // So RIGHT-perp (CW: ty,-tx) points UP for the left bezier.
  for (let i = 0; i < leftCount; i++) {
    const t = (i + 0.5) / leftCount;
    const [px, py] = bzPt(t, -r,0, -r,-r, 0,-r, 0,0);
    const [tx, ty] = bzTan(t, -r,0, -r,-r, 0,-r, 0,0);
    const len = Math.hypot(tx, ty) || 1;
    // CW perp: (ty/len, -tx/len) → points UP for this curve
    chairs.push({ x: px + (ty/len)*orbitDist, y: py + (-tx/len)*orbitDist });
  }

  // Right bezier: (0,0)→(0,r)→(r,r)→(r,0) — outer = BOTTOM (normal = DOWN = +Y)
  // At t=0.5: tangent≈(3r/2,0) → CW perp=(0,-3r/2) → UP. But we want DOWN!
  // Use CCW perp (-ty,tx): points DOWN ✓
  for (let i = 0; i < rightCount; i++) {
    const t = (i + 0.5) / rightCount;
    const [px, py] = bzPt(t, 0,0, 0,r, r,r, r,0);
    const [tx, ty] = bzTan(t, 0,0, 0,r, r,r, r,0);
    const len = Math.hypot(tx, ty) || 1;
    // CCW perp: (-ty/len, tx/len) → points DOWN for this curve
    chairs.push({ x: px + (-ty/len)*orbitDist, y: py + (tx/len)*orbitDist });
  }

  return chairs;
}

/**
 * Calcula el radio del asiento para mesas serpentinas (S-shape).
 * Cada arco es aproximadamente un cuarto de círculo de radio r.
 */
export function computeSerpentineChairRadius(
  capacity: number,
  tableR: number,
  rawChairR: number,
): number {
  if (capacity <= 1) return rawChairR;
  const perArc = Math.ceil(capacity / 2);
  const orbitR = tableR * 1.3 + rawChairR * 1.4;
  const arcPerChair = (Math.PI / 2) / perArc;
  const halfChord = orbitR * Math.sin(arcPerChair / 2);
  const maxR = halfChord * 0.82;
  return Math.min(rawChairR, Math.max(maxR, 3));
}

/**
 * Calcula el radio del asiento para mesas rectangulares (limitado por el hueco).
 */
export function computeRectChairRadius(
  w: number,
  capacity: number,
  rawChairR: number,
): number {
  const count = Math.ceil(capacity / 2);  // chairs per long side
  const slotW = w / (count + 1);
  const maxR  = slotW / 2 * 0.78;        // leave 22 % as air per slot
  return Math.min(rawChairR, Math.max(maxR, 3));
}
