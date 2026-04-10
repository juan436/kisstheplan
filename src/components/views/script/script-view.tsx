"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { TabType, ScriptViewProps } from "./helpers/script.helpers";
import { ResumenTab } from "./components/resumen-tab";
import { GuionDetalladoTab } from "./components/guion-detallado-tab";
import { useScript } from "./hooks/use-script";

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

export function ScriptView() {
  const {
    entries, areas, guestStats, loading,
    handleCreateEntry, handleUpdateEntry, handleDeleteEntry, handleReorderEntries,
    handleCreateArea, handleUpdateArea, handleDeleteArea,
  } = useScript();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin" size={28} style={{ color: "var(--color-accent)" }} />
      </div>
    );
  }

  return (
    <ScriptPanel
      entries={entries} areas={areas} guestStats={guestStats}
      onCreateEntry={handleCreateEntry} onUpdateEntry={handleUpdateEntry}
      onDeleteEntry={handleDeleteEntry} onReorderEntries={handleReorderEntries}
      onCreateArea={handleCreateArea} onUpdateArea={handleUpdateArea} onDeleteArea={handleDeleteArea}
    />
  );
}
