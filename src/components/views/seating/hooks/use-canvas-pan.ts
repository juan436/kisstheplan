"use client";

import { useState, useRef, useCallback } from "react";

export function useCanvasPan() {
  const [panMode, setPanMode] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  // Refs to avoid stale closures in event listeners
  const panModeRef = useRef(false);
  const panOffsetRef = useRef({ x: 0, y: 0 });

  const togglePanMode = useCallback(() => {
    setPanMode((v) => {
      panModeRef.current = !v;
      return !v;
    });
  }, []);

  const onPanMouseDown = useCallback((e: React.MouseEvent) => {
    if (!panModeRef.current) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPx = panOffsetRef.current.x;
    const startPy = panOffsetRef.current.y;

    setIsPanning(true);

    const onMove = (ev: MouseEvent) => {
      const next = { x: startPx + (ev.clientX - startX), y: startPy + (ev.clientY - startY) };
      panOffsetRef.current = next;
      setPanOffset(next);
    };
    const onUp = () => {
      setIsPanning(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const resetPan = useCallback(() => {
    panOffsetRef.current = { x: 0, y: 0 };
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const setPanOffsetSync = useCallback((v: { x: number; y: number }) => {
    panOffsetRef.current = v;
    setPanOffset(v);
  }, []);

  return { panMode, togglePanMode, panOffset, onPanMouseDown, resetPan, isPanning, setPanOffset: setPanOffsetSync };
}
