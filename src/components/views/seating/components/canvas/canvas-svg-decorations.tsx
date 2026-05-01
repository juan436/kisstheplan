"use client";

import type { DecorationObject, Guest, CalibZone } from "@/types";
import { CanvasSvgDecoItem } from "./canvas-svg-deco-item";

interface CanvasSvgDecorationsProps {
  decorations: DecorationObject[];
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

export function CanvasSvgDecorations({ decorations, ...rest }: CanvasSvgDecorationsProps) {
  return (
    <>
      {decorations.map((deco) => (
        <CanvasSvgDecoItem key={deco.id} deco={deco} {...rest} />
      ))}
    </>
  );
}
