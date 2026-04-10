"use client";

import { useState, useRef, useCallback } from "react";

type Pan = { x: number; y: number };
type ClampFn = (pan: Pan) => Pan;

export function useCanvasPan(clampRef?: React.RefObject<ClampFn>) {
  const [panMode, setPanMode] = useState(false);
  const [panOffset, setPanOffset] = useState<Pan>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const panModeRef   = useRef(false);
  const panOffsetRef = useRef<Pan>({ x: 0, y: 0 });

  const applyClamp = useCallback((pan: Pan): Pan => {
    return clampRef?.current ? clampRef.current(pan) : pan;
  }, [clampRef]);

  const togglePanMode = useCallback(() => {
    setPanMode((v) => {
      panModeRef.current = !v;
      return !v;
    });
  }, []);

  const onPanMouseDown = useCallback((e: React.MouseEvent) => {
    if (!panModeRef.current) return;
    e.preventDefault();
    const startX  = e.clientX;
    const startY  = e.clientY;
    const startPx = panOffsetRef.current.x;
    const startPy = panOffsetRef.current.y;

    setIsPanning(true);

    const onMove = (ev: MouseEvent) => {
      const raw   = { x: startPx + (ev.clientX - startX), y: startPy + (ev.clientY - startY) };
      const next  = applyClamp(raw);
      panOffsetRef.current = next;
      setPanOffset(next);
    };
    const onUp = () => {
      setIsPanning(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, [applyClamp]);

  const resetPan = useCallback(() => {
    const zero = { x: 0, y: 0 };
    panOffsetRef.current = zero;
    setPanOffset(zero);
  }, []);

  const setPanOffsetSync = useCallback((v: Pan) => {
    const next = applyClamp(v);
    panOffsetRef.current = next;
    setPanOffset(next);
  }, [applyClamp]);

  return { panMode, togglePanMode, panOffset, onPanMouseDown, resetPan, isPanning, setPanOffset: setPanOffsetSync };
}
