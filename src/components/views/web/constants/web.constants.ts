export const TEMPLATES = [
  { id: "classic", name: "Clásico", desc: "Elegante y atemporal" },
  { id: "modern", name: "Moderno", desc: "Minimalista y limpio" },
  { id: "romantic", name: "Romántico", desc: "Suave y delicado" },
  { id: "rustic", name: "Rústico", desc: "Natural y cálido" },
];

export const COLOR_PALETTES = [
  { name: "Arena", colors: { primary: "#C4B7A6", accent: "#c7a977", bg: "#FAF7F2", text: "#4A3C32" } },
  { name: "Oliva", colors: { primary: "#8B9A7B", accent: "#A4B494", bg: "#F5F7F2", text: "#3A4A32" } },
  { name: "Rosa", colors: { primary: "#C4A6B7", accent: "#D4A6C7", bg: "#FBF2F7", text: "#4A323C" } },
  { name: "Azul", colors: { primary: "#A6B7C4", accent: "#7799BB", bg: "#F2F5FA", text: "#32404A" } },
];

export const FONT_OPTIONS = [
  "Playfair Display", "Cormorant Garamond", "Libre Baskerville", "Lora",
];

export const STEP_LABELS = ["Diseño", "RSVP", "Contenido"];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
