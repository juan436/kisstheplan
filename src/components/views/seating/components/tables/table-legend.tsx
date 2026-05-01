"use client";

import { useState, useMemo } from "react";
import { X, Search, MapPin } from "lucide-react";
import type { SeatingPlan, Guest } from "@/types";

interface Props {
  plan: SeatingPlan;
  guests: Guest[];
  onCenterTable?: (tableId: string) => void;
  onClose: () => void;
}

export function TableLegend({ plan, guests, onCenterTable, onClose }: Props) {
  const [search, setSearch] = useState("");

  const guestMap = useMemo(() => new Map(guests.map((g) => [g.id, g])), [guests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plan.tables;
    return plan.tables.filter((t) => {
      if (t.name.toLowerCase().includes(q)) return true;
      return t.assignments.some((a) => {
        if (!a.guestId) return false;
        return guestMap.get(a.guestId)?.name.toLowerCase().includes(q) ?? false;
      });
    });
  }, [plan.tables, search, guestMap]);

  return (
    <div style={{
      width: 220, maxHeight: 440,
      display: "flex", flexDirection: "column",
      background: "rgba(255,252,249,0.97)", backdropFilter: "blur(12px)",
      border: "1px solid var(--color-border)", borderRadius: 14,
      boxShadow: "0 8px 40px rgba(74,60,50,0.14), 0 2px 8px rgba(74,60,50,0.07)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px", borderBottom: "1px solid var(--color-border)",
        background: "rgba(245,239,233,0.7)", borderRadius: "14px 14px 0 0", flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", fontFamily: "Quicksand, sans-serif" }}>
          Mesas e invitados
        </span>
        <button onClick={onClose}
          style={{ color: "rgba(74,60,50,0.4)", background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: 0 }}>
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "7px 10px", borderBottom: "1px solid var(--color-border)", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 8px", borderRadius: 8,
          background: "var(--color-bg-2)", border: "1px solid var(--color-border)",
        }}>
          <Search size={11} style={{ color: "rgba(74,60,50,0.35)", flexShrink: 0 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Mesa o invitado..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 11, color: "var(--color-text)", fontFamily: "Quicksand, sans-serif",
            }} />
        </div>
      </div>

      {/* Table list */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {filtered.length === 0 && (
          <p style={{ fontSize: 11, color: "rgba(74,60,50,0.4)", textAlign: "center", padding: "16px 0", margin: 0 }}>
            Sin resultados
          </p>
        )}
        {filtered.map((table) => {
          const assigned = table.assignments
            .filter((a) => a.guestId)
            .map((a) => guestMap.get(a.guestId!))
            .filter(Boolean) as Guest[];

          return (
            <div key={table.id}
              onClick={() => onCenterTable?.(table.id)}
              style={{ padding: "7px 12px", borderBottom: "1px solid rgba(212,201,184,0.35)", cursor: onCenterTable ? "pointer" : "default" }}
              onMouseEnter={(e) => { if (onCenterTable) (e.currentTarget as HTMLElement).style.background = "rgba(140,111,95,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}>
              {/* Table name row */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: assigned.length > 0 ? 3 : 0 }}>
                <MapPin size={10} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {table.name}
                </span>
                <span style={{ fontSize: 10, color: "rgba(74,60,50,0.4)", flexShrink: 0 }}>
                  {assigned.length}/{table.capacity}
                </span>
              </div>
              {/* Guest list */}
              {assigned.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 1, paddingLeft: 15 }}>
                  {assigned.map((g) => (
                    <span key={g.id} style={{ fontSize: 10, color: "rgba(74,60,50,0.6)", lineHeight: 1.35 }}>{g.name}</span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 10, color: "rgba(74,60,50,0.3)", fontStyle: "italic", paddingLeft: 15, margin: 0 }}>
                  Mesa vacía
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
