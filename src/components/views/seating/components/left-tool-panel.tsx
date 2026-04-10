"use client";

import { MousePointer2, Hand, MapPin, Ruler, Grid3x3, Trash2, Maximize2, Eye, Image as ImageIcon, X, Crosshair } from "lucide-react";

const btn = "flex items-center justify-center w-9 h-9 rounded-lg border transition-colors";
const off = `${btn} border-[var(--color-border)] bg-white text-[var(--color-text)]/50 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]`;
const on  = `${btn} border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]`;
const zon = `${btn} border-[#00CFFF] bg-[#00CFFF]/10 text-[#007fa3]`;
const del = `${btn} border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)]`;

interface Props {
  mode: "layout" | "seating";
  snapEnabled: boolean;
  zoningMode: boolean;
  hasZones: boolean;
  rulersEnabled: boolean;
  hasGuides: boolean;
  panMode: boolean;
  resizeMode: boolean;
  deleteMode: boolean;
  previewEnabled: boolean;
  bgImage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onBgUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearBg: () => void;
  onToggleSnap: () => void;
  onToggleZone: () => void;
  onClearZones: () => void;
  onToggleRulers: () => void;
  onClearGuides: () => void;
  onTogglePan: () => void;
  onToggleResize: () => void;
  onToggleDelete: () => void;
  onTogglePreview: () => void;
  onCenter: () => void;
}

export function LeftToolPanel({ mode, snapEnabled, zoningMode, hasZones, rulersEnabled, hasGuides, panMode, resizeMode, deleteMode, previewEnabled, bgImage, fileInputRef, onBgUpload, onClearBg, onToggleSnap, onToggleZone, onClearZones, onToggleRulers, onClearGuides, onTogglePan, onToggleResize, onToggleDelete, onTogglePreview, onCenter }: Props) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-1.5 border-r border-[var(--color-border)] bg-white flex-shrink-0" style={{ width: 52 }}>
      <button onClick={onTogglePan} className={panMode ? on : off} title="Navegar (arrastrar lienzo)"><Hand size={14} /></button>
      <button onClick={() => fileInputRef.current?.click()} className={off} title="Cargar imagen de fondo"><ImageIcon size={14} /></button>
      {bgImage && <button onClick={onClearBg} className={off} title="Quitar imagen de fondo"><X size={12} /></button>}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onBgUpload} />

      <div className="w-7 h-px bg-[var(--color-border)] my-0.5" />

      <button onClick={onToggleZone} className={zoningMode ? zon : off} title={zoningMode ? "Dibujando zona..." : "Zona de escala (4 puntos)"}><MapPin size={14} /></button>
      {hasZones && !zoningMode && <button onClick={onClearZones} className={off} title="Limpiar zonas"><X size={12} /></button>}
      <button onClick={onToggleSnap} className={snapEnabled ? on : off} title="Snap a cuadrícula (1m en zonas)"><Grid3x3 size={14} /></button>

      <div className="w-7 h-px bg-[var(--color-border)] my-0.5" />

      <button onClick={onToggleRulers} className={rulersEnabled ? on : off} title="Reglas graduadas"><Ruler size={14} /></button>
      {hasGuides && <button onClick={onClearGuides} className={off} title="Borrar guías"><X size={12} /></button>}

      <div className="w-7 h-px bg-[var(--color-border)] my-0.5" />

      {mode === "layout" && (
        <>
          <button onClick={onToggleResize} className={resizeMode ? on : off} title="Redimensionar objeto"><Maximize2 size={14} /></button>
          <button onClick={onToggleDelete} className={deleteMode ? del : off} title="Borrar objeto"><Trash2 size={14} /></button>
        </>
      )}

      <div className="w-7 h-px bg-[var(--color-border)] my-0.5" />

      <button onClick={onTogglePreview} className={previewEnabled ? on : off} title="Panel de inspección"><Eye size={14} /></button>
      <button onClick={onCenter} className={off} title="Centrar vista"><Crosshair size={14} /></button>
    </div>
  );
}
