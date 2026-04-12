"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/services";
import type { SeatingPlan, DecorationObject, DecorationType } from "@/types";
import { DECORATION_META, WORLD_W, WORLD_H } from "../constants/seating.constants";

export function useCanvasDecorations(plan: SeatingPlan) {
  const [decorations, setDecorations] = useState<DecorationObject[]>(plan.decorations ?? []);
  const [selectedDecoId, setSelectedDecoId] = useState<string | null>(null);
  const [decoPanel, setDecoPanel] = useState<{ screenX: number; screenY: number } | null>(null);

  // Re-sync when the active plan switches
  useEffect(() => {
    setDecorations(plan.decorations ?? []);
    setSelectedDecoId(null);
    setDecoPanel(null);
  }, [plan.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onUpdateDecoPos = useCallback((id: string, x: number, y: number) => {
    setDecorations((prev) => {
      const next = prev.map((d) => d.id === id ? { ...d, posX: x, posY: y } : d);
      if (plan.id) api.updateSeatingPlan(plan.id, { decorations: next });
      return next;
    });
  }, [plan.id]);

  const handleDecoClick = useCallback((
    id: string, clientX: number, clientY: number,
    canvasRect: DOMRect, mode: string, zoningMode: boolean, panMode: boolean
  ) => {
    if (mode !== "layout" || zoningMode || panMode) return;
    setSelectedDecoId(id);
    setDecoPanel({ screenX: clientX - canvasRect.left, screenY: clientY - canvasRect.top });
  }, []);

  const handleDecoApply = useCallback((id: string, width: number, height: number) => {
    setDecorations((prev) => {
      const next = prev.map((d) => d.id === id ? { ...d, physicalWidth: width, physicalHeight: height } : d);
      if (plan.id) api.updateSeatingPlan(plan.id, { decorations: next });
      return next;
    });
    setSelectedDecoId(null);
    setDecoPanel(null);
  }, [plan.id]);

  const closeDecoPanel = useCallback(() => {
    setSelectedDecoId(null);
    setDecoPanel(null);
  }, []);

  const handleDeleteDeco = useCallback((id: string) => {
    setDecorations((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (plan.id) api.updateSeatingPlan(plan.id, { decorations: next });
      return next;
    });
    setSelectedDecoId(null);
    setDecoPanel(null);
  }, [plan.id]);

  const handleAddDecoration = useCallback((type: DecorationType, extra?: Partial<DecorationObject>) => {
    const m = DECORATION_META[type];
    const newDeco: DecorationObject = {
      id: `deco-${Date.now()}`, type,
      posX: WORLD_W / 2, posY: WORLD_H / 2,
      physicalWidth: extra?.physicalWidth ?? m?.physicalW ?? 1,
      physicalHeight: extra?.physicalHeight ?? m?.physicalH ?? 1,
      ...extra,
    };
    setDecorations((prev) => {
      const next = [...prev, newDeco];
      if (plan.id) api.updateSeatingPlan(plan.id, { decorations: next });
      return next;
    });
  }, [plan.id]);

  const handleAssignChairGuest = useCallback((id: string, guestId?: string) => {
    setDecorations((prev) => {
      const next = prev.map((d) => d.id === id ? { ...d, guestId: guestId || undefined } : d);
      if (plan.id) api.updateSeatingPlan(plan.id, { decorations: next });
      return next;
    });
  }, [plan.id]);

  return {
    decorations, selectedDecoId, decoPanel,
    onUpdateDecoPos, handleDecoClick, handleDecoApply, closeDecoPanel,
    handleAddDecoration, handleDeleteDeco, handleAssignChairGuest,
  };
}
