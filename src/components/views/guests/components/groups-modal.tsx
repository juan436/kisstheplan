"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { Guest, GuestGroup } from "@/types";

export function GroupsModal({ open, onClose, groups, guests, newGroupName, setNewGroupName, deletingGroupId, setDeletingGroupId, handleCreateGroup, handleDeleteGroup }: {
  open: boolean; onClose: () => void;
  groups: GuestGroup[]; guests: Guest[];
  newGroupName: string; setNewGroupName: (v: string) => void;
  deletingGroupId: string | null; setDeletingGroupId: (id: string | null) => void;
  handleCreateGroup: () => void; handleDeleteGroup: (id: string) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <h2 className="font-display text-[22px] text-text mb-4">Gestionar Grupos</h2>
      <p className="text-[13px] text-brand mb-4">Crea grupos para organizar invitados por familia o pareja.</p>
      <div className="flex gap-2 mb-5">
        <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
          placeholder="Nombre del grupo (ej: Familia García)"
          className="flex-1 bg-bg2 border border-border rounded-lg px-3 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta" />
        <Button variant="cta" size="sm" onClick={handleCreateGroup} disabled={!newGroupName.trim()}><Plus size={14} /></Button>
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
                    <button onClick={() => setDeletingGroupId(null)} className="text-[12px] text-brand hover:underline">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setDeletingGroupId(group.id)} className="text-brand hover:text-danger transition-colors"><Trash2 size={14} /></button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Button variant="ghost" onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
}

export function ConfigModal({ open, onClose, mealOptions, allergyOptions, transportPoints, onSaveMeals, onSaveAllergies, onSaveTransport }: {
  open: boolean; onClose: () => void;
  mealOptions: string[]; allergyOptions: string[]; transportPoints: string[];
  onSaveMeals: (v: string[]) => void; onSaveAllergies: (v: string[]) => void; onSaveTransport: (v: string[]) => void;
}) {
  const [tab,    setTab]    = useState<"meals"|"allergies"|"transport">("meals");
  const [meals,  setMeals]  = useState(mealOptions);
  const [allerg, setAllerg] = useState(allergyOptions);
  const [transp, setTransp] = useState(transportPoints);
  const [newVal, setNewVal] = useState("");

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
