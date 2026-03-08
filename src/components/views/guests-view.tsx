"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { UserPlus, Upload, Search, Trash2, X, Users, Plus } from "lucide-react";
import { AddGuestModal } from "@/components/features/guests/add-guest-modal";
import type { Guest, GuestGroup, GuestStats, RsvpStatus, GuestRole } from "@/types";
import type { CreateGuestData, UpdateGuestData } from "@/services/api";

const RSVP_FILTERS = [
  { value: "", label: "Todos" },
  { value: "confirmed", label: "Confirmados" },
  { value: "pending", label: "Pendientes" },
  { value: "rejected", label: "Rechazados" },
] as const;

const MEAL_OPTIONS = ["", "Carne", "Pescado", "Vegetariano", "Infantil"];

const ROLE_OPTIONS: { value: GuestRole; label: string }[] = [
  { value: "", label: "—" },
  { value: "groom", label: "Novio" },
  { value: "bride", label: "Novia" },
  { value: "family_groom", label: "Fam. novio" },
  { value: "family_bride", label: "Fam. novia" },
  { value: "child", label: "Niño/a" },
  { value: "baby", label: "Bebé" },
];

const ROLE_LABELS: Record<string, string> = {
  groom: "Novio",
  bride: "Novia",
  family_groom: "Fam. novio",
  family_bride: "Fam. novia",
  child: "Niño/a",
  baby: "Bebé",
};

export default function InvitadosPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [editingCell, setEditingCell] = useState<{ guestId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const loadGroups = useCallback(async () => {
    const groupData = await api.getGuestGroups();
    setGroups(groupData);
  }, []);

  const loadData = useCallback(async () => {
    const filters: Record<string, string> = {};
    if (rsvpFilter) filters.rsvp = rsvpFilter;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    const [guestData, statsData] = await Promise.all([
      api.getGuests(filters),
      api.getGuestStats(),
    ]);
    setGuests(guestData);
    setStats(statsData);
  }, [rsvpFilter, searchQuery]);

  useEffect(() => {
    loadData();
    loadGroups();
  }, [loadData, loadGroups]);

  const handleAddGuest = async (data: CreateGuestData) => {
    await api.createGuest(data);
    await loadData();
  };

  const startEdit = (guestId: string, field: string, currentValue: string) => {
    setEditingCell({ guestId, field });
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    const { guestId, field } = editingCell;

    const updateData: UpdateGuestData = {};
    if (field === "name") {
      const parts = editValue.trim().split(" ");
      updateData.firstName = parts[0] || "";
      updateData.lastName = parts.slice(1).join(" ");
    } else if (field === "email") {
      updateData.email = editValue;
    } else if (field === "dish") {
      updateData.mealChoice = editValue;
    } else if (field === "allergies") {
      updateData.allergies = editValue;
    } else if (field === "rsvp") {
      updateData.rsvpStatus = editValue as RsvpStatus;
    } else if (field === "transport") {
      updateData.transport = editValue === "true";
    } else if (field === "role") {
      updateData.role = editValue as GuestRole;
    }

    try {
      await api.updateGuest(guestId, updateData);
      await loadData();
    } catch {
      // silently fail - data remains unchanged
    }
    cancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGuest(id);
      setDeletingId(null);
      await loadData();
    } catch {
      // silently fail
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    await api.createGuestGroup(newGroupName.trim());
    setNewGroupName("");
    await loadGroups();
  };

  const handleDeleteGroup = async (id: string) => {
    await api.deleteGuestGroup(id);
    setDeletingGroupId(null);
    await Promise.all([loadGroups(), loadData()]);
  };

  const handleAssignGroup = async (guestId: string, groupId: string) => {
    setEditingCell(null);
    // The backend CreateGuestDto has groupId field
    await api.updateGuest(guestId, { groupId: groupId || undefined } as UpdateGuestData);
    await loadData();
  };

  const isEditing = (guestId: string, field: string) =>
    editingCell?.guestId === guestId && editingCell?.field === field;

  const groupMap = new Map(groups.map((g) => [g.id, g.name]));

  // Apply client-side group filter
  const filteredGuests = groupFilter
    ? guests.filter((g) => g.groupId === groupFilter)
    : guests;

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-[28px] text-text mb-1">
            Lista de Invitados
          </h1>
          {stats && (
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="confirmed">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                {stats.confirmed} confirmados
              </Badge>
              <Badge variant="pending">
                <span className="w-2 h-2 rounded-full bg-cta inline-block" />
                {stats.pending} pendientes
              </Badge>
              <Badge variant="rejected">
                <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                {stats.rejected} rechazados
              </Badge>
              <span className="text-[12px] text-brand">
                {stats.total} total
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => setShowGroupsModal(true)}
          >
            <Users size={14} />
            Grupos
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Upload size={14} />
            Importar
          </Button>
          <Button
            variant="cta"
            size="sm"
            className="gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={14} />
            Añadir
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
          <input
            type="text"
            placeholder="Buscar invitado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border rounded-lg pl-9 pr-8 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-brand hover:text-text"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {RSVP_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRsvpFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                rsvpFilter === f.value
                  ? "bg-accent text-white"
                  : "bg-bg2 text-text hover:bg-bg3"
              }`}
            >
              {f.label}
            </button>
          ))}
          {groups.length > 0 && (
            <>
              <span className="text-border mx-1">|</span>
              <button
                onClick={() => setGroupFilter("")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  !groupFilter ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"
                }`}
              >
                Todos
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGroupFilter(g.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    groupFilter === g.id
                      ? "bg-accent text-white"
                      : "bg-bg2 text-text hover:bg-bg3"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Plato</TableHead>
              <TableHead className="hidden md:table-cell">Rol</TableHead>
              <TableHead className="hidden md:table-cell">Grupo</TableHead>
              <TableHead className="hidden lg:table-cell">Alergias</TableHead>
              <TableHead>RSVP</TableHead>
              <TableHead className="hidden lg:table-cell">Transporte</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.map((guest, i) => (
              <TableRow key={guest.id} className="group">
                <TableCell className="text-brand">{i + 1}</TableCell>

                {/* Name - editable */}
                <TableCell
                  className="font-medium cursor-pointer"
                  onClick={() => !isEditing(guest.id, "name") && startEdit(guest.id, "name", guest.name)}
                >
                  {isEditing(guest.id, "name") ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"
                    />
                  ) : (
                    guest.name
                  )}
                </TableCell>

                {/* Email - editable */}
                <TableCell
                  className="hidden md:table-cell text-brand cursor-pointer"
                  onClick={() => !isEditing(guest.id, "email") && startEdit(guest.id, "email", guest.email)}
                >
                  {isEditing(guest.id, "email") ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"
                    />
                  ) : (
                    guest.email || "—"
                  )}
                </TableCell>

                {/* Dish - editable select */}
                <TableCell
                  className="cursor-pointer"
                  onClick={() => !isEditing(guest.id, "dish") && startEdit(guest.id, "dish", guest.dish)}
                >
                  {isEditing(guest.id, "dish") ? (
                    <select
                      autoFocus
                      value={editValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingCell(null);
                        api.updateGuest(guest.id, { mealChoice: val }).then(loadData);
                      }}
                      onBlur={cancelEdit}
                      className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"
                    >
                      {MEAL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt || "—"}</option>
                      ))}
                    </select>
                  ) : (
                    guest.dish || "—"
                  )}
                </TableCell>

                {/* Role - editable select */}
                <TableCell
                  className="hidden md:table-cell cursor-pointer"
                  onClick={() => !isEditing(guest.id, "role") && startEdit(guest.id, "role", guest.role)}
                >
                  {isEditing(guest.id, "role") ? (
                    <select
                      autoFocus
                      value={editValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingCell(null);
                        api.updateGuest(guest.id, { role: val as GuestRole }).then(loadData);
                      }}
                      onBlur={cancelEdit}
                      className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-[12px] ${guest.role ? "text-text" : "text-brand"}`}>
                      {ROLE_LABELS[guest.role] || "—"}
                    </span>
                  )}
                </TableCell>

                {/* Group - editable select */}
                <TableCell
                  className="hidden md:table-cell cursor-pointer"
                  onClick={() => !isEditing(guest.id, "group") && startEdit(guest.id, "group", guest.groupId || "")}
                >
                  {isEditing(guest.id, "group") ? (
                    <select
                      autoFocus
                      value={editValue}
                      onChange={(e) => {
                        handleAssignGroup(guest.id, e.target.value);
                      }}
                      onBlur={cancelEdit}
                      className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none"
                    >
                      <option value="">Sin grupo</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-[12px] ${guest.groupId ? "text-text" : "text-brand"}`}>
                      {(guest.groupId && groupMap.get(guest.groupId)) || "—"}
                    </span>
                  )}
                </TableCell>

                {/* Allergies - editable */}
                <TableCell
                  className="hidden lg:table-cell text-brand cursor-pointer"
                  onClick={() => !isEditing(guest.id, "allergies") && startEdit(guest.id, "allergies", guest.allergies)}
                >
                  {isEditing(guest.id, "allergies") ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"
                    />
                  ) : (
                    guest.allergies || "—"
                  )}
                </TableCell>

                {/* RSVP - editable select */}
                <TableCell
                  className="cursor-pointer"
                  onClick={() => !isEditing(guest.id, "rsvp") && startEdit(guest.id, "rsvp", guest.rsvp)}
                >
                  {isEditing(guest.id, "rsvp") ? (
                    <select
                      autoFocus
                      value={editValue}
                      onChange={(e) => {
                        const val = e.target.value as RsvpStatus;
                        setEditingCell(null);
                        api.updateGuest(guest.id, { rsvpStatus: val }).then(loadData);
                      }}
                      onBlur={cancelEdit}
                      className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  ) : (
                    <RsvpDot status={guest.rsvp} />
                  )}
                </TableCell>

                {/* Transport */}
                <TableCell className="hidden lg:table-cell">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={guest.transport}
                      onChange={(e) => {
                        api.updateGuest(guest.id, { transport: e.target.checked }).then(loadData);
                      }}
                      className="w-3.5 h-3.5 rounded border-border text-cta focus:ring-cta accent-cta"
                    />
                  </label>
                </TableCell>

                {/* Delete */}
                <TableCell>
                  {deletingId === guest.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-[11px] text-danger font-medium hover:underline"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-[11px] text-brand hover:underline"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(guest.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-brand hover:text-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredGuests.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-brand text-[14px]">
                  {searchQuery || rsvpFilter || groupFilter
                    ? "No se encontraron invitados con esos filtros"
                    : "No hay invitados aún. Añade el primero."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Guest Modal */}
      <AddGuestModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGuest}
      />

      {/* Groups Management Modal */}
      <Modal open={showGroupsModal} onClose={() => setShowGroupsModal(false)} className="max-w-md">
        <h2 className="font-display text-[22px] text-text mb-4">Gestionar Grupos</h2>
        <p className="text-[13px] text-brand mb-4">
          Crea grupos para organizar invitados por familia o pareja.
        </p>

        {/* Create new group */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
            placeholder="Nombre del grupo (ej: Familia García)"
            className="flex-1 bg-bg2 border border-border rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta"
          />
          <Button
            variant="cta"
            size="sm"
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim()}
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Group list */}
        {groups.length === 0 ? (
          <p className="text-[13px] text-brand text-center py-4">No hay grupos creados aún</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {groups.map((group) => {
              const memberCount = guests.filter((g) => g.groupId === group.id).length;
              return (
                <div
                  key={group.id}
                  className="flex items-center justify-between bg-bg2 rounded-lg px-3 py-2.5"
                >
                  <div>
                    <span className="text-[14px] font-medium text-text">{group.name}</span>
                    <span className="text-[12px] text-brand ml-2">
                      {memberCount} {memberCount === 1 ? "invitado" : "invitados"}
                    </span>
                  </div>
                  {deletingGroupId === group.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-[12px] text-danger font-medium hover:underline"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => setDeletingGroupId(null)}
                        className="text-[12px] text-brand hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingGroupId(group.id)}
                      className="text-brand hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="ghost" onClick={() => setShowGroupsModal(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function RsvpDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    confirmed: "bg-success",
    pending: "bg-cta",
    rejected: "bg-danger",
  };
  const labels: Record<string, string> = {
    confirmed: "Confirmado",
    pending: "Pendiente",
    rejected: "Rechazado",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />
      <span className="text-[12px]">{labels[status]}</span>
    </div>
  );
}
