"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import type { DecorationObject } from "@/types";
import { DECORATION_META } from "../../constants/seating.constants";

interface DecorationResizePanelProps {
  deco: DecorationObject;
  screenX: number;
  screenY: number;
  canvasH: number;
  onApply: (id: string, width: number, height: number) => void;
  onClose: () => void;
}

const PANEL_W = 176;
const PANEL_H = 158;

export function DecorationResizePanel({ deco, screenX, screenY, canvasH, onApply, onClose }: DecorationResizePanelProps) {
  const m = deco.type !== "custom_emoji" ? DECORATION_META[deco.type] : null;
  const defaultW = m?.physicalW ?? 1;
  const defaultH = m?.physicalH ?? 1;
  const [w, setW] = useState(deco.physicalWidth ?? defaultW);
  const [h, setH] = useState(deco.physicalHeight ?? defaultH);

  // Clamp so panel stays inside canvas
  const left = Math.min(screenX + 16, window.innerWidth - PANEL_W - 16);
  const top  = Math.max(4, Math.min(screenY - PANEL_H / 2, canvasH - PANEL_H - 4));

  const handleApply = () => {
    const pw = Math.max(0.5, Math.min(20, parseFloat(String(w)) || defaultW));
    const ph = Math.max(0.5, Math.min(20, parseFloat(String(h)) || defaultH));
    onApply(deco.id, pw, ph);
  };

  const displayEmoji = deco.customEmoji ?? m?.emoji ?? "?";
  const displayLabel = deco.label ?? m?.label ?? deco.type;

  return (
    <div
      style={{ position: "absolute", left, top, width: PANEL_W, zIndex: 30, pointerEvents: "all" }}
      className="bg-white border border-[var(--color-border)] rounded-xl shadow-lg p-3 flex flex-col gap-2.5"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text)] truncate">
          {displayEmoji} {displayLabel}
        </span>
        <button onClick={onClose} className="shrink-0 text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
          <X size={12} />
        </button>
      </div>

      {/* Inputs */}
      {(["Ancho", "Fondo"] as const).map((label, i) => {
        const val = i === 0 ? w : h;
        const setVal = i === 0 ? setW : setH;
        return (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--color-text)]/50 w-10 shrink-0">{label}</span>
            <input
              type="number"
              value={val}
              min={0.5}
              max={20}
              step={0.5}
              onChange={(e) => setVal(parseFloat(e.target.value))}
              className="w-16 text-xs border border-[var(--color-border)] rounded-lg px-2 py-1 text-center tabular-nums focus:outline-none focus:border-[var(--color-accent)]"
            />
            <span className="text-[10px] text-[var(--color-text)]/40">m</span>
          </div>
        );
      })}

      {/* Apply button */}
      <button
        onClick={handleApply}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <Check size={11} /> Aplicar
      </button>
    </div>
  );
}
