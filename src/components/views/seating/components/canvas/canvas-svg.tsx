"use client";

import type { SeatingPlan, Guest, DecorationObject, CalibZone } from "@/types";
import type { Guide } from "../../hooks/use-canvas-guides";
import { WORLD_W, WORLD_H } from "../../constants/seating.constants";
import { CanvasSvgOverlays } from "./canvas-svg-overlays";
import { CanvasSvgTables } from "./canvas-svg-tables";
import { CanvasSvgDecorations } from "./canvas-svg-decorations";

interface CanvasSvgProps {
  plan: SeatingPlan;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  bgImage: string | null;
  seatingTable: string | null;
  snapEnabled: boolean;
  zones: CalibZone[];
  zonePoints: { x: number; y: number }[];
  guides: Guide[];
  zoningActive: boolean;
  resizeMode: boolean;
  showLabels: boolean;
  showName: boolean;
  decorations: DecorationObject[];
  selectedDecoId: string | null;
  calibPoints: { x: number; y: number }[];
  deleteMode: boolean;
  hideObjectLabels?: boolean;
  hoveredTableId?: string | null;
  allergyColors?: Record<string, string>;
  mealColors?: Record<string, string>;
  onTableMouseDown: (e: React.MouseEvent, tableId: string) => void;
  onTableClick: (tableId: string) => void;
  onTableRotate: (tableId: string) => void;
  onTableHover: (tableId: string) => void;
  onTableHoverEnd: () => void;
  onDecoMouseDown: (e: React.MouseEvent, id: string) => void;
  onDecoClick: (id: string, clientX: number, clientY: number) => void;
  onSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onGuideMouseDown: (e: React.MouseEvent, id: string) => void;
  onGuideDoubleClick: (id: string) => void;
}

export function CanvasSvg({
  plan, guests, scale, mode, bgImage, seatingTable, snapEnabled,
  zones, zonePoints, guides, zoningActive, resizeMode, showLabels, showName, deleteMode,
  hideObjectLabels = false, decorations, selectedDecoId, calibPoints,
  hoveredTableId, allergyColors = {}, mealColors = {},
  onTableMouseDown, onTableClick, onTableRotate, onTableHover, onTableHoverEnd,
  onDecoMouseDown, onDecoClick, onSvgClick, onGuideMouseDown, onGuideDoubleClick,
}: CanvasSvgProps) {
  return (
    <svg width={WORLD_W} height={WORLD_H} onClick={onSvgClick}
      style={{ display: "block", overflow: "visible", userSelect: "none" }}
      onDragStart={(e) => e.preventDefault()}>
      <defs>
        <filter id="neon-glow" x="-80%" y="-80%" width="260%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="glow-outer" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow-mid" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="glow-inner" />
          <feMerge>
            <feMergeNode in="glow-outer" /><feMergeNode in="glow-mid" />
            <feMergeNode in="glow-inner" /><feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {zones.map((z) => (
          <clipPath key={`clip-${z.id}`} id={`zone-clip-${z.id}`}>
            <polygon points={z.points.map((p) => `${p.x},${p.y}`).join(" ")} />
          </clipPath>
        ))}
      </defs>

      {bgImage
        ? <image href={bgImage} width={WORLD_W} height={WORLD_H} preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: "none", userSelect: "none" }} />
        : <rect width={WORLD_W} height={WORLD_H} fill="#EDE4D9" style={{ pointerEvents: "none" }} />
      }

      <CanvasSvgOverlays zones={zones} zonePoints={zonePoints} guides={guides}
        snapEnabled={snapEnabled} zoningActive={zoningActive}
        onGuideMouseDown={onGuideMouseDown} onGuideDoubleClick={onGuideDoubleClick} />

      <CanvasSvgDecorations decorations={decorations} zones={zones} scale={scale}
        mode={mode} deleteMode={deleteMode} hideObjectLabels={hideObjectLabels}
        selectedDecoId={selectedDecoId} guests={guests}
        allergyColors={allergyColors} mealColors={mealColors}
        onDecoMouseDown={onDecoMouseDown} onDecoClick={onDecoClick} />

      <CanvasSvgTables plan={plan} guests={guests} scale={scale} zones={zones}
        mode={mode} resizeMode={resizeMode} deleteMode={deleteMode}
        showLabels={showLabels} showName={showName} seatingTable={seatingTable}
        hoveredTableId={hoveredTableId} allergyColors={allergyColors} mealColors={mealColors}
        calibPoints={calibPoints}
        onTableMouseDown={onTableMouseDown} onTableClick={onTableClick}
        onTableRotate={onTableRotate} onTableHover={onTableHover} onTableHoverEnd={onTableHoverEnd} />
    </svg>
  );
}
