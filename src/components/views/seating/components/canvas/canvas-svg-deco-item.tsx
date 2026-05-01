"use client";

import { useState } from "react";
import type { DecorationObject, Guest, CalibZone } from "@/types";
import { DECORATION_META } from "../../constants/seating.constants";
import { getEffectiveScale } from "../../helpers/seating.helpers";
import { hasDecoIcon, DecoIconContent } from "../library/seating-decoration-icons";
import { normalizeDish } from "@/lib/allergy-colors";

function getShortName(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length === 1 ? parts[0].slice(0, 9) : `${parts[0]} ${parts[1][0]}.`;
}

interface DecoItemProps {
  deco: DecorationObject;
  zones: CalibZone[];
  scale: number;
  mode: "layout" | "seating";
  deleteMode: boolean;
  hideObjectLabels: boolean;
  selectedDecoId: string | null;
  guests: Guest[];
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  onDecoMouseDown: (e: React.MouseEvent, id: string) => void;
  onDecoClick: (id: string, clientX: number, clientY: number) => void;
}

export function CanvasSvgDecoItem({ deco, zones, scale, mode, deleteMode, hideObjectLabels, selectedDecoId, guests, allergyColors, mealColors, onDecoMouseDown, onDecoClick }: DecoItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const m = deco.type !== "custom_emoji" ? DECORATION_META[deco.type] : null;
  const pw = deco.physicalWidth ?? m?.physicalW ?? 1;
  const ph = deco.physicalHeight ?? m?.physicalH ?? 1;
  const decoScale = getEffectiveScale(deco.posX, deco.posY, zones, scale);
  const w = pw * decoScale, h = ph * decoScale;
  const isSelDeco = selectedDecoId === deco.id;
  const useIcon = hasDecoIcon(deco.objectType);
  const emoji = deco.customEmoji ?? m?.emoji ?? "?";
  const emojiSize = Math.max(10, Math.min(28, Math.min(w, h) * 0.45));
  const label = deco.label ?? m?.label ?? deco.type;
  const isChair = deco.objectType === "chair";
  const chairGuest = isChair && deco.guestId ? guests.find((g) => g.id === deco.guestId) : null;
  const guestAllergies = chairGuest?.allergies?.trim() ? chairGuest.allergies.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const firstAllergyColor = guestAllergies.length > 0 ? (allergyColors[guestAllergies[0]] ?? "#f59e0b") : null;
  const mealColor = chairGuest?.dish?.trim() ? (mealColors[normalizeDish(chairGuest.dish)] ?? null) : null;
  const dotR = Math.max(2, Math.min(w, h) * 0.15);
  const chairFill = isChair ? (chairGuest ? "rgba(140,111,95,0.22)" : "rgba(230,216,200,0.55)") : "rgba(230,216,200,0.55)";

  return (
    <g id={`deco-g-${deco.id}`} transform={`translate(${deco.posX},${deco.posY})`}
      style={{ cursor: deleteMode ? "crosshair" : (mode === "seating" && isChair ? "pointer" : mode === "layout" ? "grab" : "default") }}
      onMouseDown={(e) => { e.stopPropagation(); onDecoMouseDown(e, deco.id); }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { e.stopPropagation(); if (mode === "layout" || (mode === "seating" && isChair)) onDecoClick(deco.id, e.clientX, e.clientY); }}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6}
        fill={isSelDeco ? "rgba(140,111,95,0.18)" : chairFill}
        stroke={isSelDeco ? "var(--color-accent)" : (isChair && chairGuest ? "#8c6f5f" : "rgba(196,180,160,0.6)")}
        strokeWidth={isSelDeco ? 2 : (isChair && chairGuest ? 1.5 : 1)} />
      {useIcon ? (
        <g transform={`translate(${-w / 2},${-h / 2}) scale(${w / 32},${h / 32})`} style={{ pointerEvents: "none" }}>
          <DecoIconContent objectType={deco.objectType!} />
        </g>
      ) : (
        <text textAnchor="middle" dominantBaseline="central" fontSize={emojiSize} style={{ pointerEvents: "none", userSelect: "none" }}>{emoji}</text>
      )}
      {isChair && firstAllergyColor && <circle cx={w / 2 - dotR - 1} cy={-h / 2 + dotR + 1} r={dotR} fill={firstAllergyColor} stroke="white" strokeWidth={0.5} style={{ pointerEvents: "none" }} />}
      {isChair && mealColor && <circle cx={-w / 2 + dotR + 1} cy={-h / 2 + dotR + 1} r={dotR} fill={mealColor} stroke="white" strokeWidth={0.5} style={{ pointerEvents: "none" }} />}
      {!hideObjectLabels && isChair && chairGuest && (() => {
        const sn = getShortName(chairGuest.name), fs = 7, pH = 12;
        const pW = Math.max(28, sn.length * fs * 0.65 + 10), py = h / 2 + 4;
        return (
          <g style={{ pointerEvents: "none", userSelect: "none" }}>
            <rect x={-pW / 2} y={py} width={pW} height={pH} rx={pH / 2} fill="white" stroke="#C4B7A6" strokeWidth={0.5} style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.14))" }} />
            {firstAllergyColor && <circle cx={-pW / 2 + 6} cy={py + pH / 2} r={2.5} fill={firstAllergyColor} />}
            <text x={firstAllergyColor ? -pW / 2 + 13 : 0} textAnchor={firstAllergyColor ? "start" : "middle"} y={py + pH / 2} dominantBaseline="central" fontSize={fs} fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>{sn}</text>
          </g>
        );
      })()}
      {!hideObjectLabels && isChair && isHovered && (() => {
        const text = chairGuest?.name ?? label, fs = 8, pH = 14;
        const pW = Math.max(32, text.length * fs * 0.62 + 12), py = -(h / 2 + 5 + pH);
        return (
          <g style={{ pointerEvents: "none", userSelect: "none" }}>
            <rect x={-pW / 2} y={py} width={pW} height={pH} rx={pH / 2} fill="white" stroke="#C4B7A6" strokeWidth={0.5} style={{ filter: "drop-shadow(0 1px 4px rgba(74,60,50,0.16))" }} />
            {firstAllergyColor && <circle cx={-pW / 2 + 7} cy={py + pH / 2} r={3} fill={firstAllergyColor} />}
            <text x={firstAllergyColor ? -pW / 2 + 14 : 0} textAnchor={firstAllergyColor ? "start" : "middle"} y={py + pH / 2} dominantBaseline="central" fontSize={fs} fill="var(--color-text)" style={{ pointerEvents: "none", userSelect: "none" }}>{text}</text>
          </g>
        );
      })()}
      {!hideObjectLabels && !isChair && (() => {
        const fs = 8.5, pillW = Math.max(28, label.length * fs * 0.62 + 10), pillH = 14;
        return (
          <g style={{ pointerEvents: "none", userSelect: "none" }}>
            <rect x={-pillW / 2} y={h / 2 + 5} width={pillW} height={pillH} rx={pillH / 2} fill="white" opacity={0.92} style={{ filter: "drop-shadow(0 1px 2px rgba(74,60,50,0.18))" }} />
            <text textAnchor="middle" y={h / 2 + 5 + pillH / 2 + 0.5} dominantBaseline="central" fontSize={fs} fill="#4A3C32" fontWeight={500} style={{ pointerEvents: "none", userSelect: "none" }}>{label}</text>
          </g>
        );
      })()}
    </g>
  );
}
