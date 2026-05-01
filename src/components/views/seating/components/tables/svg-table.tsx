"use client";

import { useState } from "react";
import type { TableSeat, Guest } from "@/types";
import { CHAIR_RADIUS_M } from "../../constants/seating.constants";
import { tableRadius, rectDims, getTableDiameter, getRectTableDims } from "../../helpers/seating.helpers";
import { roundTableChairs, rectTableChairs, serpentineTableChairs, computeRoundChairRadius, computeRectChairRadius, computeSerpentineChairRadius } from "../../helpers/chair.helpers";
import { SvgTableBody } from "./svg-table-body";
import { SvgTableLabels } from "./svg-table-labels";

interface SvgTableProps {
  table: TableSeat;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  resizeMode: boolean;
  deleteMode: boolean;
  isSelected: boolean;
  showLabels: boolean;
  showName: boolean;
  allergyColors?: Record<string, string>;
  mealColors?: Record<string, string>;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
  onRotate?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
}

export function SvgTable({ table, guests, scale, mode, resizeMode, deleteMode, isSelected, showLabels, showName, allergyColors = {}, mealColors = {}, onMouseDown, onClick, onRotate, onHover, onHoverEnd }: SvgTableProps) {
  const [hovered, setHovered] = useState(false);
  const isRound      = table.shape === "round";
  const isSerpentine = table.shape === "serpentine";

  const r  = tableRadius(table.physicalDiameter ?? getTableDiameter(table.capacity), scale);
  const rw = table.physicalWidth  ?? getRectTableDims().width;
  const rh = table.physicalHeight ?? getRectTableDims().height;
  const { w, h } = rectDims(rw, rh, scale);

  const rawChairR = CHAIR_RADIUS_M * scale;
  const chairR = isRound
    ? computeRoundChairRadius(table.capacity, r, rawChairR)
    : isSerpentine
      ? computeSerpentineChairRadius(table.capacity, r, rawChairR)
      : computeRectChairRadius(w, table.capacity, rawChairR);

  const chairs = isRound
    ? roundTableChairs(table.capacity, r, chairR)
    : isSerpentine
      ? serpentineTableChairs(table.capacity, r, chairR)
      : rectTableChairs(w, h, table.capacity, chairR);

  const rot = table.rotation ?? 0;

  const tableFill = deleteMode && hovered ? "rgba(196,122,122,0.12)" : isSelected ? "rgba(140,111,95,0.10)" : "#ffffff";
  const stroke    = deleteMode && hovered ? "var(--color-danger)" : isSelected ? "var(--color-accent)" : "#B4A494";
  const strokeW   = (deleteMode && hovered) || isSelected ? 1.5 : 1;

  return (
    <g id={`table-g-${table.id}`} data-rotation={rot}
      transform={`translate(${table.posX},${table.posY}) rotate(${rot})`}
      style={{ cursor: deleteMode ? "crosshair" : (mode === "layout" && !resizeMode ? "grab" : "pointer") }}
      onMouseDown={onMouseDown} onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); if (mode === "layout" && !deleteMode && !resizeMode) onRotate?.(); }}
      onMouseEnter={() => { setHovered(true); onHover?.(); }}
      onMouseLeave={() => { setHovered(false); onHoverEnd?.(); }}>
      <SvgTableBody table={table} guests={guests} chairs={chairs} chairR={chairR} r={r} w={w} h={h}
        tableFill={tableFill} stroke={stroke} strokeW={strokeW} allergyColors={allergyColors} mealColors={mealColors} />
      <SvgTableLabels table={table} guests={guests} chairs={chairs} chairR={chairR} r={r} w={w} h={h}
        rot={rot} showLabels={showLabels} showName={showName} hovered={hovered} isSelected={isSelected}
        allergyColors={allergyColors} mealColors={mealColors} />
    </g>
  );
}
