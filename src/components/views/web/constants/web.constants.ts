export const TEMPLATES = [
  { id: "elegante",    name: "Elegante",    desc: "Foto con arco, editorial" },
  { id: "inmersivo",   name: "Inmersivo",   desc: "Foto de fondo full-bleed" },
  { id: "minimalista", name: "Minimalista", desc: "Limpio y espacioso" },
  { id: "floral",      name: "Floral",      desc: "Orgánico y romántico" },
];

export const COLOR_PALETTES = [
  { name: "Olivo",     colors: { primary: "#5C6E4A", accent: "#8A9A6B", bg: "#F4F6F0", text: "#2E3A22" } },
  { name: "Mar",       colors: { primary: "#4A6B8A", accent: "#7799BB", bg: "#F0F4F8", text: "#1E2E40" } },
  { name: "Melocotón", colors: { primary: "#C8705A", accent: "#E09478", bg: "#FBF4F1", text: "#4A2418" } },
  { name: "Pastel",    colors: { primary: "#B8A4BA", accent: "#C49AB8", bg: "#FAF6FB", text: "#3C2840" } },
];

export const FONT_OPTIONS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Libre Baskerville",
  "Lora",
  "Bitter",
  "Alex Brush",
  "Great Vibes",
  "Allura",
  "Parisienne",
  "Dancing Script",
  "Pinyon Script",
  "Homemade Apple",
  "Moontime",
  "Inter",
  "Montserrat",
  "Arial",
  "Quicksand",
  "Open Sans",
  "Raleway",
];

// Fuentes de sistema (no necesitan importarse de Google Fonts)
const SYSTEM_FONTS = new Set(["Arial", "Times New Roman", "Garamond"]);

export function buildGoogleFontsUrl(fonts: string[]): string {
  const gFonts = [...new Set(fonts)].filter((f) => !SYSTEM_FONTS.has(f));
  if (!gFonts.length) return "";
  const families = gFonts
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,600;0,700;1,400`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export const ALL_FONTS_URL = buildGoogleFontsUrl(FONT_OPTIONS);

export const STEP_LABELS = ["Diseño", "RSVP", "Contenido"];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
