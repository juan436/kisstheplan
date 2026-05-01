"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Pencil, Check } from "lucide-react";
import { pickNextColor, MEAL_PALETTE, ALLERGY_PALETTE } from "@/lib/allergy-colors";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { Guest, GuestGroup } from "@/types";

export function GroupsModal({ open, onClose, groups, guests, newGroupName, setNewGroupName, deletingGroupId, setDeletingGroupId, handleCreateGroup, handleDeleteGroup, handleRenameGroup }: {
  open: boolean; onClose: () => void;
  groups: GuestGroup[]; guests: Guest[];
  newGroupName: string; setNewGroupName: (v: string) => void;
  deletingGroupId: string | null; setDeletingGroupId: (id: string | null) => void;
  handleCreateGroup: () => void; handleDeleteGroup: (id: string) => void;
  handleRenameGroup: (id: string, name: string) => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const startRename = (group: GuestGroup) => {
    setRenamingId(group.id); setRenameValue(group.name);
    setDeletingGroupId(null);
  };
  const confirmRename = async () => {
    if (renamingId && renameValue.trim()) await handleRenameGroup(renamingId, renameValue.trim());
    setRenamingId(null);
  };

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
            const isRenaming = renamingId === group.id;
            const isDeleting = deletingGroupId === group.id;
            return (
              <div key={group.id} className="flex items-center gap-2 bg-bg2 rounded-lg px-3 py-2.5">
                {isRenaming ? (
                  <>
                    <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenamingId(null); }}
                      className="flex-1 bg-white border border-cta rounded-md px-2 py-1 text-[13px] text-text outline-none" />
                    <button onClick={confirmRename} className="text-success hover:opacity-70 transition-opacity"><Check size={15} /></button>
                    <button onClick={() => setRenamingId(null)} className="text-brand hover:text-danger transition-colors"><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] font-medium text-text">{group.name}</span>
                      <span className="text-[12px] text-brand ml-2">{count} {count === 1 ? "invitado" : "invitados"}</span>
                    </div>
                    {isDeleting ? (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleDeleteGroup(group.id)} className="text-[12px] text-danger font-medium hover:underline">Eliminar</button>
                        <button onClick={() => setDeletingGroupId(null)} className="text-[12px] text-brand hover:underline">Cancelar</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => startRename(group)} className="text-brand hover:text-cta transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => { setDeletingGroupId(group.id); setRenamingId(null); }} className="text-brand hover:text-danger transition-colors"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </>
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

export function ConfigModal({ open, onClose, mealOptions, mealColors: initMealColors, allergyOptions, allergyColors: initAllergyColors, transportPoints, onSave }: {
  open: boolean; onClose: () => void;
  mealOptions: string[]; mealColors?: Record<string, string>;
  allergyOptions: string[]; allergyColors?: Record<string, string>;
  transportPoints: string[];
  onSave: (meals: string[], allergies: string[], transport: string[], allergyColors: Record<string, string>, mealColors: Record<string, string>) => void;
}) {
  const [tab,    setTab]    = useState<"meals"|"allergies"|"transport">("meals");
  const [meals,  setMeals]  = useState(mealOptions);
  const [allerg, setAllerg] = useState(allergyOptions);
  const [transp, setTransp] = useState(transportPoints);
  const [mColors, setMColors] = useState<Record<string, string>>(initMealColors ?? {});
  const [aColors, setAColors] = useState<Record<string, string>>(initAllergyColors ?? {});
  const [newVal, setNewVal] = useState("");

  // Sync state when props change or modal opens
  useEffect(() => {
    if (open) {
      setMeals(mealOptions);
      setAllerg(allergyOptions);
      setTransp(transportPoints);
      setMColors(initMealColors ?? {});
      setAColors(initAllergyColors ?? {});
    }
  }, [open, mealOptions, allergyOptions, transportPoints, initMealColors, initAllergyColors]);

  const current    = tab === "meals" ? meals : tab === "allergies" ? allerg : transp;
  const setCurrent = tab === "meals" ? setMeals : tab === "allergies" ? setAllerg : setTransp;
  const hasColors  = tab === "meals" || tab === "allergies";
  const currentColors = tab === "meals" ? mColors : aColors;
  const setCurrentColors = tab === "meals" ? setMColors : setAColors;
  const currentPalette = tab === "meals" ? MEAL_PALETTE : ALLERGY_PALETTE;

  const handleAdd = () => {
    const v = newVal.trim();
    if (!v || current.includes(v)) return;
    setCurrent([...current, v]);
    if (hasColors && !currentColors[v])
      setCurrentColors((prev) => ({ ...prev, [v]: pickNextColor(prev, currentPalette) }));
    setNewVal("");
  };
  const handleRemove = (item: string) => setCurrent(current.filter((i) => i !== item));
  const handleSave = () => {
    const savedA: Record<string, string> = {};
    allerg.forEach((a) => { if (aColors[a]) savedA[a] = aColors[a]; });
    const savedM: Record<string, string> = {};
    meals.forEach((m) => { if (mColors[m]) savedM[m] = mColors[m]; });
    onSave(meals, allerg, transp, savedA, savedM);
    onClose();
  };
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
      {hasColors && <p className="text-[11px] text-brand/60 mb-2 -mt-3">Haz clic en el círculo de color para cambiarlo.</p>}
      <div className="flex flex-wrap gap-2 min-h-[64px] mb-4 p-3 bg-bg2 rounded-xl">
        {current.length === 0 && <span className="text-[12px] text-brand italic">Sin opciones</span>}
        {current.map((item) => (
          <span key={item} className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[12px] text-text border border-border">
            {hasColors && (
              <label style={{ cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }} title="Cambiar color">
                <input type="color" value={currentColors[item] ?? currentPalette[0]} onChange={(e) => setCurrentColors((prev) => ({ ...prev, [item]: e.target.value }))} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: currentColors[item] ?? currentPalette[0], display: "block", border: "1px solid rgba(0,0,0,0.15)" }} />
              </label>
            )}
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
