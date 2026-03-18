"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/services";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell,
} from "@/components/ui/table";
import {
  UserPlus, Upload, Search, Trash2, X,
  Users, Plus, SlidersHorizontal, Columns,
} from "lucide-react";
import { AddGuestModal } from "@/components/features/guests/add-guest-modal";
import type { Guest, GuestGroup, GuestStats, RsvpStatus, GuestRole } from "@/types";
import type { CreateGuestData, UpdateGuestData } from "@/services/api";

/* ─── Constants ──────────────────────────────────────────────── */

const RSVP_FILTERS = [
  { value: "", label: "Todos" },
  { value: "confirmed", label: "Confirmados" },
  { value: "pending",   label: "Pendientes" },
  { value: "rejected",  label: "Rechazados" },
] as const;

const ROLE_OPTIONS: { value: GuestRole; label: string }[] = [
  { value: "", label: "—" },
  { value: "groom",        label: "Novio" },
  { value: "bride",        label: "Novia" },
  { value: "family_groom", label: "Fam. novio" },
  { value: "family_bride", label: "Fam. novia" },
  { value: "child",        label: "Niño/a" },
  { value: "baby",         label: "Bebé" },
];
const ROLE_LABELS: Record<string, string> = {
  groom: "Novio", bride: "Novia",
  family_groom: "Fam. novio", family_bride: "Fam. novia",
  child: "Niño/a", baby: "Bebé",
};

type ColKey = "lastName" | "email" | "role" | "group" | "allergies" | "address" | "transport" | "list";
const ALL_COLS: { key: ColKey; label: string }[] = [
  { key: "lastName",  label: "Apellidos" },
  { key: "email",     label: "Email" },
  { key: "role",      label: "Rol" },
  { key: "group",     label: "Grupo" },
  { key: "allergies", label: "Alergias" },
  { key: "address",   label: "Dirección" },
  { key: "list",      label: "Lista" },
  { key: "transport", label: "Transporte" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function InvitadosPage() {
  const [guests,   setGuests]   = useState<Guest[]>([]);
  const [groups,   setGroups]   = useState<GuestGroup[]>([]);
  const [stats,    setStats]    = useState<GuestStats | null>(null);
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [rsvpFilter,   setRsvpFilter]   = useState("");
  const [groupFilter,  setGroupFilter]  = useState("");
  const [editingCell,  setEditingCell]  = useState<{ guestId: string; field: string } | null>(null);
  const [editValue,    setEditValue]    = useState("");
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [showColMenu,  setShowColMenu]  = useState(false);
  const [hiddenCols,   setHiddenCols]   = useState<Set<ColKey>>(new Set(["address", "role", "group"]));

  // Quick Add popover
  const [showQuickAdd,  setShowQuickAdd]  = useState(false);
  const [quickName,     setQuickName]     = useState("");
  const [quickGroupId,  setQuickGroupId]  = useState("");
  const [quickSaving,   setQuickSaving]   = useState(false);
  const quickAddRef = useRef<HTMLDivElement>(null);

  // Config options
  const [mealOptions,     setMealOptions]     = useState(["Carne", "Pescado", "Vegetariano", "Infantil"]);
  const [allergyOptions,  setAllergyOptions]  = useState(["Gluten", "Lactosa", "Frutos secos", "Marisco"]);
  const [transportPoints, setTransportPoints] = useState<string[]>([]);

  const colMenuRef = useRef<HTMLDivElement>(null);

  const show = (col: ColKey) => !hiddenCols.has(col);
  const toggleCol = (col: ColKey) =>
    setHiddenCols((prev) => { const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n; });

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) setShowColMenu(false);
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) setShowQuickAdd(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadGroups = useCallback(async () => {
    setGroups(await api.getGuestGroups());
  }, []);

  const loadData = useCallback(async () => {
    const filters: Record<string, string> = {};
    if (rsvpFilter) filters.rsvp = rsvpFilter;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    const [guestData, statsData] = await Promise.all([api.getGuests(filters), api.getGuestStats()]);
    setGuests(guestData);
    setStats(statsData);
  }, [rsvpFilter, searchQuery]);

  useEffect(() => { loadData(); loadGroups(); }, [loadData, loadGroups]);

  const handleAddGuest = async (data: CreateGuestData) => { await api.createGuest(data); await loadData(); };

  // Quick Add
  const handleQuickAdd = async () => {
    const name = quickName.trim();
    if (!name) return;
    setQuickSaving(true);
    const parts = name.split(" ");
    await api.createGuest({
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
      rsvpStatus: "pending",
      listName: "A",
      groupId: quickGroupId || undefined,
    });
    setQuickName("");
    setQuickGroupId("");
    setQuickSaving(false);
    await loadData();
  };

  // Inline edit
  const startEdit = (guestId: string, field: string, val: string) => { setEditingCell({ guestId, field }); setEditValue(val); };
  const cancelEdit = () => { setEditingCell(null); setEditValue(""); };
  const isEditing  = (guestId: string, field: string) => editingCell?.guestId === guestId && editingCell?.field === field;

  const saveEdit = async () => {
    if (!editingCell) return;
    const { guestId, field } = editingCell;
    const u: UpdateGuestData = {};
    if      (field === "firstName")  u.firstName  = editValue;
    else if (field === "lastName")   u.lastName   = editValue;
    else if (field === "email")      u.email      = editValue;
    else if (field === "dish")       u.mealChoice = editValue;
    else if (field === "allergies")  u.allergies  = editValue;
    else if (field === "address")    (u as Record<string,unknown>).address = editValue;
    else if (field === "rsvp")       u.rsvpStatus = editValue as RsvpStatus;
    else if (field === "transport")  u.transport  = editValue === "true";
    else if (field === "role")       u.role       = editValue as GuestRole;
    else if (field === "list")       u.listName   = editValue;
    try { await api.updateGuest(guestId, u); await loadData(); } catch { /**/ }
    cancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
    else if (e.key === "Escape") cancelEdit();
  };

  const handleDelete = async (id: string) => {
    try { await api.deleteGuest(id); setDeletingId(null); await loadData(); } catch { /**/ }
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
    await api.updateGuest(guestId, { groupId: groupId || undefined } as UpdateGuestData);
    await loadData();
  };

  const groupMap = new Map(groups.map((g) => [g.id, g.name]));
  const filteredGuests = groupFilter ? guests.filter((g) => g.groupId === groupFilter) : guests;

  /* ── Helper: get first/last name from guest ── */
  const getFirst = (g: Guest) => g.name.split(" ")[0] ?? g.name;
  const getLast  = (g: Guest) => g.lastName ?? g.name.split(" ").slice(1).join(" ");

  /* ── Inline edit cell ── */
  const EditCell = ({
    guestId, field, value, className = "",
  }: { guestId: string; field: string; value: string; className?: string }) => (
    <TableCell
      className={`cursor-pointer ${className}`}
      onClick={() => !isEditing(guestId, field) && startEdit(guestId, field, value)}
    >
      {isEditing(guestId, field) ? (
        <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit} onKeyDown={handleKeyDown}
          className="w-full bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none" />
      ) : (value || "—")}
    </TableCell>
  );

  return (
    <div className="max-w-[1300px] mx-auto">

      {/* ── Stats Boxes ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatBox label="Invitados"              value={stats.total}     color="text-text" />
          <StatBox label="Confirmado asistencia"  value={stats.confirmed} color="text-success" />
          <StatBox label="Rechazado asistencia"   value={stats.rejected}  color="text-danger" />
          <StatBox label="Pendientes de confirmar" value={stats.pending}  color="text-cta" />
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Left: Quick Add + full modal */}
        <div className="flex items-center gap-2">
          {/* Quick Add */}
          <div className="relative" ref={quickAddRef}>
            <Button variant="cta" size="sm" className="gap-2" onClick={() => setShowQuickAdd((v) => !v)}>
              <UserPlus size={14} />
              Añadir invitado
            </Button>
            {showQuickAdd && (
              <div className="absolute left-0 top-10 z-30 bg-white border border-border rounded-xl shadow-dropdown p-4 w-72 animate-fade-in">
                <p className="text-[12px] font-semibold text-text/50 uppercase tracking-wider mb-3">Alta rápida</p>
                <input
                  autoFocus
                  placeholder="Nombre del invitado"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleQuickAdd(); }}
                  className="w-full bg-[#f2efe9] border-none rounded-xl px-4 py-2.5 text-[13px] text-text placeholder:text-text/30 outline-none focus:ring-2 focus:ring-cta/30 mb-2"
                />
                {groups.length > 0 && (
                  <select
                    value={quickGroupId}
                    onChange={(e) => setQuickGroupId(e.target.value)}
                    className="w-full bg-[#f2efe9] border-none rounded-xl px-4 py-2.5 text-[13px] text-text outline-none mb-3"
                  >
                    <option value="">Sin grupo</option>
                    {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text/30">Enter para guardar</span>
                  <button
                    onClick={handleQuickAdd}
                    disabled={!quickName.trim() || quickSaving}
                    className="px-4 py-1.5 bg-[#CBA978] hover:bg-[#b08f5d] disabled:opacity-40 text-white text-[12px] font-bold rounded-lg transition-colors"
                  >
                    {quickSaving ? "..." : "Guardar"}
                  </button>
                </div>
                <div className="border-t border-border mt-3 pt-3">
                  <button
                    onClick={() => { setShowQuickAdd(false); setShowAddModal(true); }}
                    className="text-[12px] text-cta hover:underline font-medium"
                  >
                    Formulario completo →
                  </button>
                </div>
              </div>
            )}
          </div>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowGroupsModal(true)}>
            <Users size={14} />
            Grupos
          </Button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowConfigModal(true)}>
            <SlidersHorizontal size={14} />
            Platos/Restricciones
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Upload size={14} />
            Importar excel
          </Button>
        </div>
      </div>

      {/* ── Filters + Column toggle ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
          <input
            type="text" placeholder="Buscar invitado..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border rounded-lg pl-9 pr-8 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-brand hover:text-text">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {RSVP_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setRsvpFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${rsvpFilter === f.value ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>
              {f.label}
            </button>
          ))}
          {groups.length > 0 && (
            <>
              <span className="text-border mx-1">|</span>
              <button onClick={() => setGroupFilter("")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${!groupFilter ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>
                Todos
              </button>
              {groups.map((g) => (
                <button key={g.id} onClick={() => setGroupFilter(g.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${groupFilter === g.id ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>
                  {g.name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Column toggle */}
        <div className="relative" ref={colMenuRef}>
          <button onClick={() => setShowColMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-text hover:bg-bg2 transition-colors">
            <Columns size={14} />
            Columnas
          </button>
          {showColMenu && (
            <div className="absolute right-0 top-9 bg-white border border-border rounded-xl shadow-dropdown p-3 z-20 min-w-[160px] space-y-1 animate-fade-in">
              {ALL_COLS.map((col) => (
                <label key={col.key} className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-bg2 text-[13px]">
                  <input type="checkbox" checked={show(col.key)} onChange={() => toggleCol(col.key)} className="w-3.5 h-3.5 accent-cta" />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
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

                {/* Nombre */}
                <EditCell guestId={guest.id} field="firstName" value={getFirst(guest)} className="font-medium" />

                {/* Apellidos */}
                {show("lastName") && (
                  <EditCell guestId={guest.id} field="lastName" value={getLast(guest)} className="text-brand" />
                )}

                {/* Email */}
                {show("email") && (
                  <EditCell guestId={guest.id} field="email" value={guest.email} className="hidden md:table-cell text-brand" />
                )}

                {/* Plato */}
                <TableCell className="cursor-pointer" onClick={() => !isEditing(guest.id, "dish") && startEdit(guest.id, "dish", guest.dish)}>
                  {isEditing(guest.id, "dish") ? (
                    <select autoFocus value={editValue}
                      onChange={(e) => { api.updateGuest(guest.id, { mealChoice: e.target.value }).then(loadData); setEditingCell(null); }}
                      onBlur={cancelEdit}
                      className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none">
                      <option value="">—</option>
                      {mealOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (guest.dish || "—")}
                </TableCell>

                {/* Alergias */}
                {show("allergies") && (
                  <EditCell guestId={guest.id} field="allergies" value={guest.allergies} className="hidden lg:table-cell text-brand" />
                )}

                {/* Dirección */}
                {show("address") && (
                  <EditCell guestId={guest.id} field="address" value={guest.address ?? ""} className="hidden lg:table-cell text-brand" />
                )}

                {/* Transporte */}
                {show("transport") && (
                  <TableCell className="hidden lg:table-cell">
                    <input type="checkbox" checked={guest.transport}
                      onChange={(e) => api.updateGuest(guest.id, { transport: e.target.checked }).then(loadData)}
                      className="w-3.5 h-3.5 rounded border-border accent-cta cursor-pointer" />
                  </TableCell>
                )}

                {/* Lista */}
                {show("list") && (
                  <TableCell className="hidden lg:table-cell cursor-pointer"
                    onClick={() => !isEditing(guest.id, "list") && startEdit(guest.id, "list", guest.listName ?? "A")}>
                    {isEditing(guest.id, "list") ? (
                      <select autoFocus value={editValue}
                        onChange={(e) => { api.updateGuest(guest.id, { listName: e.target.value } as UpdateGuestData).then(loadData); setEditingCell(null); }}
                        onBlur={cancelEdit}
                        className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">
                        <option value="A">Lista A</option>
                        <option value="B">Lista B</option>
                      </select>
                    ) : (
                      <span className="text-[12px] px-2 py-0.5 bg-bg2 rounded-full">{guest.listName ?? "A"}</span>
                    )}
                  </TableCell>
                )}

                {/* Rol */}
                {show("role") && (
                  <TableCell className="hidden md:table-cell cursor-pointer"
                    onClick={() => !isEditing(guest.id, "role") && startEdit(guest.id, "role", guest.role)}>
                    {isEditing(guest.id, "role") ? (
                      <select autoFocus value={editValue}
                        onChange={(e) => { api.updateGuest(guest.id, { role: e.target.value as GuestRole }).then(loadData); setEditingCell(null); }}
                        onBlur={cancelEdit}
                        className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">
                        {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : <span className="text-[12px]">{ROLE_LABELS[guest.role] || "—"}</span>}
                  </TableCell>
                )}

                {/* Grupo */}
                {show("group") && (
                  <TableCell className="hidden md:table-cell cursor-pointer"
                    onClick={() => !isEditing(guest.id, "group") && startEdit(guest.id, "group", guest.groupId ?? "")}>
                    {isEditing(guest.id, "group") ? (
                      <select autoFocus value={editValue}
                        onChange={(e) => handleAssignGroup(guest.id, e.target.value)}
                        onBlur={cancelEdit}
                        className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[12px] outline-none">
                        <option value="">Sin grupo</option>
                        {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    ) : <span className="text-[12px]">{(guest.groupId && groupMap.get(guest.groupId)) || "—"}</span>}
                  </TableCell>
                )}

                {/* RSVP */}
                <TableCell className="cursor-pointer"
                  onClick={() => !isEditing(guest.id, "rsvp") && startEdit(guest.id, "rsvp", guest.rsvp)}>
                  {isEditing(guest.id, "rsvp") ? (
                    <select autoFocus value={editValue}
                      onChange={(e) => { api.updateGuest(guest.id, { rsvpStatus: e.target.value as RsvpStatus }).then(loadData); setEditingCell(null); }}
                      onBlur={cancelEdit}
                      className="bg-bg2 border border-cta rounded px-2 py-0.5 text-[13px] outline-none">
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  ) : <RsvpDot status={guest.rsvp} />}
                </TableCell>

                {/* Delete */}
                <TableCell>
                  {deletingId === guest.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(guest.id)} className="text-[11px] text-danger font-medium hover:underline">Sí</button>
                      <button onClick={() => setDeletingId(null)}     className="text-[11px] text-brand hover:underline">No</button>
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

      {/* ── Modals ── */}
      <AddGuestModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGuest}
        groups={groups}
        mealOptions={mealOptions}
      />

      {/* Groups Modal */}
      <Modal open={showGroupsModal} onClose={() => setShowGroupsModal(false)} className="max-w-md">
        <h2 className="font-display text-[22px] text-text mb-4">Gestionar Grupos</h2>
        <p className="text-[13px] text-brand mb-4">Crea grupos para organizar invitados por familia o pareja.</p>
        <div className="flex gap-2 mb-5">
          <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
            placeholder="Nombre del grupo (ej: Familia García)"
            className="flex-1 bg-bg2 border border-border rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta" />
          <Button variant="cta" size="sm" onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
            <Plus size={14} />
          </Button>
        </div>
        {groups.length === 0 ? (
          <p className="text-[13px] text-brand text-center py-4">No hay grupos creados aún</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {groups.map((group) => {
              const count = guests.filter((g) => g.groupId === group.id).length;
              return (
                <div key={group.id} className="flex items-center justify-between bg-bg2 rounded-lg px-3 py-2.5">
                  <div>
                    <span className="text-[14px] font-medium text-text">{group.name}</span>
                    <span className="text-[12px] text-brand ml-2">{count} {count === 1 ? "invitado" : "invitados"}</span>
                  </div>
                  {deletingGroupId === group.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteGroup(group.id)} className="text-[12px] text-danger font-medium hover:underline">Eliminar</button>
                      <button onClick={() => setDeletingGroupId(null)}    className="text-[12px] text-brand hover:underline">Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeletingGroupId(group.id)} className="text-brand hover:text-danger transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-end pt-4">
          <Button variant="ghost" onClick={() => setShowGroupsModal(false)}>Cerrar</Button>
        </div>
      </Modal>

      {/* Config Modal */}
      <ConfigModal
        open={showConfigModal} onClose={() => setShowConfigModal(false)}
        mealOptions={mealOptions} allergyOptions={allergyOptions} transportPoints={transportPoints}
        onSaveMeals={setMealOptions} onSaveAllergies={setAllergyOptions} onSaveTransport={setTransportPoints}
      />
    </div>
  );
}

/* ─── Stat Box ───────────────────────────────────────────────── */

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-border rounded-xl px-4 py-3">
      <div className={`text-[26px] font-bold font-display ${color}`}>{value}</div>
      <div className="text-[11px] text-text/50 uppercase tracking-wide leading-tight mt-0.5">{label}</div>
    </div>
  );
}

/* ─── Config Modal ───────────────────────────────────────────── */

function ConfigModal({
  open, onClose,
  mealOptions, allergyOptions, transportPoints,
  onSaveMeals, onSaveAllergies, onSaveTransport,
}: {
  open: boolean; onClose: () => void;
  mealOptions: string[]; allergyOptions: string[]; transportPoints: string[];
  onSaveMeals: (v: string[]) => void;
  onSaveAllergies: (v: string[]) => void;
  onSaveTransport: (v: string[]) => void;
}) {
  const [tab,     setTab]     = useState<"meals"|"allergies"|"transport">("meals");
  const [meals,   setMeals]   = useState(mealOptions);
  const [allerg,  setAllerg]  = useState(allergyOptions);
  const [transp,  setTransp]  = useState(transportPoints);
  const [newVal,  setNewVal]  = useState("");

  const current    = tab === "meals" ? meals : tab === "allergies" ? allerg : transp;
  const setCurrent = tab === "meals" ? setMeals : tab === "allergies" ? setAllerg : setTransp;

  const handleAdd    = () => { const v = newVal.trim(); if (!v || current.includes(v)) return; setCurrent([...current, v]); setNewVal(""); };
  const handleRemove = (item: string) => setCurrent(current.filter((i) => i !== item));
  const handleSave   = () => { onSaveMeals(meals); onSaveAllergies(allerg); onSaveTransport(transp); onClose(); };

  const tabs = [{ key: "meals" as const, label: "Platos" }, { key: "allergies" as const, label: "Alergias" }, { key: "transport" as const, label: "Transporte" }];
  const placeholders: Record<string, string> = { meals: "Ej: Vegano, Halal...", allergies: "Ej: Nueces, Soja...", transport: "Ej: Calle Mayor, 12..." };

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <h2 className="font-display text-[22px] text-text mb-1">Platos / Restricciones</h2>
      <p className="text-[13px] text-brand mb-5">Configura las opciones disponibles para los invitados.</p>
      <div className="flex bg-bg2 rounded-lg p-0.5 mb-5">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setNewVal(""); }}
            className={`flex-1 py-1.5 rounded-md text-[13px] font-medium transition-colors ${tab === t.key ? "bg-white text-text shadow-sm" : "text-brand hover:text-text"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 min-h-[64px] mb-4 p-3 bg-bg2 rounded-xl">
        {current.length === 0 && <span className="text-[12px] text-brand italic">Sin opciones</span>}
        {current.map((item) => (
          <span key={item} className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[12px] text-text border border-border">
            {item}
            <button onClick={() => handleRemove(item)} className="text-brand hover:text-danger transition-colors"><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        <input type="text" value={newVal} onChange={(e) => setNewVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={placeholders[tab]}
          className="flex-1 bg-[#f2efe9] border-none rounded-xl px-4 py-2.5 text-[13px] text-text placeholder:text-text/30 outline-none focus:ring-2 focus:ring-cta/30" />
        <Button variant="cta" size="sm" onClick={handleAdd} disabled={!newVal.trim()}><Plus size={14} /></Button>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="cta" onClick={handleSave}>Guardar</Button>
      </div>
    </Modal>
  );
}

/* ─── RSVP Dot ───────────────────────────────────────────────── */

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
