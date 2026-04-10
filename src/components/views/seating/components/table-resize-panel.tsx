"use client";

import { useState } from "react";
import { X, Check, RotateCw } from "lucide-react";
import type { TableSeat } from "@/types";
import { getTableDiameter, getRectTableDims } from "../helpers/seating.helpers";

interface TableResizePanelProps {
  table: TableSeat;
  screenX: number;
  screenY: number;
  canvasH: number;
  onApply: (tableId: string, physicalDiameter?: number, physicalWidth?: number, physicalHeight?: number) => void;
  onRotate: (tableId: string) => void;
  onClose: () => void;
}

const PANEL_W = 184;
const PANEL_H_ROUND = 148;
const PANEL_H_RECT  = 178;

export function TableResizePanel({ table, screenX, screenY, canvasH, onApply, onRotate, onClose }: TableResizePanelProps) {
  const isRound  = table.shape === "round";
  const defaultD = table.physicalDiameter ?? getTableDiameter(table.capacity);
  const defaultW = table.physicalWidth    ?? getRectTableDims().width;
  const defaultH = table.physicalHeight   ?? getRectTableDims().height;

  const [diameter, setDiameter] = useState(defaultD);
  const [width,    setWidth]    = useState(defaultW);
  const [height,   setHeight]   = useState(defaultH);

  const panelH = isRound ? PANEL_H_ROUND : PANEL_H_RECT;
  const left   = Math.min(screenX + 16, window.innerWidth - PANEL_W - 16);
  const top    = Math.max(4, Math.min(screenY - panelH / 2, canvasH - panelH - 4));

  const handleApply = () => {
    if (isRound) {
      const d = Math.max(0.5, Math.min(6, parseFloat(String(diameter)) || defaultD));
      onApply(table.id, d, undefined, undefined);
    } else {
      const w = Math.max(0.5, Math.min(12, parseFloat(String(width))  || defaultW));
      const h = Math.max(0.3, Math.min(6,  parseFloat(String(height)) || defaultH));
      onApply(table.id, undefined, w, h);
    }
  };

  const inputCls = "w-16 text-xs border border-[var(--color-border)] rounded-lg px-2 py-1 text-center tabular-nums focus:outline-none focus:border-[var(--color-accent)]";
  const labelCls = "text-[10px] text-[var(--color-text)]/50 shrink-0";
  const unitCls  = "text-[10px] text-[var(--color-text)]/40";

  return (
    <div
      style={{ position: "absolute", left, top, width: PANEL_W, zIndex: 30, pointerEvents: "all" }}
      className="bg-white border border-[var(--color-border)] rounded-xl shadow-lg p-3 flex flex-col gap-2.5"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text)] truncate">
          {table.name} · tamaño físico
        </span>
        <button onClick={onClose} className="shrink-0 text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
          <X size={12} />
        </button>
      </div>

      {isRound ? (
        <div className="flex items-center gap-2">
          <span className={`${labelCls} w-16`}>Diámetro</span>
          <input type="number" value={diameter} min={0.5} max={6} step={0.1}
            onChange={(e) => setDiameter(parseFloat(e.target.value))} className={inputCls} />
          <span className={unitCls}>m</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className={`${labelCls} w-10`}>Largo</span>
            <input type="number" value={width} min={0.5} max={12} step={0.1}
              onChange={(e) => setWidth(parseFloat(e.target.value))} className={inputCls} />
            <span className={unitCls}>m</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${labelCls} w-10`}>Ancho</span>
            <input type="number" value={height} min={0.3} max={6} step={0.1}
              onChange={(e) => setHeight(parseFloat(e.target.value))} className={inputCls} />
            <span className={unitCls}>m</span>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button onClick={() => onRotate(table.id)}
          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[var(--color-border)] text-[11px] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors flex-1"
          title="Girar 90° en sentido horario">
          <RotateCw size={11} /> Rotar 90°
        </button>
        <button onClick={handleApply}
          className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-white text-[11px] font-medium transition-opacity hover:opacity-90 flex-1"
          style={{ backgroundColor: "var(--color-accent)" }}>
          <Check size={11} /> Aplicar
        </button>
      </div>
    </div>
  );
}
