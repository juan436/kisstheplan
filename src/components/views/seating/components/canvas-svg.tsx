"use client";

import type { SeatingPlan, Guest, DecorationObject } from "@/types";
import { WORLD_W, WORLD_H, GRID_SIZE, DECORATION_META } from "../constants/seating.constants";
import { SvgTable } from "./svg-table";

interface CalibPoint { x: number; y: number; }

interface CanvasSvgProps {
  plan: SeatingPlan;
  guests: Guest[];
  scale: number;
  mode: "layout" | "seating";
  bgImage: string | null;
  seatingTable: string | null;
  snapEnabled: boolean;
  decorations: DecorationObject[];
  calibPoints: CalibPoint[];
  onTableMouseDown: (e: React.MouseEvent, tableId: string) => void;
  onTableClick: (tableId: string) => void;
  onDeleteTable: (tableId: string) => void;
  onDecoMouseDown: (e: React.MouseEvent, id: string) => void;
  onSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export function CanvasSvg({ plan, guests, scale, mode, bgImage, seatingTable, snapEnabled, decorations, calibPoints, onTableMouseDown, onTableClick, onDeleteTable, onDecoMouseDown, onSvgClick }: CanvasSvgProps) {
  return (
    <svg width={WORLD_W} height={WORLD_H} onClick={onSvgClick} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id="grid-lines" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="rgba(196,180,160,0.25)" strokeWidth={1} />
        </pattern>
        {snapEnabled && (
          <pattern id="snap-dots" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <circle cx={0} cy={0} r={2} fill="rgba(140,111,95,0.35)" />
            <circle cx={GRID_SIZE} cy={0} r={2} fill="rgba(140,111,95,0.35)" />
            <circle cx={0} cy={GRID_SIZE} r={2} fill="rgba(140,111,95,0.35)" />
            <circle cx={GRID_SIZE} cy={GRID_SIZE} r={2} fill="rgba(140,111,95,0.35)" />
          </pattern>
        )}
      </defs>

      {bgImage
        ? <image href={bgImage} width={WORLD_W} height={WORLD_H} preserveAspectRatio="xMidYMid slice" />
        : <rect width={WORLD_W} height={WORLD_H} fill="#EDE4D9" />
      }
      <rect width={WORLD_W} height={WORLD_H} fill="url(#grid-lines)" />
      {snapEnabled && <rect width={WORLD_W} height={WORLD_H} fill="url(#snap-dots)" />}

      {decorations.map((deco) => {
        const m = DECORATION_META[deco.type];
        return (
          <g key={deco.id} id={`deco-g-${deco.id}`}
            transform={`translate(${deco.posX},${deco.posY})`}
            style={{ cursor: mode === "layout" ? "grab" : "default" }}
            onMouseDown={(e) => { e.stopPropagation(); onDecoMouseDown(e, deco.id); }}>
            <rect x={-m.w / 2} y={-m.h / 2} width={m.w} height={m.h} rx={6}
              fill="rgba(230,216,200,0.55)" stroke="rgba(196,180,160,0.6)" strokeWidth={1} />
            <text textAnchor="middle" dominantBaseline="central" fontSize={m.w > 60 ? 22 : 16}
              style={{ pointerEvents: "none", userSelect: "none" }}>{m.emoji}</text>
            <text textAnchor="middle" y={m.h / 2 + 13} fontSize={9} fill="var(--color-text)" opacity={0.5}
              style={{ pointerEvents: "none", userSelect: "none" }}>{deco.label ?? m.label}</text>
          </g>
        );
      })}

      {plan.tables.map((table) => (
        <SvgTable key={table.id} table={table} guests={guests} scale={scale} mode={mode}
          isSelected={seatingTable === table.id}
          onMouseDown={(e) => onTableMouseDown(e, table.id)}
          onClick={() => onTableClick(table.id)}
          onDelete={() => onDeleteTable(table.id)}
        />
      ))}

      {calibPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={6} fill="none" stroke="#c7a977" strokeWidth={2} />
          <circle cx={p.x} cy={p.y} r={2} fill="#c7a977" />
        </g>
      ))}
      {calibPoints.length === 2 && (
        <line x1={calibPoints[0].x} y1={calibPoints[0].y} x2={calibPoints[1].x} y2={calibPoints[1].y}
          stroke="#c7a977" strokeWidth={2} strokeDasharray="8 4" />
      )}
    </svg>
  );
}
