"use client";

import { useState } from "react";

interface CalibPoint { x: number; y: number; }

interface CalibrationOverlayProps {
  points: CalibPoint[];
  onConfirm: (meters: number) => void;
  onCancel: () => void;
}

export function CalibrationOverlay({ points, onConfirm, onCancel }: CalibrationOverlayProps) {
  const [meters, setMeters] = useState("");

  const px = points.length === 2
    ? Math.round(Math.sqrt((points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2))
    : 0;

  const handleConfirm = () => {
    const v = parseFloat(meters);
    if (v > 0) onConfirm(v);
  };

  return (
    <div className="absolute inset-x-0 bottom-4 flex justify-center z-20 pointer-events-none">
      <div className="bg-white border border-[var(--color-border)] rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 pointer-events-auto"
        style={{ boxShadow: "0 12px 40px rgba(74,60,50,0.14)" }}>
        {points.length < 2 ? (
          <>
            <span className="text-sm text-[var(--color-text)]/70">
              {points.length === 0 ? "Haz clic en el primer punto de referencia" : "Ahora haz clic en el segundo punto"}
            </span>
            <button onClick={onCancel} className="text-sm text-[var(--color-text)]/50 hover:text-[var(--color-text)] ml-2">Cancelar</button>
          </>
        ) : (
          <>
            <span className="text-sm text-[var(--color-text)]/60 tabular-nums">{px} px =</span>
            <input
              type="number" step="0.1" min="0.1" placeholder="metros reales" value={meters}
              onChange={(e) => setMeters(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className="w-36 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
              autoFocus
            />
            <span className="text-sm text-[var(--color-text)]/60">m</span>
            <button onClick={handleConfirm}
              className="px-4 py-1.5 rounded-lg text-sm text-white font-medium"
              style={{ backgroundColor: "#866857" }}>
              Guardar escala
            </button>
            <button onClick={onCancel} className="text-sm text-[var(--color-text)]/50 hover:text-[var(--color-text)]">Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
}
