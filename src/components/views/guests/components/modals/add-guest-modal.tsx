"use client";

import { useState } from "react";
import { User, Users, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { api } from "@/services";
import type { CreateGuestData } from "@/services/api";
import { AddGuestGroupForm, PersonRow, emptyPerson } from "./add-guest/add-guest-group-form";
import { AddGuestSingleForm, SingleFormState } from "./add-guest/add-guest-single-form";

interface AddGuestModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateGuestData) => Promise<void>;
  onGroupCreated?: () => void;
  groups?: { id: string; name: string }[];
  mealOptions?: string[];
  allergyOptions?: string[];
  transportPoints?: string[];
}

const defaultSingle: SingleFormState = {
  firstName: "", lastName: "", email: "", mealChoice: "", allergies: "",
  transport: false, transportPickupPoint: "",
  rsvpStatus: "pending", role: "", listName: "A", singleGroupId: "",
};

export function AddGuestModal({
  open, onClose, onAdd, onGroupCreated,
  groups = [],
  mealOptions = [],
  allergyOptions = [],
  transportPoints = [],
}: AddGuestModalProps) {
  const [groupMode, setGroupMode] = useState(false);
  const [persons, setPersons] = useState<PersonRow[]>([emptyPerson(), emptyPerson()]);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [single, setSingle] = useState<SingleFormState>(defaultSingle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setGroupMode(false);
    setPersons([emptyPerson(), emptyPerson()]);
    setGroupName(""); setGroupId("");
    setSingle(defaultSingle);
    setError("");
  };
  const handleClose = () => { resetForm(); onClose(); };

  const updatePerson = (i: number, field: keyof PersonRow, val: string | boolean) =>
    setPersons((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (groupMode) {
        const valid = persons.filter((p) => p.firstName.trim());
        if (!valid.length) { setError("Añade al menos un invitado"); setSaving(false); return; }
        if (!groupName.trim() && !groupId) { setError("Escribe el nombre del grupo o selecciona uno existente"); setSaving(false); return; }

        // Create new group if name provided, otherwise use selected existing group
        let resolvedGroupId = groupId;
        if (groupName.trim()) {
          const created = await api.createGuestGroup(groupName.trim()) as { id: string };
          resolvedGroupId = created.id;
          onGroupCreated?.();
        }

        for (const p of valid) {
          await onAdd({
            firstName: p.firstName.trim(), lastName: p.lastName.trim(),
            email: p.email.trim() || undefined,
            mealChoice: p.mealChoice || undefined,
            allergies: p.allergies.trim() || undefined,
            transport: p.transport,
            transportPickupPoint: p.transportPickupPoint || undefined,
            rsvpStatus: p.rsvpStatus, listName: p.listName,
            role: (p.role || undefined) as CreateGuestData["role"],
            groupId: resolvedGroupId || undefined,
          });
        }
      } else {
        if (!single.firstName.trim()) { setError("El nombre es obligatorio"); setSaving(false); return; }
        await onAdd({
          firstName: single.firstName.trim(), lastName: single.lastName.trim(),
          email: single.email.trim() || undefined, mealChoice: single.mealChoice || undefined,
          allergies: single.allergies.trim() || undefined,
          transport: single.transport, transportPickupPoint: single.transportPickupPoint || undefined,
          rsvpStatus: single.rsvpStatus, role: (single.role || undefined) as CreateGuestData["role"],
          listName: single.listName, groupId: single.singleGroupId || undefined,
        });
      }
      resetForm(); onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className="max-w-2xl">
      <div className="flex flex-col mb-6">
        <h2 className="font-display text-[24px] text-text uppercase tracking-wide mb-5">Alta de Invitados</h2>
        
        <div className="flex bg-bg2 rounded-xl p-1.5 gap-2 border border-border/50">
          <button
            type="button"
            onClick={() => setGroupMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-[14px] font-bold ${
              !groupMode 
                ? "bg-white text-text shadow-sm border border-border" 
                : "text-brand hover:bg-white/50"
            }`}
          >
            <User size={16} />
            Individual
          </button>

          <button
            type="button"
            onClick={() => setGroupMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-[14px] font-bold relative ${
              groupMode 
                ? "bg-cta text-white shadow-md" 
                : "bg-white text-brand border border-cta/30 hover:border-cta"
            }`}
          >
            <Users size={16} />
            Pareja o Grupo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-bg2/30 rounded-2xl p-5 border border-border/50 h-[540px] overflow-y-auto custom-scrollbar">
          {groupMode ? (
            <AddGuestGroupForm
              persons={persons} groupName={groupName} groupId={groupId} groups={groups}
              mealOptions={mealOptions} allergyOptions={allergyOptions} transportPoints={transportPoints}
              onUpdatePerson={updatePerson}
              onAddPerson={() => setPersons((p) => [...p, emptyPerson()])}
              onRemovePerson={(i) => setPersons((p) => p.filter((_, idx) => idx !== i))}
              onSetGroupName={setGroupName}
              onSetGroupId={(v) => { setGroupId(v); if (v) setGroupName(""); }}
            />
          ) : (
            <AddGuestSingleForm
              state={single}
              onChange={(field, val) => setSingle((prev) => ({ ...prev, [field]: val }))}
              error={error} mealOptions={mealOptions} allergyOptions={allergyOptions}
              transportPoints={transportPoints} groups={groups}
            />
          )}
        </div>

        {error && <p className="text-[13px] text-danger mt-3 font-medium">{error}</p>}

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="cta" disabled={saving} className="min-w-[140px] h-10 text-[14px]">
            {saving ? "Guardando..." : groupMode
              ? `Guardar ${persons.filter((p) => p.firstName.trim()).length || ""} invitados`
              : "Guardar invitado"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
