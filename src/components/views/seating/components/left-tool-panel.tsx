"use client";

import { Hand, MapPin, Ruler, Grid3x3, Trash2, Maximize2, Eye, Image as ImageIcon, X, Target, Tag } from "lucide-react";

const btn = "flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-medium transition-colors w-full";
const off = `${btn} border-[var(--color-border)] bg-white text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]`;
const on  = `${btn} border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]`;
const zon = `${btn} border-[#00CFFF] bg-[#00CFFF]/10 text-[#007fa3]`;
const del = `${btn} border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)]`;
const SEP = <div className="w-full h-px bg-[#E5DFD7] my-1" />;

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
  showLegend: boolean;
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
  onToggleLegend: () => void;
  onCenter: () => void;
}

export function LeftToolPanel({ mode, snapEnabled, zoningMode, hasZones, rulersEnabled, hasGuides, panMode, resizeMode, deleteMode, previewEnabled, showLegend, bgImage, fileInputRef, onBgUpload, onClearBg, onToggleSnap, onToggleZone, onClearZones, onToggleRulers, onClearGuides, onTogglePan, onToggleResize, onToggleDelete, onTogglePreview, onToggleLegend, onCenter }: Props) {
  return (
    <div className="flex flex-col gap-1 p-2 border-r border-[var(--color-border)] bg-white flex-shrink-0" style={{ width: 160 }}>

      {/* Grupo: Opciones de Fondo */}
      <p className="text-[9px] uppercase tracking-wider text-[var(--color-text)]/30 px-0.5 mt-0.5">Fondo</p>
      <button onClick={() => fileInputRef.current?.click()} className={off}>
        <ImageIcon size={13} className="flex-shrink-0" /> Cambiar fondo
      </button>
      {bgImage && (
        <button onClick={onClearBg} className={off}>
          <X size={13} className="flex-shrink-0" /> Quitar fondo
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onBgUpload} />

      {SEP}

      {/* Grupo: Arquitectura y Precisión */}
      <p className="text-[9px] uppercase tracking-wider text-[var(--color-text)]/30 px-0.5">Precisión</p>
      <button onClick={onToggleZone} className={zoningMode ? zon : off}>
        <MapPin size={13} className="flex-shrink-0" />
        {zoningMode ? "Dibujando..." : "Dibujar Zona"}
      </button>
      <button onClick={onToggleSnap} className={snapEnabled ? on : off}>
        <Grid3x3 size={13} className="flex-shrink-0" /> Snap
      </button>
      <button onClick={onToggleRulers} className={rulersEnabled ? on : off}>
        <Ruler size={13} className="flex-shrink-0" /> Reglas
      </button>
      {hasZones && !zoningMode && (
        <button onClick={onClearZones} className={off}>
          <X size={13} className="flex-shrink-0" /> Limpiar zonas
        </button>
      )}
      {hasGuides && (
        <button onClick={onClearGuides} className={off}>
          <X size={13} className="flex-shrink-0" /> Borrar guías
        </button>
      )}

      {SEP}

      {/* Grupo: Modos de Interacción */}
      {mode === "layout" && (
        <>
          <p className="text-[9px] uppercase tracking-wider text-[var(--color-text)]/30 px-0.5">Interacción</p>
          <button onClick={onToggleResize} className={resizeMode ? on : off}>
            <Maximize2 size={13} className="flex-shrink-0" /> Editar
          </button>
          <button onClick={onToggleDelete} className={deleteMode ? del : off}>
            <Trash2 size={13} className="flex-shrink-0" /> Borrar objeto
          </button>
        </>
      )}

      {SEP}

      {/* Grupo: Cámara y Visión */}
      <p className="text-[9px] uppercase tracking-wider text-[var(--color-text)]/30 px-0.5">Cámara</p>
      <button onClick={onTogglePan} className={panMode ? on : off}>
        <Hand size={13} className="flex-shrink-0" /> Navegar
      </button>
      <button onClick={onTogglePreview} className={previewEnabled ? on : off}>
        <Eye size={13} className="flex-shrink-0" /> Inspeccionar
      </button>
      <button onClick={onToggleLegend} className={showLegend ? on : off}>
        <Tag size={13} className="flex-shrink-0" /> Leyenda dietas
      </button>
      <button onClick={onCenter} className={off}>
        <Target size={13} className="flex-shrink-0" /> Centrar
      </button>
    </div>
  );
}
