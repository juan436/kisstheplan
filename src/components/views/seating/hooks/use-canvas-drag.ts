"use client";

import { useState, useEffect, useRef } from "react";
import { GRID_SIZE } from "../constants/seating.constants";
import type { CalibZone } from "@/types";
import { pointInPolygon, getEffectiveScale } from "../helpers/seating.helpers";

export interface DragState {
  kind: "table" | "deco";
  id: string;
  startMouseX: number;
  startMouseY: number;
  startPosX: number;
  startPosY: number;
}

interface UseCanvasDragOptions {
  zoom: number;
  snapEnabled: boolean;
  zones: CalibZone[];
  fallbackScale: number;
  /** Applied always (guides snap independently of grid snap). */
  snapToGuides: (rawX: number, rawY: number, zoom: number) => { x: number; y: number };
  onUpdateTablePos: (id: string, x: number, y: number) => void;
  onUpdateDecoPos: (id: string, x: number, y: number) => void;
}

export function useCanvasDrag({
  zoom, snapEnabled, zones, fallbackScale, snapToGuides, onUpdateTablePos, onUpdateDecoPos,
}: UseCanvasDragOptions) {
  const [dragging, setDragging] = useState<DragState | null>(null);
  const snapRef          = useRef(snapEnabled);
  const zonesRef         = useRef(zones);
  const zoomRef          = useRef(zoom);
  const fallbackScaleRef = useRef(fallbackScale);
  const snapGuidesRef    = useRef(snapToGuides);
  useEffect(() => { snapRef.current          = snapEnabled;   }, [snapEnabled]);
  useEffect(() => { zonesRef.current         = zones;         }, [zones]);
  useEffect(() => { zoomRef.current          = zoom;          }, [zoom]);
  useEffect(() => { fallbackScaleRef.current = fallbackScale; }, [fallbackScale]);
  useEffect(() => { snapGuidesRef.current    = snapToGuides;  }, [snapToGuides]);

  useEffect(() => {
    if (!dragging) return;

    const resolveGridSnap = (rawX: number, rawY: number): { x: number; y: number } => {
      if (!snapRef.current) return { x: rawX, y: rawY };
      const zone = zonesRef.current.find((z) => pointInPolygon(rawX, rawY, z.points));
      const s = zone ? zone.localScale : GRID_SIZE;
      return { x: Math.round(rawX / s) * s, y: Math.round(rawY / s) * s };
    };

    const applyAll = (rawX: number, rawY: number, shiftKey: boolean): { x: number; y: number } => {
      let dx = rawX - dragging.startPosX;
      let dy = rawY - dragging.startPosY;
      if (shiftKey) {
        if (Math.abs(dx) >= Math.abs(dy)) dy = 0;
        else dx = 0;
      }
      const nx = Math.max(0, dragging.startPosX + dx);
      const ny = Math.max(0, dragging.startPosY + dy);
      const gridSnapped  = resolveGridSnap(nx, ny);
      const guideSnapped = snapGuidesRef.current(gridSnapped.x, gridSnapped.y, zoomRef.current);
      return guideSnapped;
    };

    /** Scale at the drag-start position — the table was rendered with this scale. */
    const originScale = getEffectiveScale(
      dragging.startPosX, dragging.startPosY,
      zonesRef.current, fallbackScaleRef.current,
    );

    const onMove = (e: MouseEvent) => {
      const rawX = dragging.startPosX + (e.clientX - dragging.startMouseX) / zoomRef.current;
      const rawY = dragging.startPosY + (e.clientY - dragging.startMouseY) / zoomRef.current;
      const { x, y } = applyAll(rawX, rawY, e.shiftKey);

      const domId = dragging.kind === "table" ? `table-g-${dragging.id}` : `deco-g-${dragging.id}`;
      const el    = document.getElementById(domId);
      if (!el) return;

      // Preserve table rotation stored in data-rotation attribute
      const rot    = Number((el as HTMLElement).dataset.rotation ?? "0");
      const rotStr = rot !== 0 ? ` rotate(${rot})` : "";

      // Dynamic scale: if the object crossed a zone boundary, rescale it in-flight
      // so Pixels = PhysicalMeters × LocalScale remains true at the new position.
      const currentScale = getEffectiveScale(x, y, zonesRef.current, fallbackScaleRef.current);
      const scaleRatio   = originScale > 0 ? currentScale / originScale : 1;

      el.setAttribute(
        "transform",
        scaleRatio !== 1
          ? `translate(${x},${y})${rotStr} scale(${scaleRatio})`
          : `translate(${x},${y})${rotStr}`,
      );
    };

    const onUp = (e: MouseEvent) => {
      const rawX = dragging.startPosX + (e.clientX - dragging.startMouseX) / zoomRef.current;
      const rawY = dragging.startPosY + (e.clientY - dragging.startMouseY) / zoomRef.current;
      const { x, y } = applyAll(rawX, rawY, e.shiftKey);
      if (dragging.kind === "table") onUpdateTablePos(dragging.id, x, y);
      else onUpdateDecoPos(dragging.id, x, y);
      setDragging(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [dragging, onUpdateTablePos, onUpdateDecoPos]);

  return { dragging, setDragging };
}
