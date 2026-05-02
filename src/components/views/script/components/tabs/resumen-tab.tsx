"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Settings2 } from "lucide-react";
import type { ScriptViewProps } from "../../helpers/script.helpers";
import { sortEntries, formatTimeDisplay } from "../../helpers/script.helpers";

type ResumenTabProps = Pick<ScriptViewProps, "entries" | "areas" | "onCreateArea" | "onUpdateArea" | "onDeleteArea">;

type VisibleFields = { description: boolean };

export function ResumenTab({ entries, areas, onCreateArea, onUpdateArea, onDeleteArea }: ResumenTabProps) {
  const [newArea, setNewArea] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [visible, setVisible] = useState<VisibleFields>({ description: true });
  const timedEntries = sortEntries(entries).filter((e) => e.timeType !== "none" && e.timeStart && !e.isPrivate);

  const addArea = async () => { if (!newArea.trim()) return; await onCreateArea({ name: newArea.trim() }); setNewArea(""); };
  const toggleField = (field: keyof VisibleFields) => setVisible((v) => ({ ...v, [field]: !v[field] }));

  return (
    <div className="mx-auto mt-6" style={{ maxWidth: 860 }}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-text)" }}>Horarios</h2>
          <div className="relative">
            <button onClick={() => setShowFieldMenu((v) => !v)} title="Configurar campos"
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: showFieldMenu ? "var(--color-accent)" : "var(--color-border)" }}>
              <Settings2 size={15} />
            </button>
            {showFieldMenu && (
              <div className="absolute right-0 top-8 z-10 rounded-xl shadow-[var(--shadow-dropdown)] border p-3 min-w-[160px]"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text)" }}>Mostrar campos</p>
                {(Object.keys(visible) as (keyof VisibleFields)[]).map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input type="checkbox" checked={visible[field]} onChange={() => toggleField(field)}
                      className="accent-[var(--color-accent)] w-3.5 h-3.5" />
                    <span className="text-xs capitalize" style={{ color: "var(--color-text)" }}>
                      {field === "description" ? "Descripción" : field}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        {timedEntries.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-accent)" }}>Sin horarios. Añádelos en el Guión Detallado.</p>
        ) : (
          <div className="space-y-3">
            {timedEntries.map((e) => (
              <div key={e.id} className="flex items-start gap-4">
                <span className="text-sm font-semibold tabular-nums flex-shrink-0 w-28" style={{ color: "var(--color-cta)" }}>{formatTimeDisplay(e)}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{e.title}</div>
                  {visible.description && e.description && (
                    <div className="text-xs mt-0.5 whitespace-pre-wrap" style={{ color: "var(--color-accent)" }}>{e.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
        <div className="rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed cursor-pointer hover:opacity-80 transition-opacity"
          style={{ height: 140, borderColor: "var(--color-fill-2)", background: "var(--color-bg-2)", color: "var(--color-accent)" }}
          title="Adjuntar plano de la finca (próximamente)">
          <ImageIcon size={24} />
          <span className="text-xs font-medium">Adjuntar plano de la finca</span>
          <span className="text-xs opacity-50">Próximamente</span>
        </div>
      </div>
    </div>
    </div>
  );
}
