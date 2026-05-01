"use client";

import { useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";
import type { SeatingPlan, Guest } from "@/types";
import { DietLegend } from "../legends/diet-legend";
import { TableLegend } from "../tables/table-legend";

interface CanvasTabLegendsProps {
  showLegend: boolean;
  showTableLegend: boolean;
  legendPos: { x: number; y: number };
  setLegendPos: (pos: { x: number; y: number }) => void;
  setShowTableLegend: React.Dispatch<React.SetStateAction<boolean>>;
  plan: SeatingPlan;
  guests: Guest[];
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  centerOnTable: (tableId: string) => void;
}

export function CanvasTabLegends({ showLegend, showTableLegend, legendPos, setLegendPos, setShowTableLegend, plan, guests, allergyColors, mealColors, centerOnTable }: CanvasTabLegendsProps) {
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: legendPos.x, originY: legendPos.y };
    const onMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      setLegendPos({
        x: Math.max(0, dragRef.current.originX + me.clientX - dragRef.current.startX),
        y: Math.max(0, dragRef.current.originY + me.clientY - dragRef.current.startY),
      });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [legendPos, setLegendPos]);

  return (
    <>
      {showLegend && (
        <div style={{ position: "absolute", top: legendPos.y, left: legendPos.x, zIndex: 10, pointerEvents: "auto" }}
          onMouseDown={(e) => e.stopPropagation()}>
          <div onMouseDown={handleDragStart} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 18, cursor: "grab", background: "rgba(255,252,249,0.97)", borderRadius: "10px 10px 0 0", border: "1px solid var(--color-border)", borderBottom: "none", color: "var(--color-text)", opacity: 0.35 }}>
            <GripVertical size={12} />
          </div>
          <DietLegend plan={plan} guests={guests} allergyColors={allergyColors} mealColors={mealColors} />
        </div>
      )}
      {showTableLegend && (
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10, pointerEvents: "auto" }}
          onMouseDown={(e) => e.stopPropagation()}>
          <TableLegend plan={plan} guests={guests} onCenterTable={centerOnTable} onClose={() => setShowTableLegend(false)} />
        </div>
      )}
    </>
  );
}
