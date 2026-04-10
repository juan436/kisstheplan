"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/services";
import type { CalibZone, SeatingPlan } from "@/types";

function computeZoneScale(
  points: { x: number; y: number }[],
  physW: number,
  physH: number
): number {
  const [p0, p1, p2, p3] = points;
  const topPx  = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const botPx  = Math.hypot(p2.x - p3.x, p2.y - p3.y);
  const leftPx = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  const rightPx = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const scaleX = ((topPx + botPx) / 2) / physW;
  const scaleY = ((leftPx + rightPx) / 2) / physH;
  return (scaleX + scaleY) / 2;
}

export function useCanvasZones(plan: SeatingPlan) {
  const [zones, setZones] = useState<CalibZone[]>(plan.zones ?? []);
  const [zoningMode, setZoningMode] = useState(false);
  const [zonePoints, setZonePoints] = useState<{ x: number; y: number }[]>([]);
  const [pendingPoints, setPendingPoints] = useState<{ x: number; y: number }[] | null>(null);

  // Re-sync when the active plan switches
  useEffect(() => {
    setZones(plan.zones ?? []);
    setZoningMode(false);
    setZonePoints([]);
    setPendingPoints(null);
  }, [plan.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleZoningMode = useCallback(() => {
    setZoningMode((v) => !v);
    setZonePoints([]);
    setPendingPoints(null);
  }, []);

  /**
   * Call from the SVG click handler when zoningMode is active.
   * Returns true if the click was consumed by zone creation.
   */
  const handleZoneClick = useCallback((worldPos: { x: number; y: number }): boolean => {
    if (!zoningMode) return false;
    const next = [...zonePoints, worldPos];
    if (next.length === 4) {
      setPendingPoints(next);
      setZonePoints([]);
      setZoningMode(false);
    } else {
      setZonePoints(next);
    }
    return true;
  }, [zoningMode, zonePoints]);

  const confirmZone = useCallback((physW: number, physH: number) => {
    if (!pendingPoints) return;
    const localScale = computeZoneScale(pendingPoints, physW, physH);
    const zone: CalibZone = {
      id: `zone-${Date.now()}`,
      points: pendingPoints,
      physicalWidth: physW,
      physicalHeight: physH,
      localScale,
    };
    const next = [...zones, zone];
    setZones(next);
    setPendingPoints(null);
    if (plan.id) api.updateSeatingPlan(plan.id, { zones: next });
  }, [pendingPoints, zones, plan.id]);

  const cancelPendingZone = useCallback(() => {
    setPendingPoints(null);
    setZonePoints([]);
    setZoningMode(false);
  }, []);

  const clearZones = useCallback(() => {
    setZones([]);
    setZonePoints([]);
    setPendingPoints(null);
    if (plan.id) api.updateSeatingPlan(plan.id, { zones: [] } as Partial<SeatingPlan>);
  }, [plan.id]);

  return {
    zones, zoningMode, zonePoints, pendingPoints,
    toggleZoningMode, handleZoneClick, confirmZone, cancelPendingZone, clearZones,
  };
}
