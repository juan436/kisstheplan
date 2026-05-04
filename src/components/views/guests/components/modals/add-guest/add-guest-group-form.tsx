import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonCard } from "./person-card";

export const RSVP_OPTIONS = [
  { value: "pending",   label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "rejected",  label: "Rechazado" },
] as const;

export const ROLE_OPTIONS = [
  { value: "",             label: "Sin asignar" },
  { value: "groom",        label: "Novio" },
  { value: "bride",        label: "Novia" },
  { value: "family_groom", label: "Familia del novio" },
  { value: "family_bride", label: "Familia de la novia" },
  { value: "child",        label: "Niño/a" },
  { value: "baby",         label: "Bebé" },
] as const;

export type RsvpVal = "pending" | "confirmed" | "rejected";

export interface PersonRow {
  firstName: string; lastName: string; email: string; role: string;
  mealChoice: string; allergies: string; transport: boolean;
  transportPickupPoint: string; rsvpStatus: RsvpVal; listName: string;
}

export function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#f2efe9] border-[1.5px] border-border rounded-md px-3 py-[8px] text-[13px] text-text outline-none focus:border-cta">
      {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );
}

export const emptyPerson = (): PersonRow => ({
  firstName: "", lastName: "", email: "", role: "",
  mealChoice: "", allergies: "", transport: false,
  transportPickupPoint: "", rsvpStatus: "pending", listName: "A",
});

interface AddGuestGroupFormProps {
  persons: PersonRow[];
  groupName: string;
  groupId: string;
  groups: { id: string; name: string }[];
  mealOptions: string[];
  allergyOptions: string[];
  transportPoints: string[];
  onUpdatePerson: (i: number, field: keyof PersonRow, val: string | boolean) => void;
  onAddPerson: () => void;
  onRemovePerson: (i: number) => void;
  onSetGroupName: (v: string) => void;
  onSetGroupId: (v: string) => void;
}

const selStyle = "w-full bg-[#f2efe9] border-[1.5px] border-border rounded-md px-3 py-[8px] text-[13px] text-text outline-none focus:border-cta";

export function AddGuestGroupForm({
  persons, groupName, groupId, groups, mealOptions, allergyOptions, transportPoints,
  onUpdatePerson, onAddPerson, onRemovePerson, onSetGroupName, onSetGroupId,
}: AddGuestGroupFormProps) {
  return (
    <div className="space-y-4">
      {/* Group name — always visible above the person list */}
      <div>
        <Label className="text-[12px] mb-1 font-semibold">Nombre del Grupo o Familia *</Label>
        <Input
          placeholder="Ej: Familia Mendoza, Pareja Juan y Ana..."
          value={groupName}
          onChange={(e) => { onSetGroupName(e.target.value); if (e.target.value) onSetGroupId(""); }}
          className="bg-[#f2efe9] border-[1.5px] border-border h-10 text-[13px]"
          autoFocus
        />
      </div>

      {/* Person cards - NO internal scroll here, handled by parent */}
      <div className="space-y-4">
        {persons.map((person, i) => (
          <PersonCard
            key={i} person={person} index={i}
            onChange={(field, val) => onUpdatePerson(i, field, val)}
            mealOptions={mealOptions} allergyOptions={allergyOptions} transportPoints={transportPoints}
            onRemove={i >= 2 ? () => onRemovePerson(i) : undefined}
          />
        ))}

        <button type="button" onClick={onAddPerson}
          className="flex items-center gap-1.5 text-[13px] text-cta hover:text-[#b08f5d] font-bold py-2 px-1 transition-colors">
          <Plus size={16} />
          Añadir otro invitado
        </button>
      </div>

      {/* Existing group selector */}
      {groups.length > 0 && !groupName && (
        <div className="pt-2 border-t border-border/50">
          <Label className="text-[12px] mb-1">o asignar a grupo existente</Label>
          <select value={groupId} onChange={(e) => onSetGroupId(e.target.value)} className={selStyle}>
            <option value="">— Ninguno —</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
