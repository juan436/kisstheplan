import { FileText, Image as ImageIcon, File } from "lucide-react";
import type { NoteType } from "@/types";

export const TYPE_LABELS: Record<NoteType, string> = {
  text: "Texto (Word)",
  pdf: "Subir archivo (PDF)",
  moodboard: "Moodboard",
};

export const TYPE_ICONS: Record<NoteType, React.ReactNode> = {
  text: <FileText size={16} />,
  pdf: <File size={16} />,
  moodboard: <ImageIcon size={16} />,
};

export const NOTE_BG: Record<NoteType, string> = {
  text: "#f5f0ea",
  pdf: "#eef0f5",
  moodboard: "#f5eaf0",
};

export const PREDEFINED_CATEGORIES = [
  "Ceremonia", "Aperitivo", "Cena", "Fiesta",
  "Vestido", "Peluquería y maquillaje", "Papelería",
];

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}
