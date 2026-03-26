import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { Note, Vendor } from "@/types";
import { NOTE_BG, TYPE_ICONS, formatDate } from "../constants/notes.constants";

interface NoteCardProps {
  note: Note;
  vendors: Vendor[];
  onOpen: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, vendors, onOpen, onDelete }: NoteCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const vendor = vendors.find((v) => v.id === note.vendorId);
  const previewImage = note.type === "moodboard" ? note.categories.flatMap((c) => c.images)[0]?.url : null;

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-[var(--color-border)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      style={{ background: NOTE_BG[note.type], boxShadow: "0 2px 12px rgba(74,60,50,0.06)" }} onClick={onOpen}>
      {previewImage ? (
        <div className="h-36 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewImage} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center" style={{ background: NOTE_BG[note.type] }}>
          <span style={{ opacity: 0.15, color: "var(--color-text)" }}>{TYPE_ICONS[note.type]}</span>
        </div>
      )}
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
