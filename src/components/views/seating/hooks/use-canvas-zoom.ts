"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WORLD_W, WORLD_H } from "../constants/seating.constants";

export const MAX_ZOOM = 50; // 5000% deep zoom
const WHEEL_FACTOR_IN  = 1.09;
const WHEEL_FACTOR_OUT = 1 / WHEEL_FACTOR_IN;

interface UseCanvasZoomOptions {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  fitZoom: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  panOffset: { x: number; y: number };
  setPanOffset: (v: { x: number; y: number }) => void;
  resetPan: () => void;
}

export function useCanvasZoom({
  canvasRef, fitZoom, zoom, setZoom, panOffset, setPanOffset, resetPan,
}: UseCanvasZoomOptions) {
  const [transitioning, setTransitioning] = useState(false);

  // Refs so event handlers always see latest values without re-registering
  const zoomRef      = useRef(zoom);
  const panRef       = useRef(panOffset);
  const fitRef       = useRef(fitZoom);

  useEffect(() => { zoomRef.current = zoom; },       [zoom]);
  useEffect(() => { panRef.current  = panOffset; },  [panOffset]);
  useEffect(() => { fitRef.current  = fitZoom; },    [fitZoom]);

  // ── Wheel zoom (zoom-to-cursor) ──────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const oldZ = zoomRef.current;
      const factor = e.deltaY < 0 ? WHEEL_FACTOR_IN : WHEEL_FACTOR_OUT;
      const newZ = Math.max(fitRef.current, Math.min(MAX_ZOOM, oldZ * factor));
      if (newZ === oldZ) return;

      const cw = el.offsetWidth;
      const ch = el.offsetHeight;            // altura real del canvas en ese instante
      const ox = Math.max(0, (cw - WORLD_W * oldZ) / 2);
      const oy = Math.max(0, (ch - WORLD_H * oldZ) / 2);
      const r  = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const pan = panRef.current;

      // World point under cursor
      const wx = (mx - ox - pan.x) / oldZ;
      const wy = (my - oy - pan.y) / oldZ;

      // New offsets with new zoom
      const nox = Math.max(0, (cw - WORLD_W * newZ) / 2);
      const noy = Math.max(0, (ch - WORLD_H * newZ) / 2);

      setPanOffset({ x: mx - nox - wx * newZ, y: my - noy - wy * newZ });
      setZoom(newZ);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [canvasRef, setPanOffset, setZoom]);

  // ── Pinch to zoom ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    let lastDist = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2)
        lastDist = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY,
        );
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY,
      );
      if (!lastDist) { lastDist = dist; return; }
      const ratio = dist / lastDist;
      setZoom((z) => Math.max(fitRef.current, Math.min(MAX_ZOOM, z * ratio)));
      lastDist = dist;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
    };
  }, [canvasRef, setZoom]);

  // ── Center / reset view (animated) ──────────────────────────────────────
  const handleCenter = useCallback(() => {
    setTransitioning(true);
    setZoom(fitRef.current);
    resetPan();
    const t = setTimeout(() => setTransitioning(false), 380);
    return () => clearTimeout(t);
  }, [resetPan, setZoom]);

  return { transitioning, handleCenter };
}
