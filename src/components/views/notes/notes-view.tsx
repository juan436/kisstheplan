"use client";

/**
 * NotesView
 *
 * Qué hace: vista principal de notas; muestra grid de NoteCard, abre NoteModal para crear
 *           y navega al editor correspondiente según el tipo (texto/PDF/moodboard).
 * Recibe:   datos de useNotes (notas, vendors, handlers CRUD).
 * Provee:   export default NotesView — montado en /app/notas.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Loader2 } from "lucide-react";
import type { NoteType } from "@/types";
import { useNotes } from "./hooks/use-notes";
import { NoteCard } from "./components/note-card";
import { NoteModal } from "./components/modals/note-modal";
import { TextEditor } from "./components/editors/text-editor";
import { PdfViewer } from "./components/editors/pdf-viewer";
import { MoodboardEditor } from "./components/editors/moodboard-editor";
import { api } from "@/services";

export function NotesView() {
  const {
    notes, vendors, loading, filtered,
    showCreate, setShowCreate,
    openNote, setOpenNote,
    filterType, setFilterType,
    handleCreate, handleDelete, handleSaveContent, patchOpenNote,
  } = useNotes();

  if (openNote) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden" style={{ height: "calc(100vh - 160px)", minHeight: 600 }}>
        {openNote.type === "text" && (
          <TextEditor note={openNote} onSave={(c, t) => handleSaveContent(openNote.id, c, t)} onClose={() => setOpenNote(null)} />
        )}
        {openNote.type === "pdf" && (
          <PdfViewer note={openNote} onSave={(c, t) => handleSaveContent(openNote.id, c, t)} onClose={() => setOpenNote(null)} />
        )}
        {openNote.type === "moodboard" && (
          <MoodboardEditor note={openNote} onClose={() => setOpenNote(null)}
            onAddColor={async (hex, name) => patchOpenNote(await api.addNoteColor(openNote.id, { hexColor: hex, name }))}
            onRemoveColor={async (colorId) => patchOpenNote(await api.removeNoteColor(openNote.id, colorId))}
            onAddCategory={async (name) => patchOpenNote(await api.addNoteCategory(openNote.id, { name }))}
            onRemoveCategory={async (catId) => patchOpenNote(await api.removeNoteCategory(openNote.id, catId))}
            onAddImage={async (catId, url, caption) => patchOpenNote(await api.addNoteCategoryImage(openNote.id, catId, { url, caption }))}
            onRemoveImage={async (catId, imgId) => patchOpenNote(await api.removeNoteCategoryImage(openNote.id, catId, imgId))}
            onSaveTitle={(title) => handleSaveContent(openNote.id, openNote.content, title)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-playfair text-2xl text-[var(--color-text)]">Notas y Moodboards</h2>
          <p className="text-sm text-[var(--color-text)]/50 mt-0.5">{notes.length} nota{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors"
          style={{ backgroundColor: "#866857" }}>
          <Plus size={16} /> Añadir nota
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {([["all", "Todas"], ["text", "Texto"], ["pdf", "PDF"], ["moodboard", "Moodboard"]] as [NoteType | "all", string][]).map(([t, label]) => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              filterType === t
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/30"
            }`}>
            {label}
            {t !== "all" && <span className="ml-1.5 text-xs opacity-60">({notes.filter((n) => n.type === t).length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[var(--color-text)]/30" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-fill)" }}>
            <FileText size={28} className="text-[var(--color-text)]/30" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[var(--color-text)]/60 mb-1">Sin notas aún</p>
            <p className="text-sm text-[var(--color-text)]/40">Crea tu primera nota, PDF o moodboard</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: "#866857" }}>
            Crear nota
          </button>
        </div>
      ) : (
        <motion.div layout className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          <AnimatePresence>
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} vendors={vendors}
                onOpen={() => setOpenNote(note)} onDelete={() => handleDelete(note.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showCreate && (
          <NoteModal vendors={vendors} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </div>
  );
}
