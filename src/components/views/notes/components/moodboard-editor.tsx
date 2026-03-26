import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Download, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import type { Note } from "@/types";
import { PREDEFINED_CATEGORIES } from "../constants/notes.constants";
import { MoodboardCategorySection } from "./moodboard-category-section";

interface MoodboardEditorProps {
  note: Note;
  onClose: () => void;
  onAddColor: (hex: string, name?: string) => void;
  onRemoveColor: (colorId: string) => void;
  onAddCategory: (name: string) => void;
  onRemoveCategory: (categoryId: string) => void;
  onAddImage: (categoryId: string, url: string, caption?: string) => void;
  onRemoveImage: (categoryId: string, imageId: string) => void;
  onSaveTitle: (title: string) => void;
}

export function MoodboardEditor({
  note, onClose, onAddColor, onRemoveColor,
  onAddCategory, onRemoveCategory, onAddImage, onRemoveImage, onSaveTitle,
}: MoodboardEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [newColorHex, setNewColorHex] = useState("#c7a977");
  const [newColorName, setNewColorName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCatInput, setShowCatInput] = useState(false);

  return (
    <div className="flex flex-col overflow-y-auto" style={{ minHeight: 600 }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]"
        style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors"><X size={18} /></button>
        <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => onSaveTitle(title)}
          className="flex-1 bg-transparent font-playfair text-xl text-[var(--color-text)] focus:outline-none" placeholder="Título del moodboard..." />
        <button onClick={() => alert("Exportar a PDF — próximamente")}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#866857" }}>
          <Download size={14} /> Exportar PDF
        </button>
      </div>

      <div className="px-6 py-8 space-y-12">
        {/* Color palette */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-lg text-[var(--color-text)]">Paleta de colores</h3>
            <button onClick={() => setShowColorPicker((v) => !v)} className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline">
              <Plus size={14} /> Añadir color
            </button>
          </div>
          <AnimatePresence>
            {showColorPicker && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex items-end gap-3 mb-5 p-4 rounded-xl bg-[var(--color-bg-2)] border border-[var(--color-border)]">
                <div>
                  <label className="block text-xs text-[var(--color-text)]/50 mb-1">Color</label>
                  <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-10 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--color-text)]/50 mb-1">Nombre (opcional)</label>
                  <input type="text" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} placeholder="ej: Oro rosado"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30" />
                </div>
                <button onClick={() => { onAddColor(newColorHex, newColorName || undefined); setNewColorName(""); setShowColorPicker(false); }}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: "#866857" }}>Añadir</button>
              </motion.div>
            )}
          </AnimatePresence>
          {note.colorPalette.length === 0 ? (
            <p className="text-sm text-[var(--color-text)]/40 italic">Sin colores. Añade colores para tu paleta.</p>
          ) : (
            <div className="flex flex-wrap gap-5">
              {note.colorPalette.map((color) => (
                <div key={color.id} className="flex flex-col items-center gap-1.5 group">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: color.hexColor }} />
                    <button onClick={() => onRemoveColor(color.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <X size={9} />
                    </button>
                  </div>
                  <span className="text-xs text-[var(--color-text)]/50 font-mono">{color.hexColor}</span>
                  {color.name && <span className="text-xs text-[var(--color-text)]/60 text-center" style={{ maxWidth: 64 }}>{color.name}</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Inspiration categories */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-lg text-[var(--color-text)]">Inspiración</h3>
            <button onClick={() => setShowCatInput((v) => !v)} className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-medium hover:underline">
              <Plus size={14} /> Nueva categoría
            </button>
          </div>
          <AnimatePresence>
            {showCatInput && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-[var(--color-bg-2)] border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text)]/50 mb-3">Categorías predefinidas:</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {PREDEFINED_CATEGORIES.filter((p) => !note.categories.find((c) => c.name === p)).map((p) => (
                    <button key={p} onClick={() => { onAddCategory(p); setShowCatInput(false); }}
                      className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors bg-white">{p}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nombre personalizado..."
                    onKeyDown={(e) => { if (e.key === "Enter" && newCategoryName.trim()) { onAddCategory(newCategoryName.trim()); setNewCategoryName(""); setShowCatInput(false); } }}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30" />
                  <button onClick={() => { if (newCategoryName.trim()) { onAddCategory(newCategoryName.trim()); setNewCategoryName(""); setShowCatInput(false); } }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: "#866857" }}>Añadir</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-10">
            {note.categories.map((cat) => (
              <MoodboardCategorySection key={cat.id} category={cat}
                onUpload={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try { const url = await uploadImage(file); onAddImage(cat.id, url); }
                  catch (err) { console.error("Error al subir imagen:", err); alert("Error al subir la imagen. Por favor, intenta de nuevo."); }
                }}
                onRemoveImage={(imgId) => onRemoveImage(cat.id, imgId)}
                onRemoveCategory={() => onRemoveCategory(cat.id)}
              />
            ))}
            {note.categories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--color-border)" }}>
                <ImageIcon size={36} style={{ opacity: 0.2, color: "var(--color-text)" }} />
                <p className="mt-3 text-sm text-[var(--color-text)]/40">Añade categorías para organizar tu inspiración</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
