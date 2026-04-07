"use client";

import { api } from "@/services";
import { TableRow, TableCell } from "@/components/ui/table";
import { Trash2, History } from "lucide-react";
import type { Guest, GuestGroup, GuestRole, RsvpStatus } from "@/types";
import type { UpdateGuestData } from "@/services/api";
import { ROLE_OPTIONS, ROLE_LABELS, type ColKey } from "../constants/guests.constants";
import { TableMultiSelect, MultiSelectDisplay } from "@/components/features/guests/multi-select-chips";

const RSVP_CFG: Record<string, { color: string; label: string }> = {
  confirmed: { color: "bg-success", label: "Confirmado" },
  pending:   { color: "bg-cta",     label: "Pendiente"  },
  rejected:  { color: "bg-danger",  label: "Rechazado"  },
};

export interface GuestRowProps {
  guest: Guest; index: number;
  groups: GuestGroup[]; groupMap: Map<string, string>;
  mealOptions: string[]; allergyOptions: string[]; transportPoints: string[];
  show: (col: ColKey) => boolean;
  isEditing: (guestId: string, field: string) => boolean;
  editValue: string; setEditValue: (v: string) => void;
  startEdit: (guestId: string, field: string, val: string) => void;
  cancelEdit: () => void; saveEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  deletingId: string | null; setDeletingId: (id: string | null) => void;
  handleDelete: (id: string) => void;
  handleAssignGroup: (guestId: string, groupId: string) => void;
  onHistoryClick: (guestId: string) => void;
  getFirst: (g: Guest) => string; getLast: (g: Guest) => string;
  loadData: () => void;
}

function EC({ guestId, field, value, isEditing, startEdit, editValue, setEditValue, saveEdit, handleKeyDown, className = "" }: { guestId: string; field: string; value: string; isEditing: (a: string, b: string) => boolean; startEdit: (a: string, b: string, c: string) => void; editValue: string; setEditValue: (v: string) => void; saveEdit: () => void; handleKeyDown: (e: React.KeyboardEvent) => void; className?: string }) {
  return (
    <TableCell className={`cursor-pointer ${className}`} onClick={() => !isEditing(guestId, field) && startEdit(guestId, field, value)}>
      {isEditing(guestId, field)
        ? <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveEdit} onKeyDown={handleKeyDown} className="w-full bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none" />
        : (value || "—")}
    </TableCell>
  );
}

export function GuestTableRow({ guest, index, groups, groupMap, mealOptions, allergyOptions, transportPoints, show, isEditing, editValue, setEditValue, startEdit, cancelEdit, saveEdit, handleKeyDown, deletingId, setDeletingId, handleDelete, handleAssignGroup, onHistoryClick, getFirst, getLast, loadData }: GuestRowProps) {
  const ecProps = { isEditing, startEdit, editValue, setEditValue, saveEdit, handleKeyDown };
  const { color, label } = RSVP_CFG[guest.rsvp] ?? { color: "bg-brand", label: guest.rsvp };
  return (
    <TableRow className="group">
      <TableCell className="text-brand text-[12px]">{index + 1}</TableCell>
      <EC guestId={guest.id} field="firstName" value={getFirst(guest)} className="font-medium" {...ecProps} />
      {show("lastName") && <EC guestId={guest.id} field="lastName" value={getLast(guest)} className="text-brand" {...ecProps} />}
      {show("email") && <EC guestId={guest.id} field="email" value={guest.email} className="hidden md:table-cell text-brand" {...ecProps} />}
      <TableCell className="cursor-pointer" onClick={() => !isEditing(guest.id, "dish") && startEdit(guest.id, "dish", guest.dish)}>
        {isEditing(guest.id, "dish") ? <TableMultiSelect initialValue={editValue} options={mealOptions} onSave={(v) => { api.updateGuest(guest.id, { mealChoice: v }).then(loadData); cancelEdit(); }} onCancel={cancelEdit} /> : <MultiSelectDisplay value={guest.dish} />}
      </TableCell>
      {show("allergies") && (
        <TableCell className="hidden lg:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "allergies") && startEdit(guest.id, "allergies", guest.allergies)}>
          {isEditing(guest.id, "allergies") ? <TableMultiSelect initialValue={editValue} options={allergyOptions} onSave={(v) => { api.updateGuest(guest.id, { allergies: v }).then(loadData); cancelEdit(); }} onCancel={cancelEdit} /> : <MultiSelectDisplay value={guest.allergies} />}
        </TableCell>
      )}
      {show("address") && <EC guestId={guest.id} field="address" value={guest.address ?? ""} className="hidden lg:table-cell text-brand" {...ecProps} />}
      {show("transport") && (
        <TableCell className="hidden lg:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "transport") && startEdit(guest.id, "transport", guest.transportPickupPoint || (guest.transport ? "yes" : ""))}>
          {isEditing(guest.id, "transport")
            ? <select autoFocus value={editValue} onChange={(e) => { const v = e.target.value; api.updateGuest(guest.id, { transport: v !== "", transportPickupPoint: v === "yes" ? "" : v }).then(loadData); cancelEdit(); }} onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"><option value="">No</option><option value="yes">Sí</option>{transportPoints.map((p) => <option key={p} value={p}>{p}</option>)}</select>
            : <span className="text-[13px]">{guest.transportPickupPoint || (guest.transport ? "Sí" : "No")}</span>}
        </TableCell>
      )}
      {show("list") && (
        <TableCell className="hidden lg:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "list") && startEdit(guest.id, "list", guest.listName ?? "A")}>
          {isEditing(guest.id, "list") ? <select autoFocus value={editValue} onChange={(e) => { api.updateGuest(guest.id, { listName: e.target.value } as UpdateGuestData).then(loadData); cancelEdit(); }} onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none"><option value="A">Lista A</option><option value="B">Lista B</option></select> : <span className="text-[12px] px-2 py-0.5 bg-bg2 rounded-full">{guest.listName ?? "A"}</span>}
        </TableCell>
      )}
      {show("role") && (
        <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "role") && startEdit(guest.id, "role", guest.role)}>
          {isEditing(guest.id, "role") ? <select autoFocus value={editValue} onChange={(e) => { api.updateGuest(guest.id, { role: e.target.value as GuestRole }).then(loadData); cancelEdit(); }} onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">{ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : <span className="text-[12px]">{ROLE_LABELS[guest.role] || "—"}</span>}
        </TableCell>
      )}
      {show("group") && (
        <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "group") && startEdit(guest.id, "group", guest.groupId ?? "")}>
          {isEditing(guest.id, "group") ? <select autoFocus value={editValue} onChange={(e) => handleAssignGroup(guest.id, e.target.value)} onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none"><option value="">Sin grupo</option>{groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
            : guest.groupId && groupMap.get(guest.groupId) ? <span className="inline-block max-w-[140px] truncate text-[11px] px-2 py-0.5 rounded-full font-medium bg-bg3 text-accent border border-border/50">{groupMap.get(guest.groupId)}</span> : <span className="text-[12px] text-brand">—</span>}
        </TableCell>
      )}
      <TableCell className="cursor-pointer" onClick={() => !isEditing(guest.id, "rsvp") && startEdit(guest.id, "rsvp", guest.rsvp)}>
        {isEditing(guest.id, "rsvp") ? <select autoFocus value={editValue} onChange={(e) => { api.updateGuest(guest.id, { rsvpStatus: e.target.value as RsvpStatus }).then(loadData); cancelEdit(); }} onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"><option value="pending">Pendiente</option><option value="confirmed">Confirmado</option><option value="rejected">Rechazado</option></select>
          : <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${color}`} /><span className="text-[12px]">{label}</span></div>}
      </TableCell>
      <TableCell>
        {deletingId === guest.id ? (
          <div className="flex items-center gap-1">
            <button onClick={() => handleDelete(guest.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
            <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onHistoryClick(guest.id)} className="text-brand hover:text-accent" title="Ver Historial"><History size={13} /></button>
            <button onClick={() => setDeletingId(guest.id)} className="text-brand hover:text-danger"><Trash2 size={14} /></button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
