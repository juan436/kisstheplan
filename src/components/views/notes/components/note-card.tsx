/**
 * NoteCard
 *
 * Qué hace: tarjeta de vista previa de una nota con icono grande por tipo, título, proveedor y botón eliminar.
 *           Los 3 tipos (texto/PDF/moodboard) muestran icono grande centrado en el área de preview.
 *           Moodboard con imágenes muestra la primera foto en lugar del icono.
 * Recibe:   note (Note), vendor opcional, onOpen, onDelete callbacks.
 * Provee:   export { NoteCard } — usado por NotesView.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, FileText, File, Image as ImageIcon } from "lucide-react";
import type { Note, Vendor } from "@/types";
import { NOTE_BG, TYPE_ICONS, formatDate } from "../constants/notes.constants";
import { getMediaUrl } from "@/lib/utils/media";

interface NoteCardProps {
  note: Note;
  vendors: Vendor[];
  onOpen: () => void;
  onDelete: () => void;
}

const PREVIEW_ICON: Record<string, { icon: React.ReactNode; color: string }> = {
  text:      { icon: <FileText size={40} />,  color: "#8c6f5f" },
  pdf:       { icon: <File size={40} />,      color: "#7b8fb5" },
  moodboard: { icon: <ImageIcon size={40} />, color: "#b57b8f" },
};

export function NoteCard({ note, vendors, onOpen, onDelete }: NoteCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const vendor = vendors.find((v) => v.id === note.vendorId);
  const { icon, color } = PREVIEW_ICON[note.type] ?? PREVIEW_ICON.text;

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-[var(--color-border)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      style={{ background: NOTE_BG[note.type], boxShadow: "0 2px 12px rgba(74,60,50,0.06)" }} onClick={onOpen}>

      <div className="h-28 flex items-center justify-center" style={{ background: NOTE_BG[note.type] }}>
        <span style={{ color, opacity: 0.45 }}>{icon}</span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-quicksand font-semibold text-sm text-[var(--color-text)] leading-tight line-clamp-2">{note.title}</h4>
          <span className="flex-shrink-0 text-[var(--color-text)]/25 mt-0.5">{TYPE_ICONS[note.type]}</span>
        </div>
        {vendor && <p className="text-xs text-[var(--color-accent)] mb-1 font-medium">{vendor.name}</p>}
        <p className="text-xs text-[var(--color-text)]/40">{formatDate(note.updatedAt)}</p>
        {note.type === "moodboard" && note.colorPalette.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {note.colorPalette.slice(0, 5).map((c) => (
              <div key={c.id} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hexColor }} />
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        {confirmDelete ? (
          <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-md border border-[var(--color-border)]">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-xs text-[var(--color-danger)] font-medium">Eliminar</button>
            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }} className="text-xs text-[var(--color-text)]/40 ml-1">×</button>
          </div>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm border border-[var(--color-border)] hover:bg-[var(--color-danger)]/10 transition-colors">
            <Trash2 size={11} className="text-[var(--color-text)]/50 hover:text-[var(--color-danger)]" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
