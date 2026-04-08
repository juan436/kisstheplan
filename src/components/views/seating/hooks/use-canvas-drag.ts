"use client";

import { useState, useEffect, useRef } from "react";
import { GRID_SIZE } from "../constants/seating.constants";

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
  onUpdateTablePos: (id: string, x: number, y: number) => void;
  onUpdateDecoPos: (id: string, x: number, y: number) => void;
}

export function useCanvasDrag({ zoom, snapEnabled, onUpdateTablePos, onUpdateDecoPos }: UseCanvasDragOptions) {
  const [dragging, setDragging] = useState<DragState | null>(null);
  const snapRef = useRef(snapEnabled);
  useEffect(() => { snapRef.current = snapEnabled; }, [snapEnabled]);

  useEffect(() => {
    if (!dragging) return;

    const snap = (v: number) =>
      snapRef.current ? Math.round(v / GRID_SIZE) * GRID_SIZE : v;

    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startMouseX) / zoom;
      const dy = (e.clientY - dragging.startMouseY) / zoom;
      const nx = snap(Math.max(0, dragging.startPosX + dx));
      const ny = snap(Math.max(0, dragging.startPosY + dy));
      const domId = dragging.kind === "table"
        ? `table-g-${dragging.id}`
        : `deco-g-${dragging.id}`;
      const el = document.getElementById(domId);
      if (el) el.setAttribute("transform", `translate(${nx},${ny})`);
    };

    const onUp = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startMouseX) / zoom;
      const dy = (e.clientY - dragging.startMouseY) / zoom;
      const nx = snap(Math.max(0, dragging.startPosX + dx));
      const ny = snap(Math.max(0, dragging.startPosY + dy));
      if (dragging.kind === "table") onUpdateTablePos(dragging.id, nx, ny);
      else onUpdateDecoPos(dragging.id, nx, ny);
      setDragging(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, zoom, onUpdateTablePos, onUpdateDecoPos]);

  return { dragging, setDragging };
}
