export const WORLD_W = 1200;
export const WORLD_H = 800;
export const CANVAS_H = 560;

export const DEFAULT_SCALE = 60;       // px por metro
export const GRID_SIZE = 40;
export const CHAIR_RADIUS = 7;
export const CHAIR_GAP = 5;

// Dimensiones físicas por defecto en metros
export const DEFAULT_ROUND_DIAMETER = 1.8;
export const DEFAULT_RECT_WIDTH = 2.4;
export const DEFAULT_RECT_HEIGHT = 0.9;

export const DECORATION_META: Record<string, { label: string; emoji: string; w: number; h: number }> = {
  tree:       { label: "Árbol",          emoji: "🌳", w: 40,  h: 40  },
  bar:        { label: "Barra de bar",   emoji: "🍹", w: 90,  h: 55  },
  speaker:    { label: "Altavoz",        emoji: "🔊", w: 32,  h: 32  },
  photobooth: { label: "Photobooth",     emoji: "📸", w: 75,  h: 65  },
  dancefloor: { label: "Pista de baile", emoji: "💃", w: 130, h: 90  },
  text:       { label: "Etiqueta",       emoji: "📝", w: 70,  h: 30  },
};
