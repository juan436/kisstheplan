export const MEAL_PALETTE = [
  "#e85d5d", "#4a9eff", "#2ecc71", "#f39c12",
  "#9b59b6", "#1abc9c", "#e91e8b", "#ff6b35",
  "#3498db", "#e67e22", "#27ae60", "#c0392b",
];

export const ALLERGY_PALETTE = [
  "#9b59b6", "#1abc9c", "#e91e8b", "#ff6b35",
  "#3498db", "#e67e22", "#27ae60", "#c0392b",
  "#e85d5d", "#4a9eff", "#2ecc71", "#f39c12",
];

/** Picks the first palette color not already used in `existing`. Falls back to cycling if all are taken. */
export function pickNextColor(existing: Record<string, string>, palette = MEAL_PALETTE): string {
  const used = new Set(Object.values(existing));
  return palette.find((c) => !used.has(c)) ?? palette[Object.keys(existing).length % palette.length];
}

/** Fills a color map for `options`, auto-assigning palette colors for any missing entries. */
export function getItemColors(options: string[], stored: Record<string, string>, palette = MEAL_PALETTE): Record<string, string> {
  const result: Record<string, string> = { ...stored };
  options.forEach((item) => {
    if (!result[item]) {
      result[item] = pickNextColor(result, palette);
    }
  });
  // Keep only relevant options
  const filtered: Record<string, string> = {};
  options.forEach(opt => {
    if (result[opt]) filtered[opt] = result[opt];
  });
  return filtered;
}

/**
 * Normalizes a dish string so that "pescado, carne" and "carne, pescado"
 * produce the same canonical key → same color in legend and chairs.
 */
export function normalizeDish(dish: string): string {
  return dish.split(",").map((s) => s.trim()).filter(Boolean).sort().join(", ");
}

// Aliases for backwards compat
export const COLOR_PALETTE = MEAL_PALETTE;
export const getAllergyColors = (options: string[], stored: Record<string, string>) => getItemColors(options, stored, ALLERGY_PALETTE);
