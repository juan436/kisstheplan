import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import type { NoteType, Vendor } from "@/types";
import { TYPE_LABELS, TYPE_ICONS } from "./notes-constants";

interface CreateNoteModalProps {
  vendors: Vendor[];
  onClose: () => void;
  onCreate: (data: { type: NoteType; title: string; vendorId?: string }) => void;
}

export function CreateNoteModal({ vendors, onClose, onCreate }: CreateNoteModalProps) {
  const [type, setType] = useState<NoteType>("text");
  const [title, setTitle] = useState("");
  const [vendorId, setVendorId] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({ type, title: title.trim(), vendorId: vendorId || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-[var(--color-bg)] rounded-2xl p-6 w-full max-w-sm mx-4 z-10"
        style={{ boxShadow: "0 20px 60px rgba(74,60,50,0.18)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-xl text-[var(--color-text)]">Añadir nota</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Tipo de nota</label>
            <div className="space-y-2">
              {(["text", "pdf", "moodboard"] as NoteType[]).map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    type === t
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                  }`}>
                  {TYPE_ICONS[t]}
                  {TYPE_LABELS[t]}
                  {type === t && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              placeholder="Nombre de la nota..." autoFocus
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30" />
          </div>

          {vendors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">
                Asociar a proveedor <span className="font-normal opacity-50">(opcional)</span>
              </label>
              <select value={vendorId} onChange={(e) => setVendorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30">
                <option value="">Sin proveedor</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)]/60 hover:bg-[var(--color-bg-2)] transition-colors">
            Cancelar
          </button>
          <button onClick={handleCreate} disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: "#866857" }}>
            Crear nota
          </button>
        </div>
      </motion.div>
    </div>
  );
}
