"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, GripVertical, Clock, ChevronDown,
  AlignLeft, Type, Image as ImageIcon, FileDown, Loader2,
} from "lucide-react";
import type { ScriptEntry, ScriptArea, GuestStats } from "@/types";
import { api } from "@/services";

interface ScriptViewProps {
  entries: ScriptEntry[];
  areas: ScriptArea[];
  guestStats: GuestStats | null;
  onCreateEntry: (data: Partial<ScriptEntry>) => Promise<void>;
  onUpdateEntry: (id: string, data: Partial<ScriptEntry>) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  onReorderEntries: (ids: string[]) => Promise<void>;
  onCreateArea: (data: { name: string; imageUrl?: string }) => Promise<void>;
  onUpdateArea: (id: string, data: { name?: string; imageUrl?: string }) => Promise<void>;
  onDeleteArea: (id: string) => Promise<void>;
}

type TabType = "resumen" | "guion";
type TimePillMode = "exact" | "range" | "none";

function formatTimeDisplay(entry: ScriptEntry): string {
  if (entry.timeType === "none" || !entry.timeStart) return "";
  if (entry.timeType === "range" && entry.timeEnd) return `${entry.timeStart} - ${entry.timeEnd}`;
  return entry.timeStart;
}

function sortEntries(entries: ScriptEntry[]): ScriptEntry[] {
  return [...entries].sort((a, b) => {
    const aT = a.timeType !== "none" && a.timeStart;
    const bT = b.timeType !== "none" && b.timeStart;
    if (aT && bT) return (a.timeStart ?? "").localeCompare(b.timeStart ?? "");
    if (aT) return -1;
    if (bT) return 1;
    return a.order - b.order;
  });
}

// --- Time Pill Popover ---
function TimePill({ entry, onUpdate }: { entry: ScriptEntry; onUpdate: (d: Partial<ScriptEntry>) => void }) {
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
      // popover is ~200px tall; open upward if less than 220px to bottom of viewport
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

// --- Style Bar ---
const FONT_SIZES = [{ value: "sm", label: "S" }, { value: "base", label: "M" }, { value: "lg", label: "L" }, { value: "xl", label: "XL" }] as const;
const COLORS = ["#4A3C32", "#866857", "#C4B7A6", "#8c6f5f", "#c7a977", "#7db87d", "#c47a7a", "#5b7fa6"];

function StyleBar({ style, onChange }: { style: ScriptEntry["style"]; onChange: (s: Partial<ScriptEntry["style"]>) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1 p-2 rounded-lg" style={{ background: "var(--color-bg-2)" }}>
      <button onClick={() => onChange({ bold: !style.bold })}
        className="w-6 h-6 rounded text-xs font-bold transition-colors"
        style={{ background: style.bold ? "var(--color-fill)" : "transparent", color: style.bold ? "var(--color-accent)" : "var(--color-border)", border: `1px solid ${style.bold ? "var(--color-fill-2)" : "var(--color-border)"}` }}>B</button>
      {FONT_SIZES.map((s) => (
        <button key={s.value} onClick={() => onChange({ fontSize: s.value })}
          className="w-6 h-6 rounded text-xs font-medium transition-colors"
          style={{ background: style.fontSize === s.value ? "var(--color-fill)" : "transparent", color: style.fontSize === s.value ? "var(--color-accent)" : "var(--color-border)", border: `1px solid ${style.fontSize === s.value ? "var(--color-fill-2)" : "var(--color-border)"}` }}>{s.label}</button>
      ))}
      <span className="text-xs ml-1" style={{ color: "var(--color-border)" }}>Color:</span>
      {COLORS.map((c) => (
        <button key={c} onClick={() => onChange({ color: c })}
          className="w-4 h-4 rounded-full border-2 transition-transform hover:scale-110"
          style={{ background: c, borderColor: style.color === c ? "var(--color-accent)" : "transparent" }} />
      ))}
    </div>
  );
}

// --- Entry Row ---
function EntryRow({ entry, onUpdate, onDelete }: {
  entry: ScriptEntry;
  onUpdate: (id: string, data: Partial<ScriptEntry>) => void;
  onDelete: (id: string) => void;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [titleVal, setTitleVal] = useState(entry.title);
  const [descVal, setDescVal] = useState(entry.description ?? "");
  const [showStyle, setShowStyle] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setTitleVal(entry.title); }, [entry.title]);
  useEffect(() => { setDescVal(entry.description ?? ""); }, [entry.description]);

  const saveTitle = () => { if (titleVal.trim()) onUpdate(entry.id, { title: titleVal.trim() }); setEditTitle(false); };
  const saveDesc = () => { onUpdate(entry.id, { description: descVal }); setEditDesc(false); };

  const fsClass = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" }[entry.style.fontSize ?? "base"];

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="group flex gap-3 items-start py-2.5 px-2 rounded-xl transition-colors hover:bg-[var(--color-bg-2)]">
      {/* Drag hint */}
      <div className="mt-2 opacity-0 group-hover:opacity-30 transition-opacity cursor-grab" style={{ color: "var(--color-border)" }}>
        <GripVertical size={15} />
      </div>

      {/* Node + line */}
      <div className="flex flex-col items-center mt-2 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: "var(--color-accent)", background: "var(--color-bg)" }} />
        <div className="w-px flex-1 min-h-[36px] mt-1" style={{ background: "var(--color-fill)" }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1"><TimePill entry={entry} onUpdate={(d) => onUpdate(entry.id, d)} /></div>

        {editTitle ? (
          <input ref={titleRef} value={titleVal} onChange={(e) => setTitleVal(e.target.value)}
            onBlur={saveTitle} onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setTitleVal(entry.title); setEditTitle(false); } }}
            className={`w-full bg-transparent outline-none border-b ${fsClass}`}
            style={{ color: entry.style.color ?? "var(--color-text)", fontWeight: entry.style.bold ? 700 : 600, borderColor: "var(--color-accent)" }} autoFocus />
        ) : (
          <div className={`${fsClass} cursor-text leading-snug`}
            style={{ color: entry.style.color ?? "var(--color-text)", fontWeight: entry.style.bold ? 700 : 600 }}
            onClick={() => { setEditTitle(true); setTimeout(() => titleRef.current?.focus(), 10); }}>
            {entry.title}
          </div>
        )}

        {editDesc ? (
          <textarea ref={descRef} value={descVal} onChange={(e) => setDescVal(e.target.value)}
            onBlur={saveDesc} onKeyDown={(e) => { if (e.key === "Escape") { setDescVal(entry.description ?? ""); setEditDesc(false); } }}
            className="w-full bg-transparent outline-none text-xs mt-0.5 resize-none border-b"
            style={{ color: "var(--color-accent)", borderColor: "var(--color-border)", minHeight: 36 }} rows={2} autoFocus />
        ) : (
          <div className="text-xs mt-0.5 cursor-text min-h-[16px]" style={{ color: "var(--color-accent)" }}
            onClick={() => { setEditDesc(true); setTimeout(() => descRef.current?.focus(), 10); }}>
            {entry.description || <span className="opacity-30">Añadir descripción…</span>}
          </div>
        )}

        <AnimatePresence>
          {showStyle && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <StyleBar style={entry.style} onChange={(s) => onUpdate(entry.id, { style: { ...entry.style, ...s } })} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex-shrink-0">
        <button onClick={() => setShowStyle((v) => !v)} title="Estilo"
          className="p-1 rounded-lg transition-colors"
          style={{ color: showStyle ? "var(--color-accent)" : "var(--color-border)" }}>
          <Type size={13} />
        </button>
        <button onClick={() => onDelete(entry.id)} title="Eliminar"
          className="p-1 rounded-lg transition-colors hover:text-red-400"
          style={{ color: "var(--color-border)" }}>
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// --- Resumen Tab ---
function ResumenTab({ entries, areas, onCreateArea, onUpdateArea, onDeleteArea }:
  Pick<ScriptViewProps, "entries" | "areas" | "onCreateArea" | "onUpdateArea" | "onDeleteArea">) {
  const [newArea, setNewArea] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const timedEntries = sortEntries(entries).filter((e) => e.timeType !== "none" && e.timeStart);

  const addArea = async () => { if (!newArea.trim()) return; await onCreateArea({ name: newArea.trim() }); setNewArea(""); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
      {/* Horarios */}
      <div>
        <h2 className="text-2xl mb-5" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-text)" }}>Horarios</h2>
        {timedEntries.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-accent)" }}>Sin horarios. Añádelos en el Guión Detallado.</p>
        ) : (
          <div className="space-y-3">
            {timedEntries.map((e) => (
              <div key={e.id} className="flex items-start gap-4">
                <span className="text-sm font-semibold tabular-nums flex-shrink-0 w-28" style={{ color: "var(--color-cta)" }}>{formatTimeDisplay(e)}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{e.title}</div>
                  {e.description && <div className="text-xs mt-0.5" style={{ color: "var(--color-accent)" }}>{e.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Áreas + imagen */}
      <div>
        <h2 className="text-2xl mb-5" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-text)" }}>Áreas</h2>
        <div className="space-y-2 mb-4">
          {areas.map((area) => (
            <div key={area.id} className="group flex items-center gap-2">
              {editId === area.id ? (
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  onBlur={async () => { if (editName.trim() !== area.name) await onUpdateArea(area.id, { name: editName.trim() || area.name }); setEditId(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") (e.target as HTMLInputElement).blur(); }}
                  className="flex-1 text-sm px-2 py-1 rounded-lg border outline-none"
                  style={{ borderColor: "var(--color-accent)", color: "var(--color-text)" }} autoFocus />
              ) : (
                <div className="flex-1 text-sm font-medium cursor-text px-2 py-1 rounded-lg hover:bg-[var(--color-bg-2)]"
                  style={{ color: "var(--color-text)" }}
                  onClick={() => { setEditId(area.id); setEditName(area.name); }}>
                  {area.name}
                </div>
              )}
              <button onClick={() => onDeleteArea(area.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded transition-colors hover:text-red-400"
                style={{ color: "var(--color-border)" }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input value={newArea} onChange={(e) => setNewArea(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addArea(); }}
            placeholder="Nueva área…" className="flex-1 text-sm px-3 py-1.5 rounded-lg border outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)", background: "var(--color-bg)" }} />
          <button onClick={addArea} disabled={!newArea.trim()} className="px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors"
            style={{ background: "var(--color-fill)", color: "var(--color-accent)" }}>
            <Plus size={14} />
          </button>
        </div>

        {/* Plano placeholder */}
        <div className="rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed cursor-pointer hover:opacity-80 transition-opacity"
          style={{ height: 140, borderColor: "var(--color-fill-2)", background: "var(--color-bg-2)", color: "var(--color-accent)" }}
          title="Adjuntar plano de la finca (próximamente)">
          <ImageIcon size={24} />
          <span className="text-xs font-medium">Adjuntar plano de la finca</span>
          <span className="text-xs opacity-50">Próximamente</span>
        </div>
      </div>
    </div>
  );
}

// --- Guion Detallado Tab ---
function GuionDetalladoTab({ entries, guestStats, onCreateEntry, onUpdateEntry, onDeleteEntry, onReorderEntries }:
  Pick<ScriptViewProps, "entries" | "areas" | "guestStats" | "onCreateEntry" | "onUpdateEntry" | "onDeleteEntry" | "onReorderEntries">) {
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
      {/* Sidebar */}
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

      {/* Timeline */}
      <div className="flex-1 pl-6 min-w-0">
        {/* Header */}
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

        {/* Entries */}
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

        {/* Add at bottom */}
        <button onClick={addEntry}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium w-full justify-center transition-colors hover:bg-[var(--color-bg-2)]"
          style={{ color: "var(--color-border)", border: "1px dashed var(--color-border)" }}>
          <Plus size={14} />Añadir línea
        </button>
      </div>
    </div>
  );
}

// --- ScriptPanel: pure UI, receives data as props ---
function ScriptPanel({
  entries, areas, guestStats,
  onCreateEntry, onUpdateEntry, onDeleteEntry, onReorderEntries,
  onCreateArea, onUpdateArea, onDeleteArea,
}: ScriptViewProps) {
  const [tab, setTab] = useState<TabType>("resumen");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--color-bg-2)" }}>
          {(["resumen", "guion"] as TabType[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: tab === t ? "white" : "transparent",
                color: tab === t ? "var(--color-text)" : "var(--color-accent)",
                boxShadow: tab === t ? "0 1px 4px rgba(74,60,50,0.08)" : "none",
              }}>
              {t === "resumen" ? "Resumen" : "Guión Detallado"}
            </button>
          ))}
        </div>
        <button onClick={() => alert("Exportación PDF próximamente")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "#866857" }}>
          <FileDown size={14} />Exportar PDF
        </button>
      </div>

      {tab === "resumen" ? (
        <ResumenTab entries={entries} areas={areas} onCreateArea={onCreateArea} onUpdateArea={onUpdateArea} onDeleteArea={onDeleteArea} />
      ) : (
        <GuionDetalladoTab entries={entries} areas={areas} guestStats={guestStats}
          onCreateEntry={onCreateEntry} onUpdateEntry={onUpdateEntry} onDeleteEntry={onDeleteEntry} onReorderEntries={onReorderEntries} />
      )}
    </div>
  );
}

// --- Main export: self-contained, fetches its own data ---
export function ScriptView() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin" size={28} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

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

  return (
    <ScriptPanel
      entries={entries}
      areas={areas}
      guestStats={guestStats}
      onCreateEntry={handleCreateEntry}
      onUpdateEntry={handleUpdateEntry}
      onDeleteEntry={handleDeleteEntry}
      onReorderEntries={handleReorderEntries}
      onCreateArea={handleCreateArea}
      onUpdateArea={handleUpdateArea}
      onDeleteArea={handleDeleteArea}
    />
  );
}
