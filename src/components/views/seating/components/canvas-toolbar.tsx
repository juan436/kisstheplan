"use client";

import { Circle, Square, Image as ImageIcon, X, Grid3x3, Hand, MapPin, Trash2, Ruler, Maximize2, Eye } from "lucide-react";
import type { DecorationType } from "@/types";
import { DECORATION_META } from "../constants/seating.constants";

interface CanvasToolbarProps {
  mode: "layout" | "seating";
  bgImage: string | null;
  snapEnabled: boolean;
  zoningMode: boolean;
  hasZones: boolean;
  rulersEnabled: boolean;
  hasGuides: boolean;
  panMode: boolean;
  resizeMode: boolean;
  deleteMode: boolean;
  previewEnabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAddTable: (shape: "round" | "rectangular") => void;
  onAddDecoration: (type: DecorationType) => void;
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
}

const btnBase = "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors";
const btnOff  = `${btnBase} border-[var(--color-border)] bg-white text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]`;
const btnOn   = `${btnBase} border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]`;
const btnZone = `${btnBase} border-[#00CFFF] bg-[#00CFFF]/10 text-[#007fa3]`;
const btnDanger = `${btnBase} border-[var(--color-border)] bg-white text-[var(--color-text)]/40 hover:text-[var(--color-danger)] hover:border-[var(--color-danger)]/40`;

const btnDelete = `${btnBase} border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)]`;

export function CanvasToolbar({
  mode, bgImage, snapEnabled, zoningMode, hasZones, rulersEnabled, hasGuides, panMode, resizeMode, deleteMode, previewEnabled,
  fileInputRef, onAddTable, onAddDecoration, onBgUpload, onClearBg,
  onToggleSnap, onToggleZone, onClearZones, onToggleRulers, onClearGuides, onTogglePan, onToggleResize, onToggleDelete, onTogglePreview,
}: CanvasToolbarProps) {
  if (mode !== "layout") {
    return <p className="text-xs text-[var(--color-text)]/40 text-right">Haz clic en una mesa para ver los asientos</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Tables + controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onAddTable("round")} className={btnOff}>
          <Circle size={13} /> Mesa redonda
        </button>
        <button onClick={() => onAddTable("rectangular")} className={btnOff}>
          <Square size={13} /> Mesa rectangular
        </button>

        <div className="w-px h-5 bg-[var(--color-border)]" />

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onBgUpload} />
        <button onClick={() => fileInputRef.current?.click()} className={btnOff}>
          <ImageIcon size={13} /> Cambiar fondo
        </button>
        {bgImage && (
          <button onClick={onClearBg} className={btnOff}>
            <X size={12} /> Quitar fondo
          </button>
        )}

        <div className="w-px h-5 bg-[var(--color-border)]" />

        <button onClick={onTogglePan} className={panMode ? btnOn : btnOff} title="Navegar por el lienzo">
          <Hand size={13} /> Navegar
        </button>
        <button onClick={onToggleResize} className={resizeMode ? btnOn : btnOff}
          title="Modo redimensión: haz clic en una mesa u objeto para editar su tamaño físico real">
          <Maximize2 size={13} /> {resizeMode ? "Editando tamaño" : "Redimensionar"}
        </button>
        <button onClick={onToggleDelete} className={deleteMode ? btnDelete : btnOff}
          title="Modo borrar: haz clic en cualquier mesa u objeto para eliminarlo del plano">
          <Trash2 size={13} /> {deleteMode ? "Borrando..." : "Borrar objeto"}
        </button>
        <button onClick={onTogglePreview} className={previewEnabled ? btnOn : btnOff}
          title="Mostrar panel de inspección en la esquina superior derecha del lienzo">
          <Eye size={13} /> {previewEnabled ? "Inspeccionando" : "Inspeccionar"}
        </button>
        <button onClick={onToggleRulers} className={rulersEnabled ? btnOn : btnOff}
          title="Mostrar reglas graduadas. Arrastra desde la regla para crear líneas guía">
          <Ruler size={13} /> Reglas
        </button>
        {hasGuides && (
          <button onClick={onClearGuides} className={btnDanger} title="Eliminar todas las líneas guía">
            <X size={12} /> Borrar guías
          </button>
        )}
        <button onClick={onToggleSnap} className={snapEnabled ? btnOn : btnOff}
          title="Snap a cuadrícula (1m en zonas calibradas). Las guías siempre son magnéticas">
          <Grid3x3 size={13} /> Snap
        </button>

        <div className="w-px h-5 bg-[var(--color-border)]" />

        {/* Zone tool */}
        <button onClick={onToggleZone} className={zoningMode ? btnZone : btnOff}
          title="Dibujar zona de 4 puntos para calibrar escala local">
          <MapPin size={13} /> {zoningMode ? "Dibujando zona..." : "Zona de escala"}
        </button>
        {hasZones && !zoningMode && (
          <button onClick={onClearZones} className={btnDanger} title="Eliminar todas las zonas de calibración">
            <Trash2 size={12} /> Limpiar zonas
          </button>
        )}
      </div>

      {/* Decorations */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-wide text-[var(--color-text)]/40 mr-1">Objetos:</span>
        {(Object.keys(DECORATION_META) as DecorationType[]).map((type) => {
          const m = DECORATION_META[type];
          return (
            <button key={type} onClick={() => onAddDecoration(type)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-white text-xs text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)] transition-colors">
              <span>{m.emoji}</span> {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
