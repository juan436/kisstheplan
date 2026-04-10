"use client";

import { useState } from "react";

interface ZoneCreationOverlayProps {
  pointCount: number;
  pendingPoints: { x: number; y: number }[] | null;
  onConfirm: (physW: number, physH: number) => void;
  onCancel: () => void;
}

export function ZoneCreationOverlay({ pointCount, pendingPoints, onConfirm, onCancel }: ZoneCreationOverlayProps) {
  const [physW, setPhysW] = useState("");
  const [physH, setPhysH] = useState("");

  const handleConfirm = () => {
    const w = parseFloat(physW);
    const h = parseFloat(physH);
    if (w > 0 && h > 0) onConfirm(w, h);
  };

  return (
    <div className="absolute inset-x-0 bottom-4 flex justify-center z-20 pointer-events-none">
      <div
        className="bg-white border border-[var(--color-border)] rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 pointer-events-auto"
        style={{ boxShadow: "0 12px 40px rgba(74,60,50,0.14)" }}>

        {!pendingPoints ? (
          <>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: "#00CFFF", minWidth: 28, textAlign: "center" }}>
              {pointCount}/4
            </span>
            <span className="text-sm text-[var(--color-text)]/70">
              {pointCount === 0 && "Haz clic en la esquina superior-izquierda de la zona"}
              {pointCount === 1 && "Haz clic en la esquina superior-derecha"}
              {pointCount === 2 && "Haz clic en la esquina inferior-derecha"}
              {pointCount === 3 && "Haz clic en la esquina inferior-izquierda para cerrar la zona"}
            </span>
            <button onClick={onCancel} className="text-sm text-[var(--color-text)]/40 hover:text-[var(--color-text)] ml-2">
              Cancelar
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-[var(--color-text)]/80">Medidas reales de esta zona:</span>
            <input
              type="number" min="0.1" step="0.1" placeholder="Ancho (m)" value={physW}
              onChange={(e) => setPhysW(e.target.value)}
              className="w-28 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[#00CFFF]/30"
              autoFocus />
            <span className="text-sm text-[var(--color-text)]/50">×</span>
            <input
              type="number" min="0.1" step="0.1" placeholder="Largo (m)" value={physH}
              onChange={(e) => setPhysH(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className="w-28 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[#00CFFF]/30" />
            <span className="text-sm text-[var(--color-text)]/50">m</span>
            <button onClick={handleConfirm}
              disabled={!physW || !physH}
              className="px-4 py-1.5 rounded-lg text-sm text-white font-medium disabled:opacity-40"
              style={{ backgroundColor: "#00CFFF" }}>
              Guardar zona
            </button>
            <button onClick={onCancel} className="text-sm text-[var(--color-text)]/40 hover:text-[var(--color-text)]">
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
