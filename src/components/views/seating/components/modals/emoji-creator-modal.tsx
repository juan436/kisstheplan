"use client";

import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import type { EmojiObject } from "@/types";
import { DecoIconPreview } from "../library/seating-decoration-icons";
import { GALLERY, type GalleryItem } from "./emoji-gallery-data";

interface Props { onConfirm: (obj: EmojiObject) => void; onClose: () => void; }

export function EmojiCreatorModal({ onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [label, setLabel] = useState("");
  const [width, setWidth] = useState("1.0");
  const [height, setHeight] = useState("1.0");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GALLERY;
    return GALLERY.map((cat) => ({
      ...cat,
      items: cat.items.filter((it) =>
        it.label.toLowerCase().includes(q) ||
        cat.label.toLowerCase().includes(q) ||
        (it.keywords ?? []).some((k) => k.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [query]);

  const handleSelect = (item: GalleryItem) => {
    setSelected(item);
    if (!label || label === selected?.label) setLabel(item.label);
    setWidth(String(item.w));
    setHeight(String(item.h));
  };

  const isValid = selected !== null && label.trim().length > 0
    && parseFloat(width) > 0 && parseFloat(height) > 0;

  const handleConfirm = () => {
    if (!isValid || !selected) return;
    onConfirm({ id: `obj-${Date.now()}`, objectType: selected.objectType, label: label.trim(), physicalWidth: parseFloat(width), physicalHeight: parseFloat(height) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(74,60,50,0.18)] flex flex-col gap-0 w-[500px] max-h-[88vh] overflow-hidden">

        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-[var(--color-text)] text-sm">Añadir objeto al plano</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors"><X size={16} /></button>
        </div>

        <div className="px-5 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            <Search size={12} className="text-[var(--color-text)]/35 flex-shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar objeto..."
              className="flex-1 bg-transparent text-[11px] text-[var(--color-text)] placeholder:text-[var(--color-text)]/30 outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          {filtered.length === 0 && <p className="text-xs text-[var(--color-text)]/35 text-center py-8">Sin resultados</p>}
          {filtered.map((cat) => (
            <div key={cat.id} className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text)]/40 mb-1.5">{cat.label}</p>
              <div className="grid grid-cols-6 gap-1">
                {cat.items.map((item) => (
                  <button key={item.objectType} type="button" title={item.label} onClick={() => handleSelect(item)}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition-all ${
                      selected?.objectType === item.objectType
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-2)]"
                    } text-[var(--color-accent)]`}>
                    <DecoIconPreview objectType={item.objectType} size={26} />
                    <span className="text-[9px] text-[var(--color-text)]/55 leading-tight text-center truncate w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-[var(--color-border)] flex flex-col gap-3">
          {selected && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text)]/60 bg-[var(--color-bg-2)] rounded-lg px-3 py-2">
              <DecoIconPreview objectType={selected.objectType} size={20} />
              <span>Seleccionado: <span className="font-medium text-[var(--color-text)]">{selected.label}</span></span>
            </div>
          )}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-[var(--color-text)]/60">Nombre</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nombre del objeto"
                className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label className="text-xs text-[var(--color-text)]/60">Ancho (m)</label>
              <input type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)}
                className="border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label className="text-xs text-[var(--color-text)]/60">Alto (m)</label>
              <input type="number" min="0.1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
                className="border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
          </div>
          <button onClick={handleConfirm} disabled={!isValid}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 disabled:opacity-40 disabled:cursor-not-allowed">
            {selected ? `Añadir "${label || selected.label}" al plano` : "Selecciona un objeto primero"}
          </button>
        </div>
      </div>
    </div>
  );
}
