/**
 * MoodboardCategorySection
 *
 * Qué hace: sección de una categoría dentro del moodboard; muestra grid de imágenes con upload/delete.
 * Recibe:   category (MoodboardCategory), onAddImage, onDeleteImage, onRename, onDelete callbacks.
 * Provee:   export { MoodboardCategorySection } — usado por MoodboardEditor.
 */

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import type { MoodboardCategory } from "@/types";

interface MoodboardCategorySectionProps {
  category: MoodboardCategory;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (imageId: string) => void;
  onRemoveCategory: () => void;
}

export function MoodboardCategorySection({ category, onUpload, onRemoveImage, onRemoveCategory }: MoodboardCategorySectionProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputId = `moodboard-file-${category.id}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-playfair text-base text-[var(--color-text)]">{category.name}</h4>
        <div className="flex items-center gap-3">
          <label htmlFor={fileInputId} className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] font-medium hover:underline cursor-pointer">
            <Plus size={12} /> Añadir imagen
          </label>
          <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={onUpload} />
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onRemoveCategory} className="text-xs text-[var(--color-danger)] font-medium">Eliminar</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-[var(--color-text)]/40 ml-1">Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-[var(--color-text)]/30 hover:text-[var(--color-danger)] transition-colors">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {category.images.length === 0 ? (
        <label htmlFor={fileInputId}
          className="flex flex-col items-center justify-center w-full py-12 rounded-xl border-2 border-dashed border-[var(--color-border)] gap-2 hover:border-[var(--color-accent)]/40 transition-colors group cursor-pointer">
          <ImageIcon size={24} className="text-[var(--color-text)]/20 group-hover:text-[var(--color-accent)]/40 transition-colors" />
          <span className="text-sm text-[var(--color-text)]/40">Haz clic para añadir fotos de inspiración</span>
        </label>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {category.images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption || ""} className="w-full object-cover rounded-xl" style={{ display: "block" }} />
              {img.caption && <p className="text-xs text-[var(--color-text)]/60 mt-1 px-1 pb-1">{img.caption}</p>}
              <button onClick={() => onRemoveImage(img.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
            </div>
          ))}
          <label htmlFor={fileInputId}
            className="flex items-center justify-center w-full py-8 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors break-inside-avoid cursor-pointer">
            <Plus size={18} className="text-[var(--color-text)]/30" />
          </label>
        </div>
      )}
    </div>
  );
}
