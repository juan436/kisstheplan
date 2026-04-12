"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { SeatingPlan } from "@/types";
import { getAllergyColors, getItemColors, pickNextColor, normalizeDish } from "@/lib/allergy-colors";

export function useSeating() {
  const { wedding, refreshUserData } = useAuth();

  const [plans, setPlans] = useState<SeatingPlan[]>([]);
  const [guests, setGuests] = useState<import("@/types").Guest[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [mode, setMode] = useState<"layout" | "seating">("layout");
  const [activeTab, setActiveTab] = useState<"canvas" | "list">("canvas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [showAddTable, setShowAddTable] = useState<"round" | "rectangular" | "serpentine" | null>(null);

  useEffect(() => {
    if (!wedding) return;
    Promise.all([api.getSeatingPlans(), api.getGuests()])
      .then(([p, g]) => {
        setPlans(p);
        setGuests(g);
        if (p.length > 0) setSelectedPlanId(p[0].id);
      })
      .catch(() => setError("No se pudieron cargar los datos"))
      .finally(() => setLoading(false));
  }, [wedding]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;

  // ─── Plan handlers ────────────────────────────────────────────────────────

  const handleCreatePlan = async (name: string) => {
    const newPlan = await api.createSeatingPlan(name);
    setPlans((prev) => [...prev, newPlan]);
    setSelectedPlanId(newPlan.id);
  };

  const handleDeletePlan = async (planId: string) => {
    await api.deleteSeatingPlan(planId);
    setPlans((prev) => {
      const next = prev.filter((p) => p.id !== planId);
      if (selectedPlanId === planId) setSelectedPlanId(next[0]?.id ?? null);
      return next;
    });
  };

  // ─── Table handlers ───────────────────────────────────────────────────────

  const handleAddTable = async (shape: "round" | "rectangular" | "serpentine", name?: string, capacity?: number) => {
    if (!selectedPlanId) return;
    const canvas = document.querySelector(".canvas-inner");
    const posX = canvas ? (canvas as HTMLElement).clientWidth / 2 - 60 : 200;
    const defaultName = shape === "round" ? "Mesa redonda" : shape === "serpentine" ? "Mesa serpentina" : "Mesa rectangular";
    const updated = await api.addSeatingTable(selectedPlanId, {
      name: name ?? defaultName,
      shape,
      capacity: capacity ?? 8,
      posX,
      posY: 200,
    });
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? updated : p)));
  };

  const handleUpdateTablePos = async (tableId: string, posX: number, posY: number) => {
    if (!selectedPlanId) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, tables: p.tables.map((t) => (t.id === tableId ? { ...t, posX, posY } : t)) }
          : p
      )
    );
    await api.updateSeatingTable(selectedPlanId, tableId, { posX, posY });
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!selectedPlanId) return;
    const updated = await api.deleteSeatingTable(selectedPlanId, tableId);
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? updated : p)));
  };

  const handleRenameTable = async (tableId: string, name: string) => {
    if (!selectedPlanId) return;
    const updated = await api.updateSeatingTable(selectedPlanId, tableId, { name });
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? updated : p)));
  };

  const handleRotateTable = async (tableId: string) => {
    if (!selectedPlanId) return;
    let newRot = 0;
    setPlans((prev) => {
      const table = prev.find((p) => p.id === selectedPlanId)?.tables.find((t) => t.id === tableId);
      newRot = ((table?.rotation ?? 0) + 90) % 360;
      return prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, tables: p.tables.map((t) => t.id === tableId ? { ...t, rotation: newRot } : t) }
          : p
      );
    });
    await api.updateSeatingTable(selectedPlanId, tableId, { rotation: newRot });
  };

  const handleUpdateTableSize = async (
    tableId: string,
    physicalDiameter?: number,
    physicalWidth?: number,
    physicalHeight?: number,
  ) => {
    if (!selectedPlanId) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, tables: p.tables.map((t) => (t.id === tableId ? { ...t, physicalDiameter, physicalWidth, physicalHeight } : t)) }
          : p
      )
    );
    await api.updateSeatingTable(selectedPlanId, tableId, { physicalDiameter, physicalWidth, physicalHeight });
  };

  const handleAssignSeat = async (tableId: string, seatNumber: number, guestId?: string) => {
    if (!selectedPlanId) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? {
              ...p,
              tables: p.tables.map((t) =>
                t.id === tableId
                  ? { ...t, assignments: t.assignments.map((a) => (a.seatNumber === seatNumber ? { ...a, guestId } : a)) }
                  : t
              ),
            }
          : p
      )
    );
    await api.assignSeat(selectedPlanId, tableId, seatNumber, guestId);
  };

  const allergyColors = useMemo(
    () => getAllergyColors(wedding?.allergyOptions ?? [], wedding?.allergyColors ?? {}),
    [wedding]
  );

  const mealColors = useMemo(() => {
    const base = getItemColors(wedding?.mealOptions ?? [], wedding?.mealColors ?? {});
    // Auto-assign unique colors for any dish value (individual or combo) not yet in the DB
    const result = { ...base };
    for (const g of guests) {
      const dish = g.dish?.trim();
      if (!dish) continue;
      const key = normalizeDish(dish);
      if (!result[key]) {
        result[key] = pickNextColor(result);
      }
    }
    return result;
  }, [wedding, guests]);

  // Persist any newly-computed dish colors (combos) back to the DB so they are
  // stable across reloads and immune to palette reordering.
  useEffect(() => {
    if (!wedding?.id) return;
    const stored = wedding.mealColors ?? {};
    const newEntries = Object.entries(mealColors).filter(([k]) => !stored[k]);
    if (newEntries.length === 0) return;
    const merged = { ...stored, ...Object.fromEntries(newEntries) };
    api.updateWedding(wedding.id, { mealColors: merged }).then(() => refreshUserData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealColors]);

  return {
    plans, guests, selectedPlanId, setSelectedPlanId,
    mode, setMode, activeTab, setActiveTab,
    loading, error,
    showNewPlan, setShowNewPlan,
    showAddTable, setShowAddTable,
    selectedPlan,
    allergyColors, mealColors,
    handleCreatePlan, handleDeletePlan,
    handleAddTable, handleUpdateTablePos, handleUpdateTableSize, handleRotateTable, handleDeleteTable,
    handleRenameTable, handleAssignSeat,
  };
}
