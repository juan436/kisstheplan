export const WORLD_W = 1200;
export const WORLD_H = 800;
export const CANVAS_H = 560;

export const MAX_RECT_CAPACITY = 8; // 4 chairs per long side, no cabeceras
export const ZONE_GRID_COLOR   = "#00FFFF"; // pure cyan — maximum neon
export const ZONE_FILL_COLOR   = "rgba(0,255,255,0.04)";
export const ZONE_STROKE_COLOR = "rgba(0,220,255,0.50)";
export const ZONE_GRID_MAX_LINES = 150; // safety cap per zone

export const DEFAULT_SCALE = 60;       // px por metro
export const GRID_SIZE = 40;

// Dimensiones físicas de la silla en metros (estándar banquetero)
export const CHAIR_RADIUS_M = 0.22;   // radio del asiento (diámetro ~44 cm)
export const CHAIR_GAP_M    = 0.10;   // espacio mínimo de aire entre sillas

/** @deprecated Use CHAIR_RADIUS_M × scale instead */
export const CHAIR_RADIUS = 6;
/** @deprecated Use CHAIR_GAP_M × scale instead */
export const CHAIR_GAP = 8;

// Dimensiones físicas por defecto en metros
export const DEFAULT_ROUND_DIAMETER = 1.8;
export const DEFAULT_RECT_WIDTH = 2.4;
export const DEFAULT_RECT_HEIGHT = 0.9;

// Tamaños estándar del sector banquetero (fijos por capacidad)
export const ROUND_DIAMETER_STD  = 1.80; // ≤ 10 pax
export const ROUND_DIAMETER_LARGE = 2.00; // ≥ 11 pax
export const RECT_FIXED_WIDTH    = 2.50;
export const RECT_FIXED_HEIGHT   = 0.90;

export const DECORATION_META: Record<string, { label: string; emoji: string; w: number; h: number; physicalW: number; physicalH: number }> = {
  tree:       { label: "Árbol",          emoji: "🌳", w: 40,  h: 40,  physicalW: 1.5, physicalH: 1.5 },
  bar:        { label: "Barra de bar",   emoji: "🍹", w: 90,  h: 55,  physicalW: 3.0, physicalH: 1.5 },
  speaker:    { label: "Altavoz",        emoji: "🔊", w: 32,  h: 32,  physicalW: 0.5, physicalH: 0.5 },
  photobooth: { label: "Photobooth",     emoji: "📸", w: 75,  h: 65,  physicalW: 2.5, physicalH: 2.0 },
  dancefloor: { label: "Pista de baile", emoji: "💃", w: 130, h: 90,  physicalW: 5.0, physicalH: 5.0 },
  text:       { label: "Etiqueta",       emoji: "📝", w: 70,  h: 30,  physicalW: 2.0, physicalH: 0.5 },
};
