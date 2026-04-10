"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { EmojiObject } from "@/types";

interface Props {
  onConfirm: (obj: EmojiObject) => void;
  onClose: () => void;
}

export function EmojiCreatorModal({ onConfirm, onClose }: Props) {
  const [emoji, setEmoji] = useState("");
  const [label, setLabel] = useState("");
  const [width, setWidth] = useState("1.0");
  const [height, setHeight] = useState("1.0");

  const isValid = emoji.trim().length > 0 && label.trim().length > 0
    && parseFloat(width) > 0 && parseFloat(height) > 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm({
      id: `emoji-${Date.now()}`,
      emoji: emoji.trim(),
      label: label.trim(),
      physicalWidth: parseFloat(width),
      physicalHeight: parseFloat(height),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(74,60,50,0.18)] p-6 w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--color-text)] text-sm">Nuevo objeto personalizado</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--color-text)]/60">Emoji</label>
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4}
              placeholder="🌴" className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-2xl text-center w-full focus:outline-none focus:border-[var(--color-accent)]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--color-text)]/60">Nombre</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Palmera" className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-[var(--color-text)]/60">Ancho (m)</label>
              <input type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)}
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-[var(--color-text)]/60">Alto (m)</label>
              <input type="number" min="0.1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
          </div>
        </div>

        {emoji && (
          <div className="flex items-center justify-center py-2 text-3xl">
            {emoji}
          </div>
        )}

        <button onClick={handleConfirm} disabled={!isValid}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 disabled:opacity-40 disabled:cursor-not-allowed">
          Añadir al plano
        </button>
      </div>
    </div>
  );
}
