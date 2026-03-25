"use client";

import { useState, useEffect } from "react";
import type { ScriptEntry, ScriptArea, GuestStats } from "@/types";
import { api } from "@/services";

export function useScript() {
  const [entries, setEntries] = useState<ScriptEntry[]>([]);
  const [areas, setAreas] = useState<ScriptArea[]>([]);
  const [guestStats, setGuestStats] = useState<GuestStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [e, a, g] = await Promise.all([
          api.getScriptEntries(),
          api.getScriptAreas(),
          api.getGuestStats().catch(() => null),
        ]);
        setEntries(e);
        setAreas(a);
        setGuestStats(g);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreateEntry = async (data: Partial<ScriptEntry>) => {
    const entry = await api.createScriptEntry(data);
    setEntries((prev) => [...prev, entry]);
  };

  const handleUpdateEntry = async (id: string, data: Partial<ScriptEntry>) => {
    const updated = await api.updateScriptEntry(id, data);
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const handleDeleteEntry = async (id: string) => {
    await api.deleteScriptEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleReorderEntries = async (ids: string[]) => {
    const updated = await api.reorderScriptEntries(ids);
    setEntries(updated);
  };

  const handleCreateArea = async (data: { name: string; imageUrl?: string }) => {
    const area = await api.createScriptArea(data);
    setAreas((prev) => [...prev, area]);
  };

  const handleUpdateArea = async (id: string, data: { name?: string; imageUrl?: string }) => {
    const updated = await api.updateScriptArea(id, data);
    setAreas((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const handleDeleteArea = async (id: string) => {
    await api.deleteScriptArea(id);
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    entries, areas, guestStats, loading,
    handleCreateEntry, handleUpdateEntry, handleDeleteEntry, handleReorderEntries,
    handleCreateArea, handleUpdateArea, handleDeleteArea,
  };
}
