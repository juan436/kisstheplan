"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface Guide {
  id: string;
  type: "horizontal" | "vertical";
  position: number; // world coordinate
}

const GUIDE_SNAP_SCREEN_PX = 10;

export function useCanvasGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const guidesRef  = useRef(guides);
  const toWorldRef = useRef<((cx: number, cy: number) => { x: number; y: number }) | null>(null);
  useEffect(() => { guidesRef.current = guides; }, [guides]);

  const addGuide = useCallback((type: Guide["type"], position: number): string => {
    const id = `g-${Date.now()}`;
    setGuides((prev) => [...prev, { id, type, position }]);
    return id;
  }, []);

  const removeGuide = useCallback((id: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const clearGuides = useCallback(() => setGuides([]), []);

  /** Create a guide and immediately begin dragging it (pull-from-ruler UX). */
  const addAndDrag = useCallback((
    type: Guide["type"],
    position: number,
    toWorld: (cx: number, cy: number) => { x: number; y: number },
  ) => {
    const id = `g-${Date.now()}`;
    setGuides((prev) => [...prev, { id, type, position }]);
    toWorldRef.current = toWorld;
    setDraggingId(id);
  }, []);

  /** Begin dragging an existing guide. */
  const startDrag = useCallback((
    id: string,
    toWorld: (cx: number, cy: number) => { x: number; y: number },
  ) => {
    toWorldRef.current = toWorld;
    setDraggingId(id);
  }, []);

  useEffect(() => {
    if (!draggingId) return;
    const dragged = guidesRef.current.find((g) => g.id === draggingId);
    if (!dragged) return;

    const onMove = (e: MouseEvent) => {
      if (!toWorldRef.current) return;
      const wp = toWorldRef.current(e.clientX, e.clientY);
      const pos = dragged.type === "horizontal" ? wp.y : wp.x;
      setGuides((prev) => prev.map((g) => g.id === draggingId ? { ...g, position: pos } : g));
    };
    const onUp = () => setDraggingId(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",  onUp);
    };
  }, [draggingId]);

  const snapToGuides = useCallback((rawX: number, rawY: number, zoom: number): { x: number; y: number } => {
    const thresh = GUIDE_SNAP_SCREEN_PX / zoom;
    let x = rawX, y = rawY;
    for (const g of guidesRef.current) {
      if (g.type === "vertical"   && Math.abs(rawX - g.position) < thresh) x = g.position;
      if (g.type === "horizontal" && Math.abs(rawY - g.position) < thresh) y = g.position;
    }
    return { x, y };
  }, []);

  return {
    guides,
    isDragging: draggingId !== null,
    addGuide, removeGuide, clearGuides, addAndDrag, startDrag, snapToGuides,
  };
}
