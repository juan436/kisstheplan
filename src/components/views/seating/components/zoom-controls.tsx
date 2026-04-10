"use client";

import { Crosshair } from "lucide-react";
import { MAX_ZOOM } from "../hooks/use-canvas-zoom";

interface ZoomControlsProps {
  zoom: number;
  fitZoom: number;
  onZoomChange: (z: number) => void;
  onCenter: () => void;
  scalePxPerM?: number;
}

export function ZoomControls({ zoom, fitZoom, onZoomChange, onCenter, scalePxPerM }: ZoomControlsProps) {
  const pct = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1" style={{ userSelect: "none" }}>

      {/* Centrar vista */}
      <button
        onClick={onCenter}
        title="Centrar y ajustar vista"
        className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center shadow-sm transition-colors text-[var(--color-text)]/50 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40"
      >
        <Crosshair size={13} />
      </button>

      {/* Slider vertical (rotamos un slider horizontal) */}
      <div className="flex items-center justify-center" style={{ height: 96 }}>
        <input
          type="range"
          min={fitZoom}
          max={MAX_ZOOM}
          step={0.02}
          value={zoom}
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          title={`Zoom: ${pct}%`}
          style={{
            width: 84,
            transform: "rotate(-90deg)",
            cursor: "pointer",
            accentColor: "var(--color-accent)",
          }}
        />
      </div>

      {/* Porcentaje */}
      <span
        className="text-center text-[10px] text-[var(--color-text)]/40 bg-white/90 rounded px-1 leading-tight tabular-nums"
        style={{ minWidth: 34 }}
      >
        {pct}%
      </span>

      {/* Escala física (opcional) */}
      {scalePxPerM !== undefined && (
        <span className="text-center text-[10px] text-[var(--color-text)]/30 bg-white/80 rounded px-1 leading-tight tabular-nums">
          {Math.round(scalePxPerM)}px/m
        </span>
      )}
    </div>
  );
}
