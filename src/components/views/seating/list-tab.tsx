"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Users, Check } from "lucide-react";
import type { SeatingPlan, Guest } from "@/types";
import { TableCard } from "./table-card";
import { AddTableModal } from "./add-table-modal";

interface ListTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  onAddTable: (shape: "round" | "rectangular", name?: string, capacity?: number) => void;
  onDeleteTable: (tableId: string) => void;
  onRenameTable: (tableId: string, name: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

export function ListTab({ plan, guests, onAddTable, onDeleteTable, onRenameTable, onAssignSeat }: ListTabProps) {
  const [search, setSearch] = useState("");
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dragGuestId, setDragGuestId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const assignedGuestIds = new Set(plan.tables.flatMap((t) => t.assignments.map((a) => a.guestId)).filter(Boolean));
  const filteredGuests = guests.filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()));
  const totalSeated = assignedGuestIds.size;

  return (
    <div className="flex gap-4" style={{ minHeight: 520 }}>
      <div className="flex-shrink-0 bg-white rounded-xl border border-[var(--color-border)] flex flex-col overflow-hidden" style={{ width: 240 }}>
        <div className="p-3 border-b border-[var(--color-border)]">
          <input
            type="text" placeholder="Buscar invitados..." value={search}
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
            const seatInfo = isSeated ? plan.tables.flatMap((t) => t.assignments.map((a) => ({ ...a, tableName: t.name }))).find((a) => a.guestId === guest.id) : null;
            return (
              <div
                key={guest.id} draggable
                onDragStart={() => setDragGuestId(guest.id)}
                onDragEnd={() => setDragGuestId(null)}
                className={`flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)]/40 last:border-0 cursor-grab active:cursor-grabbing transition-colors ${dragGuestId === guest.id ? "bg-[var(--color-fill)] opacity-60" : "hover:bg-[var(--color-bg-2)]"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[var(--color-text)] truncate">{guest.name}</div>
                  {isSeated && seatInfo && <div className="text-xs text-[var(--color-success)] truncate">{seatInfo.tableName}</div>}
                </div>
                {isSeated && <Check size={13} className="text-[var(--color-success)] flex-shrink-0" />}
              </div>
            );
          })}
          {filteredGuests.length === 0 && <div className="p-4 text-center text-sm text-[var(--color-text)]/40">Sin resultados</div>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {plan.tables.map((table) => (
            <TableCard
              key={table.id} table={table} guests={guests}
              isEditing={editingTable === table.id} editName={editName}
              onStartEdit={() => { setEditingTable(table.id); setEditName(table.name); }}
              onEditNameChange={setEditName}
              onSaveEdit={() => { onRenameTable(table.id, editName); setEditingTable(null); }}
              onCancelEdit={() => setEditingTable(null)}
              onDelete={() => onDeleteTable(table.id)}
              onDrop={(seatNumber) => { if (dragGuestId) onAssignSeat(table.id, seatNumber, dragGuestId); }}
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
        {showAddModal && <AddTableModal onClose={() => setShowAddModal(false)} onAdd={({ name, shape, capacity }) => { onAddTable(shape, name, capacity); }} />}
      </AnimatePresence>
    </div>
  );
}
