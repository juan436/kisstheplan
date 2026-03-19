"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Circle,
  Square,
  ChevronDown,
  X,
  Check,
  Users,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { api } from "@/services";
import type { SeatingPlan, TableSeat, Guest } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tableSize(capacity: number) {
  return Math.max(80, 80 + capacity * 8);
}

function getGuestName(guests: Guest[], guestId?: string): string {
  if (!guestId) return "";
  const g = guests.find((g) => g.id === guestId);
  return g ? g.name : "Invitado";
}

// ─── Add Table Modal ──────────────────────────────────────────────────────────

interface AddTableModalProps {
  onClose: () => void;
  onAdd: (data: { name: string; shape: "round" | "rectangular"; capacity: number }) => void;
  defaultShape?: "round" | "rectangular";
}

function AddTableModal({ onClose, onAdd, defaultShape = "round" }: AddTableModalProps) {
  const [name, setName] = useState("");
  const [shape, setShape] = useState<"round" | "rectangular">(defaultShape);
  const [capacity, setCapacity] = useState(8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-[var(--color-bg)] rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        style={{ boxShadow: "0 16px 48px rgba(74,60,50,0.15)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-xl text-[var(--color-text)]">Añadir mesa</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Nombre de la mesa</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mesa 1, Mesa de honor..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">Forma</label>
            <div className="flex gap-3">
              <button
                onClick={() => setShape("round")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  shape === "round"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <Circle size={16} />
                Redonda
              </button>
              <button
                onClick={() => setShape("rectangular")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  shape === "rectangular"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <Square size={16} />
                Rectangular
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]/70 mb-1.5">
              Capacidad: <span className="text-[var(--color-accent)] font-semibold">{capacity} personas</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-text)]/40 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)]/70 text-sm font-medium hover:bg-[var(--color-bg-2)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!name.trim()) return;
              onAdd({ name: name.trim(), shape, capacity });
              onClose();
            }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: "#866857" }}
          >
            Añadir mesa
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Plan Selector Dropdown ───────────────────────────────────────────────────

interface PlanSelectorProps {
  plans: SeatingPlan[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

function PlanSelector({ plans, selectedId, onSelect, onNew }: PlanSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedPlan = plans.find((p) => p.id === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] text-sm font-medium hover:border-[var(--color-accent)]/50 transition-colors"
        style={{ minWidth: 160 }}
      >
        <span className="flex-1 text-left">{selectedPlan?.name ?? "Seleccionar plano"}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[var(--color-border)] shadow-lg z-20 overflow-hidden"
            style={{ minWidth: 180, boxShadow: "0 12px 40px rgba(74,60,50,0.12)" }}
          >
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-bg-2)] transition-colors ${
                  p.id === selectedId ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-text)]"
                }`}
              >
                {p.name}
              </button>
            ))}
            <div className="border-t border-[var(--color-border)]">
              <button
                onClick={() => { onNew(); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-accent)] hover:bg-[var(--color-bg-2)] transition-colors flex items-center gap-2"
              >
                <Plus size={14} />
                Nuevo plano
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Canvas Tab ───────────────────────────────────────────────────────────────

interface CanvasTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  mode: "layout" | "seating";
  onUpdateTablePos: (tableId: string, posX: number, posY: number) => void;
  onAddTable: (shape: "round" | "rectangular", name?: string, capacity?: number) => void;
  onDeleteTable: (tableId: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

function CanvasTab({ plan, guests, mode, onUpdateTablePos, onAddTable, onDeleteTable, onAssignSeat }: CanvasTabProps) {
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<{ tableId: string; startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null);
  const [seatingTable, setSeatingTable] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, table: TableSeat) => {
    if (mode !== "layout") return;
    e.preventDefault();
    setDragging({
      tableId: table.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: table.posX,
      startPosY: table.posY,
    });
  }, [mode]);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = (e.clientX - dragging.startMouseX) / zoom;
      const dy = (e.clientY - dragging.startMouseY) / zoom;
      const newX = Math.max(0, dragging.startPosX + dx);
      const newY = Math.max(0, dragging.startPosY + dy);
      // Optimistic update via a local state override – we call the parent on mouseup
      const el = document.getElementById(`table-${dragging.tableId}`);
      if (el) {
        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = (e.clientX - dragging.startMouseX) / zoom;
      const dy = (e.clientY - dragging.startMouseY) / zoom;
      const newX = Math.max(0, dragging.startPosX + dx);
      const newY = Math.max(0, dragging.startPosY + dy);
      onUpdateTablePos(dragging.tableId, newX, newY);
      setDragging(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, zoom, onUpdateTablePos]);

  const activeSeatingTable = seatingTable ? plan.tables.find((t) => t.id === seatingTable) : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative overflow-hidden rounded-xl border border-[var(--color-border)]"
        style={{ height: 560, background: "var(--color-bg-2)" }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundImage:
              "linear-gradient(var(--color-fill) 1px, transparent 1px), linear-gradient(90deg, var(--color-fill) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          {plan.tables.map((table) => {
            const size = tableSize(table.capacity);
            const isRound = table.shape === "round";
            const assignedCount = table.assignments.filter((a) => a.guestId).length;

            return (
              <div
                key={table.id}
                id={`table-${table.id}`}
                onMouseDown={(e) => handleMouseDown(e, table)}
                onClick={() => { if (mode === "seating") setSeatingTable(table.id === seatingTable ? null : table.id); }}
                style={{
                  position: "absolute",
                  left: table.posX,
                  top: table.posY,
                  width: size,
                  height: isRound ? size : size * 0.6,
                  borderRadius: isRound ? "50%" : 12,
                  cursor: mode === "layout" ? "grab" : "pointer",
                  userSelect: "none",
                  border: `2px solid ${seatingTable === table.id ? "var(--color-accent)" : "var(--color-border)"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  boxShadow: seatingTable === table.id ? "0 4px 20px rgba(140,111,95,0.25)" : "none",
                }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center rounded-inherit"
                  style={{
                    background: seatingTable === table.id
                      ? "rgba(140, 111, 95, 0.12)"
                      : "rgba(230, 216, 200, 0.6)",
                    borderRadius: "inherit",
                  }}
                >
                  <span className="font-quicksand font-semibold text-[var(--color-text)] text-sm leading-tight px-2 text-center truncate w-full" style={{ maxWidth: size - 16 }}>
                    {table.name}
                  </span>
                  <span className="text-xs text-[var(--color-text)]/50 mt-0.5">
                    {assignedCount}/{table.capacity}
                  </span>
                </div>

                {mode === "layout" && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onDeleteTable(table.id); }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity shadow"
                    style={{ fontSize: 10 }}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Seating popover */}
        <AnimatePresence>
          {mode === "seating" && activeSeatingTable && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute top-3 right-3 bg-white rounded-xl border border-[var(--color-border)] shadow-xl z-10 overflow-hidden"
              style={{ width: 240, maxHeight: 380, boxShadow: "0 12px 40px rgba(74,60,50,0.14)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-2)]">
                <span className="font-quicksand font-semibold text-sm text-[var(--color-text)]">{activeSeatingTable.name}</span>
                <button onClick={() => setSeatingTable(null)} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)]">
                  <X size={14} />
                </button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
                {activeSeatingTable.assignments.map((seat) => {
                  const guestName = getGuestName(guests, seat.guestId);
                  return (
                    <div key={seat.seatNumber} className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--color-bg-2)] border-b border-[var(--color-border)]/50 last:border-0">
                      <span className="text-xs text-[var(--color-text)]/40 w-5 text-right flex-shrink-0">{seat.seatNumber}.</span>
                      {seat.guestId ? (
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="text-sm text-[var(--color-text)] truncate flex-1">{guestName}</span>
                          <button
                            onClick={() => onAssignSeat(activeSeatingTable.id, seat.seatNumber, undefined)}
                            className="text-[var(--color-danger)]/60 hover:text-[var(--color-danger)] flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-[var(--color-text)]/30 italic flex-1">Libre</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
            className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/40 transition-colors shadow-sm"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
            className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/40 transition-colors shadow-sm"
          >
            <ZoomOut size={13} />
          </button>
          <span className="text-center text-xs text-[var(--color-text)]/40 bg-white/80 rounded px-1">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onAddTable("round")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)] transition-colors"
        >
          <Circle size={14} />
          Añadir mesa redonda
        </button>
        <button
          onClick={() => onAddTable("rectangular")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)] transition-colors"
        >
          <Square size={14} />
          Añadir mesa rectangular
        </button>
        <span className="text-xs text-[var(--color-text)]/40 ml-auto">
          {mode === "layout" ? "Arrastra las mesas para reposicionarlas" : "Haz clic en una mesa para ver los asientos"}
        </span>
      </div>
    </div>
  );
}

// ─── List Tab ─────────────────────────────────────────────────────────────────

interface ListTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  onAddTable: (shape: "round" | "rectangular", name?: string, capacity?: number) => void;
  onDeleteTable: (tableId: string) => void;
  onRenameTable: (tableId: string, name: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

function ListTab({ plan, guests, onAddTable, onDeleteTable, onRenameTable, onAssignSeat }: ListTabProps) {
  const [search, setSearch] = useState("");
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dragGuestId, setDragGuestId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const assignedGuestIds = new Set(
    plan.tables.flatMap((t) => t.assignments.map((a) => a.guestId)).filter(Boolean)
  );

  const filteredGuests = guests.filter((g) => {
    if (!search) return true;
    return g.name.toLowerCase().includes(search.toLowerCase());
  });

  const totalSeated = assignedGuestIds.size;

  return (
    <div className="flex gap-4" style={{ minHeight: 520 }}>
      {/* Left sidebar: guest list */}
      <div
        className="flex-shrink-0 bg-white rounded-xl border border-[var(--color-border)] flex flex-col overflow-hidden"
        style={{ width: 240 }}
      >
        <div className="p-3 border-b border-[var(--color-border)]">
          <input
            type="text"
            placeholder="Buscar invitados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm bg-[var(--color-bg-2)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text)]/50">
            <Users size={12} />
            <span>{guests.length} invitados · {totalSeated} sentados</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredGuests.map((guest) => {
            const isSeated = assignedGuestIds.has(guest.id);
            const seatInfo = isSeated
              ? plan.tables
                  .flatMap((t) => t.assignments.map((a) => ({ ...a, tableName: t.name })))
                  .find((a) => a.guestId === guest.id)
              : null;

            return (
              <div
                key={guest.id}
                draggable
                onDragStart={() => setDragGuestId(guest.id)}
                onDragEnd={() => setDragGuestId(null)}
                className={`flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)]/40 last:border-0 cursor-grab active:cursor-grabbing transition-colors ${
                  dragGuestId === guest.id ? "bg-[var(--color-fill)] opacity-60" : "hover:bg-[var(--color-bg-2)]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[var(--color-text)] truncate">{guest.name}</div>
                  {isSeated && seatInfo && (
                    <div className="text-xs text-[var(--color-success)] truncate">{seatInfo.tableName}</div>
                  )}
                </div>
                {isSeated && (
                  <Check size={13} className="text-[var(--color-success)] flex-shrink-0" />
                )}
              </div>
            );
          })}
          {filteredGuests.length === 0 && (
            <div className="p-4 text-center text-sm text-[var(--color-text)]/40">Sin resultados</div>
          )}
        </div>
      </div>

      {/* Center: table cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {plan.tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              guests={guests}
              isEditing={editingTable === table.id}
              editName={editName}
              onStartEdit={() => { setEditingTable(table.id); setEditName(table.name); }}
              onEditNameChange={setEditName}
              onSaveEdit={() => { onRenameTable(table.id, editName); setEditingTable(null); }}
              onCancelEdit={() => setEditingTable(null)}
              onDelete={() => onDeleteTable(table.id)}
              onDrop={(seatNumber) => {
                if (dragGuestId) onAssignSeat(table.id, seatNumber, dragGuestId);
              }}
              onUnassign={(seatNumber) => onAssignSeat(table.id, seatNumber, undefined)}
            />
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text)]/60 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors w-full justify-center"
        >
          <Plus size={15} />
          Añadir mesa
        </button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddTableModal
            onClose={() => setShowAddModal(false)}
            onAdd={({ name, shape, capacity }) => {
              onAddTable(shape, name, capacity);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Table Card ───────────────────────────────────────────────────────────────

interface TableCardProps {
  table: TableSeat;
  guests: Guest[];
  isEditing: boolean;
  editName: string;
  onStartEdit: () => void;
  onEditNameChange: (v: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onDrop: (seatNumber: number) => void;
  onUnassign: (seatNumber: number) => void;
}

function TableCard({
  table,
  guests,
  isEditing,
  editName,
  onStartEdit,
  onEditNameChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onDrop,
  onUnassign,
}: TableCardProps) {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden"
      style={{ boxShadow: "0 4px 16px rgba(74,60,50,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg-2)]">
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSaveEdit(); if (e.key === "Escape") onCancelEdit(); }}
              className="flex-1 text-sm font-semibold bg-transparent border-b border-[var(--color-accent)] outline-none text-[var(--color-text)] min-w-0"
              autoFocus
            />
            <button onClick={onSaveEdit} className="text-[var(--color-success)]"><Check size={14} /></button>
            <button onClick={onCancelEdit} className="text-[var(--color-text)]/40"><X size={14} /></button>
          </div>
        ) : (
          <button onClick={onStartEdit} className="font-quicksand font-semibold text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors text-left flex-1 truncate">
            {table.name}
          </button>
        )}
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <span className="text-xs text-[var(--color-text)]/40">
            {table.assignments.filter((a) => a.guestId).length}/{table.capacity}
          </span>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-[var(--color-text)]/30 hover:text-[var(--color-danger)] transition-colors ml-1"
            >
              <Trash2 size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-1 ml-1">
              <button onClick={onDelete} className="text-[var(--color-danger)] text-xs font-medium">Sí</button>
              <button onClick={() => setConfirmDelete(false)} className="text-[var(--color-text)]/50 text-xs">No</button>
            </div>
          )}
        </div>
      </div>

      {/* Seats */}
      <div className="p-2">
        {table.assignments.map((seat) => {
          const guestName = getGuestName(guests, seat.guestId);
          const isOccupied = !!seat.guestId;

          return (
            <div
              key={seat.seatNumber}
              onDragOver={(e) => { if (!isOccupied) { e.preventDefault(); setHoveredSeat(seat.seatNumber); }}}
              onDragLeave={() => setHoveredSeat(null)}
              onDrop={(e) => { e.preventDefault(); setHoveredSeat(null); onDrop(seat.seatNumber); }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 last:mb-0 transition-colors ${
                hoveredSeat === seat.seatNumber && !isOccupied
                  ? "bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30"
                  : isOccupied
                  ? "bg-[var(--color-bg-2)]"
                  : "hover:bg-[var(--color-bg-2)]"
              }`}
            >
              <span className="text-xs text-[var(--color-text)]/40 w-4 text-right flex-shrink-0">{seat.seatNumber}.</span>
              {isOccupied ? (
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <span className="text-sm text-[var(--color-text)] truncate flex-1">{guestName}</span>
                  <button
                    onClick={() => onUnassign(seat.seatNumber)}
                    className="text-[var(--color-text)]/25 hover:text-[var(--color-danger)] transition-colors flex-shrink-0"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-[var(--color-text)]/25 italic flex-1">
                  {hoveredSeat === seat.seatNumber ? "Soltar aquí" : "Libre"}
                </span>
              )}
            </div>
          );
        })}
        {table.assignments.length === 0 && (
          <div className="text-center py-3 text-xs text-[var(--color-text)]/30 italic">Sin asientos configurados</div>
        )}
      </div>
    </div>
  );
}

// ─── New Plan Modal ───────────────────────────────────────────────────────────

interface NewPlanModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

function NewPlanModal({ onClose, onCreate }: NewPlanModalProps) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[var(--color-bg)] rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        style={{ boxShadow: "0 16px 48px rgba(74,60,50,0.15)" }}
      >
        <h3 className="font-playfair text-xl text-[var(--color-text)] mb-4">Nuevo plano de mesas</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { onCreate(name.trim()); onClose(); }}}
          placeholder="Ej: Cena, Aperitivo..."
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)]/70 text-sm font-medium hover:bg-[var(--color-bg-2)] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose(); }}}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-colors"
            style={{ backgroundColor: "#866857" }}
          >
            Crear plano
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SeatingView() {
  const [plans, setPlans] = useState<SeatingPlan[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [mode, setMode] = useState<"layout" | "seating">("layout");
  const [activeTab, setActiveTab] = useState<"canvas" | "list">("canvas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [showAddTable, setShowAddTable] = useState<"round" | "rectangular" | null>(null);

  // Load data
  useEffect(() => {
    Promise.all([api.getSeatingPlans(), api.getGuests()])
      .then(([p, g]) => {
        setPlans(p);
        setGuests(g);
        if (p.length > 0) setSelectedPlanId(p[0].id);
      })
      .catch(() => setError("No se pudieron cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;

  // ─── Plan operations ──────────────────────────────────────────────────────

  const handleCreatePlan = async (name: string) => {
    const newPlan = await api.createSeatingPlan(name);
    setPlans((prev) => [...prev, newPlan]);
    setSelectedPlanId(newPlan.id);
  };

  const handleDeletePlan = async (planId: string) => {
    await api.deleteSeatingPlan(planId);
    setPlans((prev) => {
      const next = prev.filter((p) => p.id !== planId);
      if (selectedPlanId === planId) setSelectedPlanId(next[0]?.id ?? null);
      return next;
    });
  };

  // ─── Table operations ─────────────────────────────────────────────────────

  const handleAddTable = async (shape: "round" | "rectangular", name?: string, capacity?: number) => {
    if (!selectedPlanId) return;
    const canvas = document.querySelector(".canvas-inner");
    const posX = canvas ? canvas.clientWidth / 2 - 60 : 200;
    const posY = 200;
    const updated = await api.addSeatingTable(selectedPlanId, {
      name: name ?? (shape === "round" ? "Mesa redonda" : "Mesa rectangular"),
      shape,
      capacity: capacity ?? 8,
      posX,
      posY,
    });
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? updated : p)));
  };

  const handleUpdateTablePos = async (tableId: string, posX: number, posY: number) => {
    if (!selectedPlanId) return;
    // Optimistic update
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? { ...p, tables: p.tables.map((t) => (t.id === tableId ? { ...t, posX, posY } : t)) }
          : p
      )
    );
    await api.updateSeatingTable(selectedPlanId, tableId, { posX, posY });
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!selectedPlanId) return;
    const updated = await api.deleteSeatingTable(selectedPlanId, tableId);
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? updated : p)));
  };

  const handleRenameTable = async (tableId: string, name: string) => {
    if (!selectedPlanId) return;
    const updated = await api.updateSeatingTable(selectedPlanId, tableId, { name });
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? updated : p)));
  };

  const handleAssignSeat = async (tableId: string, seatNumber: number, guestId?: string) => {
    if (!selectedPlanId) return;
    // Optimistic update
    setPlans((prev) =>
      prev.map((p) =>
        p.id === selectedPlanId
          ? {
              ...p,
              tables: p.tables.map((t) =>
                t.id === tableId
                  ? {
                      ...t,
                      assignments: t.assignments.map((a) =>
                        a.seatNumber === seatNumber ? { ...a, guestId } : a
                      ),
                    }
                  : t
              ),
            }
          : p
      )
    );
    await api.assignSeat(selectedPlanId, tableId, seatNumber, guestId);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-[var(--color-text)]/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ backgroundColor: "#866857" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        {/* Left: plan selector */}
        <PlanSelector
          plans={plans}
          selectedId={selectedPlanId}
          onSelect={setSelectedPlanId}
          onNew={() => setShowNewPlan(true)}
        />

        {/* Center: mode toggle */}
        {selectedPlan && (
          <div
            className="flex rounded-xl border border-[var(--color-border)] overflow-hidden bg-white"
            style={{ boxShadow: "0 2px 8px rgba(74,60,50,0.06)" }}
          >
            {(["layout", "seating"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:bg-[var(--color-bg-2)]"
                }`}
              >
                {m === "layout" ? "DISTRIBUCIÓN" : "ASIENTOS"}
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => alert("Exportar a PDF — próximamente")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#866857" }}
          >
            <Download size={14} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* No plans empty state */}
      {plans.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(140,111,95,0.12)" }}
          >
            <Users size={28} style={{ color: "#866857" }} />
          </div>
          <h3 className="font-playfair text-2xl text-[var(--color-text)] mb-2">Sin planos de mesas</h3>
          <p className="text-[var(--color-text)]/50 mb-6 max-w-sm">
            Crea tu primer plano para empezar a asignar asientos a los invitados
          </p>
          <button
            onClick={() => setShowNewPlan(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors"
            style={{ backgroundColor: "#866857" }}
          >
            <Plus size={16} />
            Crear primer plano
          </button>
        </motion.div>
      )}

      {/* Plan content */}
      {selectedPlan && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-[var(--color-border)]">
            {(["canvas", "list"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-transparent text-[var(--color-text)]/50 hover:text-[var(--color-text)]"
                }`}
              >
                {tab === "canvas" ? "Plano visual" : "Listado por mesas"}
              </button>
            ))}

            {selectedPlan && (
              <button
                onClick={() => handleDeletePlan(selectedPlan.id)}
                className="ml-auto mb-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text)]/40 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
              >
                <Trash2 size={12} />
                Eliminar plano
              </button>
            )}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "canvas" ? (
              <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CanvasTab
                  plan={selectedPlan}
                  guests={guests}
                  mode={mode}
                  onUpdateTablePos={handleUpdateTablePos}
                  onAddTable={(shape) => {
                    setShowAddTable(shape);
                  }}
                  onDeleteTable={handleDeleteTable}
                  onAssignSeat={handleAssignSeat}
                />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ListTab
                  plan={selectedPlan}
                  guests={guests}
                  onAddTable={(shape) => setShowAddTable(shape)}
                  onDeleteTable={handleDeleteTable}
                  onRenameTable={handleRenameTable}
                  onAssignSeat={handleAssignSeat}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showNewPlan && (
          <NewPlanModal
            onClose={() => setShowNewPlan(false)}
            onCreate={handleCreatePlan}
          />
        )}
        {showAddTable && (
          <AddTableModal
            defaultShape={showAddTable}
            onClose={() => setShowAddTable(null)}
            onAdd={({ name, shape, capacity }) => handleAddTable(shape, name, capacity)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
