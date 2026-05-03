/**
 * NoteModal
 *
 * Qué hace: modal para crear una nueva nota; permite elegir tipo (texto/PDF/moodboard),
 *           escribir el título y opcionalmente asociarla a un proveedor.
 * Recibe:   vendors[], onClose, onCreate callback con { type, title, vendorId? }.
 * Provee:   export { NoteModal } — usado por NotesView.
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";
import type { NoteType, Vendor } from "@/types";
import { TYPE_LABELS, TYPE_ICONS } from "../../constants/notes.constants";

interface NoteModalProps {
  vendors: Vendor[];
  onClose: () => void;
  onCreate: (data: { type: NoteType; title: string; vendorId?: string }) => void;
}

export function NoteModal({ vendors, onClose, onCreate }: NoteModalProps) {
  const [type, setType] = useState<NoteType>("text");
  const [title, setTitle] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const vendorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target as Node)) {
        setVendorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div ref={vendorRef} className="relative">
              <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">
                Asociar a proveedor <span className="font-normal opacity-50">(opcional)</span>
              </label>
              <button type="button" onClick={() => setVendorOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30">
                <span className={vendorId ? "text-[var(--color-text)]" : "text-[var(--color-text)]/40"}>
                  {vendorId ? vendors.find((v) => v.id === vendorId)?.name : "Sin proveedor"}
                </span>
                <ChevronDown size={14} className={`text-[var(--color-text)]/40 transition-transform ${vendorOpen ? "rotate-180" : ""}`} />
              </button>
              {vendorOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden"
                  style={{ maxHeight: 180 }}>
                  <div className="overflow-y-auto" style={{ maxHeight: 180 }}>
                    {[{ id: "", name: "Sin proveedor" }, ...vendors].map((v) => (
                      <button key={v.id} type="button"
                        onClick={() => { setVendorId(v.id); setVendorOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--color-bg-2)] ${
                          vendorId === v.id ? "text-[var(--color-accent)] font-medium bg-[var(--color-accent)]/5" : "text-[var(--color-text)]"
                        } ${!v.id ? "text-[var(--color-text)]/50" : ""}`}>
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
