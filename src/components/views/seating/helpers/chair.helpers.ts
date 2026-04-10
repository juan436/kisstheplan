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
