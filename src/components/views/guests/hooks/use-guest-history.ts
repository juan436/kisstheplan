"use client";

import { useState, useCallback, useMemo } from "react";
import { api } from "@/services";
import type { GuestHistory, AuditEntry } from "@/services/api";

export type { GuestHistory, AuditEntry };

function detectOverriddenFields(log: AuditEntry[]): Set<string> {
  const guestFields = new Set<string>();
  const overridden = new Set<string>();
  const sorted = [...log].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  for (const entry of sorted) {
    if (entry.source === "GUEST_WEB") {
      entry.changes.forEach((c) => guestFields.add(c.field));
    } else if (entry.source === "ADMIN_PANEL") {
      entry.changes.forEach((c) => {
        if (guestFields.has(c.field)) overridden.add(c.field);
      });
    }
  }
  return overridden;
}

export function useGuestHistory() {
  const [history, setHistory] = useState<GuestHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const openHistory = useCallback(async (guestId: string) => {
    setOpen(true);
    setLoading(true);
    try {
      const data = await api.getGuestHistory(guestId);
      setHistory(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeHistory = useCallback(() => {
    setOpen(false);
    setHistory(null);
  }, []);

  const sortedLog = useMemo(
    () =>
      history
        ? [...history.auditLog].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
        : [],
    [history],
  );

  const overriddenFields = useMemo(
    () => (history ? detectOverriddenFields(history.auditLog) : new Set<string>()),
    [history],
  );

  return { history, loading, open, sortedLog, overriddenFields, openHistory, closeHistory };
}
