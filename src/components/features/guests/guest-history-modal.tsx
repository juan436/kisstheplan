"use client";

import type { GuestHistory, AuditEntry } from "@/services/api";

const FIELD_LABELS: Record<string, string> = {
  rsvpStatus: "RSVP", mealChoice: "Plato", allergies: "Alergias",
  transport: "Transporte", transportPickupPoint: "Punto de recogida",
  firstName: "Nombre", lastName: "Apellidos", email: "Email",
  listName: "Lista", role: "Rol", notes: "Notas", address: "Dirección",
};

function formatVal(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
}

function SourceBadge({ source, changedBy }: { source: AuditEntry["source"]; changedBy?: string }) {
  if (source === "GUEST_WEB") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-bg2 border border-border text-accent">
        🌐 Respuesta del Invitado (Web)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-cta text-accent">
      ⚙️ Modificado{changedBy ? ` por ${changedBy}` : ""} (Panel)
    </span>
  );
}

function AuditEntryCard({ entry }: { entry: AuditEntry }) {
  const date = new Date(entry.timestamp).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  return (
    <div className="relative pl-4 pb-4 border-l-2 border-border last:pb-0">
      <span className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-brand border-2 border-bg" />
      <div className="flex items-center gap-2 mb-1">
        <SourceBadge source={entry.source} changedBy={entry.changedBy} />
        <span className="text-[11px] text-brand">{date}</span>
      </div>
      {entry.changes.length === 0 && (
        <p className="text-[12px] text-brand italic">Sin cambios de campo registrados.</p>
      )}
      {entry.changes.map((c, i) => (
        <div key={i} className="flex flex-wrap items-center gap-x-2 text-[12px] mt-0.5">
          <span className="font-medium text-text">{FIELD_LABELS[c.field] ?? c.field}:</span>
          <span className="line-through text-danger">{formatVal(c.oldValue)}</span>
          <span className="text-success font-medium">{formatVal(c.newValue)}</span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  history: GuestHistory | null;
  loading: boolean;
  sortedLog: AuditEntry[];
  overriddenFields: Set<string>;
}

export function GuestHistoryModal({ open, onClose, history, loading, sortedLog, overriddenFields }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-text/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg rounded-2xl shadow-elevated w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-playfair text-[18px] text-text">
            Historial de Cambios{history ? ` — ${history.name}` : ""}
          </h2>
          <button onClick={onClose} className="text-brand hover:text-accent text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading && <p className="text-center text-brand text-[14px]">Cargando historial…</p>}
          {!loading && sortedLog.length === 0 && (
            <p className="text-center text-brand text-[14px] py-8">Sin historial de cambios registrado.</p>
          )}
          {!loading && overriddenFields.size > 0 && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-cta/10 border border-cta/30 text-[12px] text-accent">
              ⚠️ Campos modificados manualmente después de la respuesta del invitado:{" "}
              <strong>{Array.from(overriddenFields).map((f) => FIELD_LABELS[f] ?? f).join(", ")}</strong>
            </div>
          )}
          {!loading && sortedLog.length > 0 && (
            <div className="space-y-4">
              {sortedLog.map((entry) => <AuditEntryCard key={entry.id} entry={entry} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
