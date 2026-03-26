"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, } from "framer-motion";
import { Plus } from "lucide-react";
import type { ScriptViewProps } from "../helpers/script.helpers";
import { sortEntries, formatTimeDisplay } from "../helpers/script.helpers";
import { EntryRow } from "./entry-row";

type GuionTabProps = Pick<ScriptViewProps, "entries" | "areas" | "guestStats" | "onCreateEntry" | "onUpdateEntry" | "onDeleteEntry" | "onReorderEntries">;

export function GuionDetalladoTab({ entries, guestStats, onCreateEntry, onUpdateEntry, onDeleteEntry, onReorderEntries }: GuionTabProps) {
  const [localOrder, setLocalOrder] = useState(() => sortEntries(entries).map((e) => e.id));
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  useEffect(() => { setLocalOrder(sortEntries(entries).map((e) => e.id)); }, [entries]);

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const next = [...localOrder];
    const from = next.indexOf(dragging);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, dragging);
    setLocalOrder(next);
    setDragging(null);
    setDragOver(null);
    await onReorderEntries(next);
  };

  const timedEntries = sortEntries(entries).filter((e) => e.timeType !== "none" && e.timeStart);
  const addEntry = () => onCreateEntry({ title: "Nueva entrada", timeType: "none", style: {}, order: entries.length });
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex gap-0 mt-6" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="w-52 flex-shrink-0 pr-5 border-r" style={{ borderColor: "var(--color-fill)", position: "sticky", top: 80, alignSelf: "flex-start" }}>
        <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-text)" }}>Horarios</h3>
        {timedEntries.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--color-accent)" }}>Sin horarios aún</p>
        ) : (
          <div className="space-y-2">
            {timedEntries.map((e) => (
              <div key={e.id} className="flex gap-2">
                <span className="text-xs tabular-nums font-semibold flex-shrink-0" style={{ color: "var(--color-cta)", minWidth: 52 }}>{formatTimeDisplay(e)}</span>
                <span className="text-xs leading-tight" style={{ color: "var(--color-text)" }}>{e.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 pl-6 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold capitalize" style={{ color: "var(--color-text)" }}>{today}</div>
            {guestStats && (
              <div className="text-xs mt-0.5" style={{ color: "var(--color-accent)" }}>
                {guestStats.confirmed} invitados confirmados{(guestStats.pending ?? 0) > 0 && ` · ${guestStats.pending} pendientes`}
              </div>
            )}
          </div>
          <button onClick={addEntry} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            style={{ background: "var(--color-fill)", color: "var(--color-accent)" }}>
            <Plus size={13} />Añadir línea
          </button>
        </div>

        <div>
          <AnimatePresence>
            {localOrder.map((id) => {
              const entry = entries.find((e) => e.id === id);
              if (!entry) return null;
              return (
                <div key={entry.id} draggable
                  onDragStart={() => setDragging(entry.id)}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(entry.id); }}
                  onDrop={(e) => handleDrop(e, entry.id)}
                  onDragEnd={() => { setDragging(null); setDragOver(null); }}
                  style={{
                    opacity: dragging === entry.id ? 0.45 : 1,
                    borderRadius: 12,
                    outline: dragOver === entry.id && dragging !== entry.id ? "2px solid var(--color-accent)" : "none",
                    transition: "outline 0.1s",
                  }}>
                  <EntryRow entry={entry} onUpdate={onUpdateEntry} onDelete={onDeleteEntry} />
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        <button onClick={addEntry}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium w-full justify-center transition-colors hover:bg-[var(--color-bg-2)]"
          style={{ color: "var(--color-border)", border: "1px dashed var(--color-border)" }}>
          <Plus size={14} />Añadir línea
        </button>
      </div>
    </div>
  );
}
