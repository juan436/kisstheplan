"use client";

import { Circle, Square, Image as ImageIcon, X, Grid3x3, Ruler } from "lucide-react";
import type { DecorationType } from "@/types";
import { DECORATION_META } from "../constants/seating.constants";

interface CanvasToolbarProps {
  mode: "layout" | "seating";
  bgImage: string | null;
  snapEnabled: boolean;
  calibrating: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAddTable: (shape: "round" | "rectangular") => void;
  onAddDecoration: (type: DecorationType) => void;
  onBgUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearBg: () => void;
  onToggleSnap: () => void;
  onToggleCalibrate: () => void;
}

const btnBase = "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors";
const btnOff  = `${btnBase} border-[var(--color-border)] bg-white text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]`;
const btnOn   = `${btnBase} border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]`;

export function CanvasToolbar({ mode, bgImage, snapEnabled, calibrating, fileInputRef, onAddTable, onAddDecoration, onBgUpload, onClearBg, onToggleSnap, onToggleCalibrate }: CanvasToolbarProps) {
  if (mode !== "layout") {
    return <p className="text-xs text-[var(--color-text)]/40 text-right">Haz clic en una mesa para ver los asientos</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Mesas */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onAddTable("round")} className={btnOff}>
          <Circle size={13} /> Mesa redonda
        </button>
        <button onClick={() => onAddTable("rectangular")} className={btnOff}>
          <Square size={13} /> Mesa rectangular
        </button>

        <div className="w-px h-5 bg-[var(--color-border)]" />

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onBgUpload} />
        <button onClick={() => fileInputRef.current?.click()} className={btnOff} title="Subir plano del espacio como fondo">
          <ImageIcon size={13} /> Cambiar fondo
        </button>
        {bgImage && (
          <button onClick={onClearBg} className={btnOff}>
            <X size={12} /> Quitar fondo
          </button>
        )}

        <div className="w-px h-5 bg-[var(--color-border)]" />

        <button onClick={onToggleSnap} className={snapEnabled ? btnOn : btnOff} title="Alinear mesas a cuadrícula">
          <Grid3x3 size={13} /> Snap
        </button>
        <button onClick={onToggleCalibrate} className={calibrating ? btnOn : btnOff}
          title="Calibrar escala física: marca 2 puntos e introduce la distancia real">
          <Ruler size={13} /> Calibrar escala
        </button>
      </div>

      {/* Decoraciones */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-wide text-[var(--color-text)]/40 mr-1">Objetos:</span>
        {(Object.keys(DECORATION_META) as DecorationType[]).map((type) => {
          const m = DECORATION_META[type];
          return (
            <button key={type} onClick={() => onAddDecoration(type)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-white text-xs text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-colors"
              title={m.label}>
              <span>{m.emoji}</span> {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
