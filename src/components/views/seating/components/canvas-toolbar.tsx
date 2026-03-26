"use client";

import { Circle, Square, Image as ImageIcon, X } from "lucide-react";

interface CanvasToolbarProps {
  mode: "layout" | "seating";
  bgImage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAddTable: (shape: "round" | "rectangular") => void;
  onBgUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearBg: () => void;
}

export function CanvasToolbar({ mode, bgImage, fileInputRef, onAddTable, onBgUpload, onClearBg }: CanvasToolbarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={() => onAddTable("round")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)] transition-colors"
      >
        <Circle size={14} />
        Añadir mesa redonda
      </button>
      <button
        onClick={() => onAddTable("rectangular")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)] transition-colors"
      >
        <Square size={14} />
        Añadir mesa rectangular
      </button>

      <div className="w-px h-5 bg-[var(--color-border)]" />

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onBgUpload} />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)] transition-colors"
        title="Subir fotografía del espacio como fondo"
      >
        <ImageIcon size={14} />
        Cambiar plano de fondo
      </button>
      {bgImage && (
        <button
          onClick={onClearBg}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white text-xs text-[var(--color-text)]/50 hover:text-[var(--color-danger)] transition-colors"
          title="Quitar imagen de fondo"
        >
          <X size={12} />
          Quitar fondo
        </button>
      )}

      <span className="text-xs text-[var(--color-text)]/40 ml-auto">
        {mode === "layout" ? "Arrastra las mesas para reposicionarlas" : "Haz clic en una mesa para ver los asientos"}
      </span>
    </div>
  );
}
