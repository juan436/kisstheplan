"use client";

import { useState, useEffect } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { SeatingPlan } from "@/types";

export function useSeating() {
  const { wedding } = useAuth();

  const [plans, setPlans] = useState<SeatingPlan[]>([]);
  const [guests, setGuests] = useState<import("@/types").Guest[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [mode, setMode] = useState<"layout" | "seating">("layout");
  const [activeTab, setActiveTab] = useState<"canvas" | "list">("canvas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [showAddTable, setShowAddTable] = useState<"round" | "rectangular" | null>(null);

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

  const handleAddTable = async (shape: "round" | "rectangular", name?: string, capacity?: number) => {
    if (!selectedPlanId) return;
    const canvas = document.querySelector(".canvas-inner");
    const posX = canvas ? (canvas as HTMLElement).clientWidth / 2 - 60 : 200;
    const updated = await api.addSeatingTable(selectedPlanId, {
      name: name ?? (shape === "round" ? "Mesa redonda" : "Mesa rectangular"),
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

  return {
    plans, guests, selectedPlanId, setSelectedPlanId,
    mode, setMode, activeTab, setActiveTab,
    loading, error,
    showNewPlan, setShowNewPlan,
    showAddTable, setShowAddTable,
    selectedPlan,
    handleCreatePlan, handleDeletePlan,
    handleAddTable, handleUpdateTablePos, handleDeleteTable,
    handleRenameTable, handleAssignSeat,
  };
}
