"use client";

import type { SeatingPlan, Guest, CalibZone } from "@/types";
import { SvgTable } from "../tables/svg-table";
import { getEffectiveScale } from "../../helpers/seating.helpers";

interface CanvasSvgTablesProps {
  plan: SeatingPlan;
  guests: Guest[];
  scale: number;
  zones: CalibZone[];
  mode: "layout" | "seating";
  resizeMode: boolean;
  deleteMode: boolean;
  showLabels: boolean;
  showName: boolean;
  seatingTable: string | null;
  hoveredTableId?: string | null;
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  calibPoints: { x: number; y: number }[];
  onTableMouseDown: (e: React.MouseEvent, tableId: string) => void;
  onTableClick: (tableId: string) => void;
  onTableRotate: (tableId: string) => void;
  onTableHover: (tableId: string) => void;
  onTableHoverEnd: () => void;
}

export function CanvasSvgTables({ plan, guests, scale, zones, mode, resizeMode, deleteMode, showLabels, showName, seatingTable, hoveredTableId, allergyColors, mealColors, calibPoints, onTableMouseDown, onTableClick, onTableRotate, onTableHover, onTableHoverEnd }: CanvasSvgTablesProps) {
  const sortedTables = [...plan.tables].sort((a, b) => {
    const aTop = a.id === hoveredTableId || a.id === seatingTable ? 1 : 0;
    const bTop = b.id === hoveredTableId || b.id === seatingTable ? 1 : 0;
    return aTop - bTop;
  });
  return (
    <>
      {sortedTables.map((table) => (
        <SvgTable key={table.id} table={table} guests={guests}
          scale={getEffectiveScale(table.posX, table.posY, zones, scale)}
          mode={mode} resizeMode={resizeMode} deleteMode={deleteMode}
          showLabels={showLabels} showName={showName} isSelected={seatingTable === table.id}
          allergyColors={allergyColors} mealColors={mealColors}
          onMouseDown={(e) => onTableMouseDown(e, table.id)}
          onClick={() => onTableClick(table.id)}
          onRotate={() => onTableRotate(table.id)}
          onHover={() => onTableHover(table.id)}
          onHoverEnd={onTableHoverEnd}
        />
      ))}
      {calibPoints.length === 2 && (
        <line x1={calibPoints[0].x} y1={calibPoints[0].y} x2={calibPoints[1].x} y2={calibPoints[1].y}
          stroke="#c7a977" strokeWidth={2} strokeDasharray="8 4" opacity={0.4} />
      )}
    </>
  );
}
