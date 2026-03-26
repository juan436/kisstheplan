"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { CreateGuestData } from "@/services/api";
import { AddGuestGroupForm, PersonRow, emptyPerson } from "./add-guest-group-form";
import { AddGuestSingleForm, SingleFormState } from "./add-guest-single-form";

interface AddGuestModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateGuestData) => Promise<void>;
  groups?: { id: string; name: string }[];
  mealOptions?: string[];
}

const defaultSingle: SingleFormState = {
  firstName: "", lastName: "", email: "", mealChoice: "", allergies: "",
  transport: false, rsvpStatus: "pending", role: "", listName: "A", singleGroupId: "",
};

export function AddGuestModal({
  open, onClose, onAdd,
  groups = [],
  mealOptions = ["Carne", "Pescado", "Vegetariano", "Infantil"],
}: AddGuestModalProps) {
  const [groupMode, setGroupMode] = useState(false);
  const [persons, setPersons] = useState<PersonRow[]>([emptyPerson(), emptyPerson()]);
  const [groupId, setGroupId] = useState("");
  const [single, setSingle] = useState<SingleFormState>(defaultSingle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setGroupMode(false);
    setPersons([emptyPerson(), emptyPerson()]);
    setGroupId("");
    setSingle(defaultSingle);
    setError("");
  };
  const handleClose = () => { resetForm(); onClose(); };

  const updatePerson = (i: number, field: keyof PersonRow, val: string) =>
    setPersons((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (groupMode) {
        const valid = persons.filter((p) => p.firstName.trim());
        if (!valid.length) { setError("Añade al menos un invitado"); setSaving(false); return; }
        for (const p of valid) {
          await onAdd({
            firstName: p.firstName.trim(), lastName: p.lastName.trim(),
            rsvpStatus: "pending", listName: "A",
            role: (p.role || undefined) as CreateGuestData["role"],
            groupId: groupId || undefined,
          });
        }
      } else {
        if (!single.firstName.trim()) { setError("El nombre es obligatorio"); setSaving(false); return; }
        await onAdd({
          firstName: single.firstName.trim(), lastName: single.lastName.trim(),
          email: single.email.trim() || undefined, mealChoice: single.mealChoice || undefined,
          allergies: single.allergies.trim() || undefined, transport: single.transport,
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-[22px] text-text uppercase tracking-wide">Datos Invitados</h2>
        <div className="flex bg-bg2 rounded-lg p-0.5 text-[12px]">
          <button type="button" onClick={() => setGroupMode(false)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${!groupMode ? "bg-white text-text shadow-sm" : "text-brand hover:text-text"}`}>
            Individual
          </button>
          <button type="button" onClick={() => setGroupMode(true)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${groupMode ? "bg-white text-text shadow-sm" : "text-brand hover:text-text"}`}>
            Grupo / Pareja
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {groupMode ? (
          <AddGuestGroupForm
            persons={persons} groupId={groupId} groups={groups}
            onUpdatePerson={updatePerson}
            onAddPerson={() => setPersons((p) => [...p, emptyPerson()])}
            onRemovePerson={(i) => setPersons((p) => p.filter((_, idx) => idx !== i))}
            onSetGroupId={setGroupId}
          />
        ) : (
          <AddGuestSingleForm
            state={single}
            onChange={(field, val) => setSingle((prev) => ({ ...prev, [field]: val }))}
            error={error} mealOptions={mealOptions} groups={groups}
          />
        )}

        {error && <p className="text-[13px] text-danger mt-3">{error}</p>}

        <div className="flex justify-end gap-3 pt-5">
          <Button type="button" variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="cta" disabled={saving}>
            {saving ? "Guardando..." : groupMode
              ? `Guardar ${persons.filter((p) => p.firstName.trim()).length || ""} invitado(s)`
              : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
