"use client";

import { api } from "@/services";
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { Guest, GuestGroup, GuestRole, RsvpStatus } from "@/types";
import type { UpdateGuestData } from "@/services/api";
import { ROLE_OPTIONS, ROLE_LABELS, type ColKey } from "./guests-constants";

function RsvpDot({ status }: { status: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    confirmed: { color: "bg-success", label: "Confirmado" },
    pending:   { color: "bg-cta",     label: "Pendiente"  },
    rejected:  { color: "bg-danger",  label: "Rechazado"  },
  };
  const { color, label } = cfg[status] ?? { color: "bg-brand", label: status };
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-[12px]">{label}</span>
    </div>
  );
}

interface GuestsTableProps {
  filteredGuests: Guest[]; groups: GuestGroup[]; groupMap: Map<string, string>;
  mealOptions: string[];
  show: (col: ColKey) => boolean;
  isEditing: (guestId: string, field: string) => boolean;
  editValue: string; setEditValue: (v: string) => void;
  startEdit: (guestId: string, field: string, val: string) => void;
  cancelEdit: () => void; saveEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  deletingId: string | null; setDeletingId: (id: string | null) => void;
  handleDelete: (id: string) => void;
  handleAssignGroup: (guestId: string, groupId: string) => void;
  getFirst: (g: Guest) => string; getLast: (g: Guest) => string;
  loadData: () => void;
  searchQuery: string; rsvpFilter: string; groupFilter: string;
}

export function GuestsTable({ filteredGuests, groups, groupMap, mealOptions, show, isEditing, editValue, setEditValue, startEdit, cancelEdit, saveEdit, handleKeyDown, deletingId, setDeletingId, handleDelete, handleAssignGroup, getFirst, getLast, loadData, searchQuery, rsvpFilter, groupFilter }: GuestsTableProps) {
  const EditCell = ({ guestId, field, value, className = "" }: { guestId: string; field: string; value: string; className?: string }) => (
    <TableCell className={`cursor-pointer ${className}`} onClick={() => !isEditing(guestId, field) && startEdit(guestId, field, value)}>
      {isEditing(guestId, field) ? (
        <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit} onKeyDown={handleKeyDown}
          className="w-full bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none" />
      ) : (value || "—")}
    </TableCell>
  );

  return (
    <div className="bg-white rounded-xl border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Nombre</TableHead>
            {show("lastName")  && <TableHead>Apellidos</TableHead>}
            {show("email")     && <TableHead className="hidden md:table-cell">@</TableHead>}
            <TableHead>Plato</TableHead>
            {show("allergies") && <TableHead className="hidden lg:table-cell">Alergias</TableHead>}
            {show("address")   && <TableHead className="hidden lg:table-cell">Dirección</TableHead>}
            {show("transport") && <TableHead className="hidden lg:table-cell">Transporte</TableHead>}
            {show("list")      && <TableHead className="hidden lg:table-cell">Lista</TableHead>}
            {show("role")      && <TableHead className="hidden md:table-cell">Rol</TableHead>}
            {show("group")     && <TableHead className="hidden md:table-cell">Grupo</TableHead>}
            <TableHead>RSVP</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.map((guest, i) => (
            <TableRow key={guest.id} className="group">
              <TableCell className="text-brand text-[12px]">{i + 1}</TableCell>
              <EditCell guestId={guest.id} field="firstName" value={getFirst(guest)} className="font-medium" />
              {show("lastName") && <EditCell guestId={guest.id} field="lastName" value={getLast(guest)} className="text-brand" />}
              {show("email") && <EditCell guestId={guest.id} field="email" value={guest.email} className="hidden md:table-cell text-brand" />}
              <TableCell className="cursor-pointer" onClick={() => !isEditing(guest.id, "dish") && startEdit(guest.id, "dish", guest.dish)}>
                {isEditing(guest.id, "dish") ? (
                  <select autoFocus value={editValue}
                    onChange={(e) => { api.updateGuest(guest.id, { mealChoice: e.target.value }).then(loadData); cancelEdit(); }}
                    onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none">
                    <option value="">—</option>
                    {mealOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (guest.dish || "—")}
              </TableCell>
              {show("allergies") && <EditCell guestId={guest.id} field="allergies" value={guest.allergies} className="hidden lg:table-cell text-brand" />}
              {show("address")   && <EditCell guestId={guest.id} field="address" value={guest.address ?? ""} className="hidden lg:table-cell text-brand" />}
              {show("transport") && (
                <TableCell className="hidden lg:table-cell">
                  <input type="checkbox" checked={guest.transport}
                    onChange={(e) => api.updateGuest(guest.id, { transport: e.target.checked }).then(loadData)}
                    className="w-3.5 h-3.5 rounded border-border accent-cta cursor-pointer" />
                </TableCell>
              )}
              {show("list") && (
                <TableCell className="hidden lg:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "list") && startEdit(guest.id, "list", guest.listName ?? "A")}>
                  {isEditing(guest.id, "list") ? (
                    <select autoFocus value={editValue}
                      onChange={(e) => { api.updateGuest(guest.id, { listName: e.target.value } as UpdateGuestData).then(loadData); cancelEdit(); }}
                      onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">
                      <option value="A">Lista A</option><option value="B">Lista B</option>
                    </select>
                  ) : <span className="text-[12px] px-2 py-0.5 bg-bg2 rounded-full">{guest.listName ?? "A"}</span>}
                </TableCell>
              )}
              {show("role") && (
                <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "role") && startEdit(guest.id, "role", guest.role)}>
                  {isEditing(guest.id, "role") ? (
                    <select autoFocus value={editValue}
                      onChange={(e) => { api.updateGuest(guest.id, { role: e.target.value as GuestRole }).then(loadData); cancelEdit(); }}
                      onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">
                      {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : <span className="text-[12px]">{ROLE_LABELS[guest.role] || "—"}</span>}
                </TableCell>
              )}
              {show("group") && (
                <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => !isEditing(guest.id, "group") && startEdit(guest.id, "group", guest.groupId ?? "")}>
                  {isEditing(guest.id, "group") ? (
                    <select autoFocus value={editValue}
                      onChange={(e) => handleAssignGroup(guest.id, e.target.value)}
                      onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">
                      <option value="">Sin grupo</option>
                      {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  ) : <span className="text-[12px]">{(guest.groupId && groupMap.get(guest.groupId)) || "—"}</span>}
                </TableCell>
              )}
              <TableCell className="cursor-pointer" onClick={() => !isEditing(guest.id, "rsvp") && startEdit(guest.id, "rsvp", guest.rsvp)}>
                {isEditing(guest.id, "rsvp") ? (
                  <select autoFocus value={editValue}
                    onChange={(e) => { api.updateGuest(guest.id, { rsvpStatus: e.target.value as RsvpStatus }).then(loadData); cancelEdit(); }}
                    onBlur={cancelEdit} className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none">
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                ) : <RsvpDot status={guest.rsvp} />}
              </TableCell>
              <TableCell>
                {deletingId === guest.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(guest.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                    <button onClick={() => setDeletingId(null)} className="text-[11px] text-brand hover:underline">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDeletingId(guest.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand hover:text-danger">
                    <Trash2 size={14} />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {filteredGuests.length === 0 && (
            <TableRow>
              <TableCell colSpan={14} className="text-center py-12 text-brand text-[14px]">
                {searchQuery || rsvpFilter || groupFilter
                  ? "No se encontraron invitados con esos filtros"
                  : "No hay invitados aún. Usa el botón 'Añadir invitado' para empezar."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
