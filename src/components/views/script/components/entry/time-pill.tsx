"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, AlignLeft } from "lucide-react";
import type { ScriptEntry } from "@/types";
import { formatTimeDisplay } from "../../helpers/script.helpers";
import type { TimePillMode } from "../../helpers/script.helpers";

export function TimePill({ entry, onUpdate }: { entry: ScriptEntry; onUpdate: (d: Partial<ScriptEntry>) => void }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [mode, setMode] = useState<TimePillMode>(entry.timeType);
  const [timeStart, setTimeStart] = useState(entry.timeStart ?? "");
  const [timeEnd, setTimeEnd] = useState(entry.timeEnd ?? "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMode(entry.timeType); setTimeStart(entry.timeStart ?? ""); setTimeEnd(entry.timeEnd ?? ""); }, [entry]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setOpenUp(window.innerHeight - rect.bottom < 220);
    }
    setOpen((v) => !v);
  };

  const save = () => {
    onUpdate({ timeType: mode, timeStart: mode !== "none" ? (timeStart || undefined) : undefined, timeEnd: mode === "range" ? (timeEnd || undefined) : undefined });
    setOpen(false);
  };

  const display = formatTimeDisplay(entry);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors"
        style={{
          background: display ? "var(--color-fill)" : "transparent",
          color: display ? "var(--color-accent)" : "var(--color-border)",
          border: `1px solid ${display ? "var(--color-fill-2)" : "var(--color-border)"}`,
        }}
      >
        <Clock size={10} />
        <span>{display || "Hora"}</span>
        <ChevronDown size={10} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: openUp ? 4 : -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: openUp ? 4 : -4 }}
            className="absolute left-0 z-50 rounded-xl p-3 w-60"
            style={{
              background: "white",
              boxShadow: "0 12px 40px rgba(74,60,50,0.12)",
              border: "1px solid var(--color-border)",
              ...(openUp ? { bottom: "calc(100% + 4px)" } : { top: "calc(100% + 4px)" }),
            }}
          >
            <div className="flex flex-col gap-1 mb-3">
              {(["exact", "range", "none"] as TimePillMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors"
                  style={{ background: mode === m ? "var(--color-fill)" : "transparent", color: mode === m ? "var(--color-accent)" : "var(--color-text)" }}
                >
                  {m === "none" ? <AlignLeft size={12} /> : <Clock size={12} />}
                  {m === "exact" && "Añadir hora"}
                  {m === "range" && "Añadir rango de hora"}
                  {m === "none" && "Sin hora, solo texto"}
                </button>
              ))}
            </div>
            {mode !== "none" && (
              <div className="flex gap-2 mb-2 items-center">
                <input type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)}
                  className="flex-1 text-xs rounded-lg px-2 py-1 border outline-none"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
                {mode === "range" && (
                  <>
                    <span className="text-xs" style={{ color: "var(--color-text)" }}>—</span>
                    <input type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)}
                      className="flex-1 text-xs rounded-lg px-2 py-1 border outline-none"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
                  </>
                )}
              </div>
            )}
            <button onClick={save} className="w-full text-xs font-semibold py-1.5 rounded-lg text-white transition-colors"
              style={{ background: "var(--color-accent)" }}>Guardar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
