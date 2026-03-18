"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CreateGuestData } from "@/services/api";

interface AddGuestModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateGuestData) => Promise<void>;
  groups?: { id: string; name: string }[];
  mealOptions?: string[];
}

const RSVP_OPTIONS = [
  { value: "pending",   label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "rejected",  label: "Rechazado" },
] as const;

const ROLE_OPTIONS = [
  { value: "",             label: "Sin asignar" },
  { value: "groom",        label: "Novio" },
  { value: "bride",        label: "Novia" },
  { value: "family_groom", label: "Familia del novio" },
  { value: "family_bride", label: "Familia de la novia" },
  { value: "child",        label: "Niño/a" },
  { value: "baby",         label: "Bebé" },
] as const;

type RsvpVal = "pending" | "confirmed" | "rejected";

interface PersonRow { firstName: string; lastName: string; role: string; }
const emptyPerson = (): PersonRow => ({ firstName: "", lastName: "", role: "" });

/* ─────────────────────────────────────────────────────────────── */

export function AddGuestModal({
  open, onClose, onAdd,
  groups = [],
  mealOptions = ["Carne", "Pescado", "Vegetariano", "Infantil"],
}: AddGuestModalProps) {
  const [groupMode, setGroupMode] = useState(false);

  /* Group mode state */
  const [persons, setPersons] = useState<PersonRow[]>([emptyPerson(), emptyPerson()]);
  const [groupId, setGroupId] = useState("");

  /* Single mode state */
  const [firstName, setFirstName]   = useState("");
  const [lastName,  setLastName]    = useState("");
  const [email,     setEmail]       = useState("");
  const [mealChoice,setMealChoice]  = useState("");
  const [allergies, setAllergies]   = useState("");
  const [transport, setTransport]   = useState(false);
  const [rsvpStatus,setRsvpStatus]  = useState<RsvpVal>("pending");
  const [role,      setRole]        = useState("");
  const [listName,  setListName]    = useState("A");
  const [singleGroupId, setSingleGroupId] = useState("");

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const resetForm = () => {
    setGroupMode(false);
    setPersons([emptyPerson(), emptyPerson()]);
    setGroupId("");
    setFirstName(""); setLastName(""); setEmail("");
    setMealChoice(""); setAllergies(""); setTransport(false);
    setRsvpStatus("pending"); setRole(""); setListName("A"); setSingleGroupId("");
    setError("");
  };

  const handleClose = () => { resetForm(); onClose(); };

  /* Group helpers */
  const updatePerson = (i: number, field: keyof PersonRow, val: string) =>
    setPersons((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const addPerson    = () => setPersons((prev) => [...prev, emptyPerson()]);
  const removePerson = (i: number) => setPersons((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (groupMode) {
        const valid = persons.filter((p) => p.firstName.trim());
        if (!valid.length) { setError("Añade al menos un invitado"); setSaving(false); return; }
        for (const p of valid) {
          await onAdd({
            firstName: p.firstName.trim(),
            lastName:  p.lastName.trim(),
            rsvpStatus: "pending",
            listName: "A",
            role: (p.role || undefined) as CreateGuestData["role"],
            groupId: groupId || undefined,
          });
        }
      } else {
        if (!firstName.trim()) { setError("El nombre es obligatorio"); setSaving(false); return; }
        await onAdd({
          firstName:  firstName.trim(),
          lastName:   lastName.trim(),
          email:      email.trim() || undefined,
          mealChoice: mealChoice || undefined,
          allergies:  allergies.trim() || undefined,
          transport,
          rsvpStatus,
          role: (role || undefined) as CreateGuestData["role"],
          listName,
          groupId: singleGroupId || undefined,
        });
      }
      resetForm(); onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  /* ── Render ── */
  return (
    <Modal open={open} onClose={handleClose} className="max-w-2xl">
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-[22px] text-text uppercase tracking-wide">
          Datos Invitados
        </h2>
        <div className="flex bg-bg2 rounded-lg p-0.5 text-[12px]">
          <button
            type="button"
            onClick={() => setGroupMode(false)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${!groupMode ? "bg-white text-text shadow-sm" : "text-brand hover:text-text"}`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setGroupMode(true)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${groupMode ? "bg-white text-text shadow-sm" : "text-brand hover:text-text"}`}
          >
            Grupo / Pareja
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {groupMode ? (
          /* ── GROUP MODE: couple/family layout ── */
          <div className="space-y-4">
            {/* First two persons side-by-side with "&" */}
            {persons.length >= 2 && (
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
                <PersonColumn
                  person={persons[0]}
                  onChange={(f, v) => updatePerson(0, f, v)}
                  autoFocus
                />
                <div className="flex items-center justify-center pt-8">
                  <span className="font-display text-[28px] text-[#866857]">&</span>
                </div>
                <PersonColumn
                  person={persons[1]}
                  onChange={(f, v) => updatePerson(1, f, v)}
                />
              </div>
            )}

            {/* Extra persons (3rd, 4th…) */}
            {persons.slice(2).map((p, idx) => {
              const i = idx + 2;
              return (
                <div key={i} className="flex gap-2 items-start border-t border-border pt-4">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input placeholder="Nombre *" value={p.firstName} onChange={(e) => updatePerson(i, "firstName", e.target.value)} />
                    <Input placeholder="Apellidos" value={p.lastName}  onChange={(e) => updatePerson(i, "lastName",  e.target.value)} />
                    <div className="col-span-2">
                      <RoleSelect value={p.role} onChange={(v) => updatePerson(i, "role", v)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removePerson(i)} className="mt-2 text-brand hover:text-danger transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}

            {/* Add another */}
            <button
              type="button"
              onClick={addPerson}
              className="flex items-center gap-1.5 text-[13px] text-cta hover:text-[#b08f5d] font-medium transition-colors"
            >
              <Plus size={15} />
              Añadir otro invitado
            </button>

            {/* Assign to existing group */}
            {groups.length > 0 && (
              <div>
                <Label>Asignar a grupo existente (opcional)</Label>
                <select value={groupId} onChange={(e) => setGroupId(e.target.value)}
                  className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta">
                  <option value="">Crear grupo nuevo</option>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
          </div>
        ) : (
          /* ── SINGLE MODE ── */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nombre *</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" error={!!error && !firstName.trim()} autoFocus />
              </div>
              <div>
                <Label>Apellidos</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellidos" />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Plato</Label>
                <select value={mealChoice} onChange={(e) => setMealChoice(e.target.value)}
                  className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta">
                  <option value="">—</option>
                  {mealOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <Label>RSVP</Label>
                <select value={rsvpStatus} onChange={(e) => setRsvpStatus(e.target.value as RsvpVal)}
                  className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta">
                  {RSVP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Rol</Label>
                <RoleSelect value={role} onChange={setRole} />
              </div>
            </div>

            <div>
              <Label>Alergias / Restricciones</Label>
              <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Ej: celiaco, intolerante a la lactosa..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Lista</Label>
                <select value={listName} onChange={(e) => setListName(e.target.value)}
                  className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta">
                  <option value="A">Lista A</option>
                  <option value="B">Lista B</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={transport} onChange={(e) => setTransport(e.target.checked)} className="w-4 h-4 rounded border-border accent-cta" />
                  <span className="text-[13px] text-text">Necesita transporte</span>
                </label>
              </div>
            </div>

            {groups.length > 0 && (
              <div>
                <Label>Grupo (opcional)</Label>
                <select value={singleGroupId} onChange={(e) => setSingleGroupId(e.target.value)}
                  className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta">
                  <option value="">Sin grupo</option>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
          </div>
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

/* ─── Sub-components ─────────────────────────────────────────── */

function PersonColumn({
  person, onChange, autoFocus,
}: {
  person: PersonRow;
  onChange: (field: keyof PersonRow, val: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Nombre *"
        value={person.firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
        className="bg-[#f2efe9] border-none h-11 rounded-xl text-center"
        autoFocus={autoFocus}
      />
      <Input
        placeholder="Apellidos"
        value={person.lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
        className="bg-[#f2efe9] border-none h-11 rounded-xl text-center"
      />
      <RoleSelect value={person.role} onChange={(v) => onChange("role", v)} />
    </div>
  );
}

function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[10px] text-[13px] font-body text-text outline-none focus:border-cta"
    >
      {ROLE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
