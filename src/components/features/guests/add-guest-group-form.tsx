import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
export interface PersonRow { firstName: string; lastName: string; role: string; }
export const emptyPerson = (): PersonRow => ({ firstName: "", lastName: "", role: "" });

export function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[10px] text-[13px] font-body text-text outline-none focus:border-cta">
      {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );
}

export function PersonColumn({ person, onChange, autoFocus }: {
  person: PersonRow;
  onChange: (field: keyof PersonRow, val: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="space-y-3">
      <Input placeholder="Nombre *" value={person.firstName} onChange={(e) => onChange("firstName", e.target.value)}
        className="bg-[#f2efe9] border-none h-11 rounded-xl text-center" autoFocus={autoFocus} />
      <Input placeholder="Apellidos" value={person.lastName} onChange={(e) => onChange("lastName", e.target.value)}
        className="bg-[#f2efe9] border-none h-11 rounded-xl text-center" />
      <RoleSelect value={person.role} onChange={(v) => onChange("role", v)} />
    </div>
  );
}

interface AddGuestGroupFormProps {
  persons: PersonRow[];
  groupId: string;
  groups: { id: string; name: string }[];
  onUpdatePerson: (i: number, field: keyof PersonRow, val: string) => void;
  onAddPerson: () => void;
  onRemovePerson: (i: number) => void;
  onSetGroupId: (v: string) => void;
}

export function AddGuestGroupForm({ persons, groupId, groups, onUpdatePerson, onAddPerson, onRemovePerson, onSetGroupId }: AddGuestGroupFormProps) {
  return (
    <div className="space-y-4">
      {persons.length >= 2 && (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <PersonColumn person={persons[0]} onChange={(f, v) => onUpdatePerson(0, f, v)} autoFocus />
          <div className="flex items-center justify-center pt-8">
            <span className="font-display text-[28px] text-[#866857]">&</span>
          </div>
          <PersonColumn person={persons[1]} onChange={(f, v) => onUpdatePerson(1, f, v)} />
        </div>
      )}

      {persons.slice(2).map((p, idx) => {
        const i = idx + 2;
        return (
          <div key={i} className="flex gap-2 items-start border-t border-border pt-4">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input placeholder="Nombre *" value={p.firstName} onChange={(e) => onUpdatePerson(i, "firstName", e.target.value)} />
              <Input placeholder="Apellidos" value={p.lastName} onChange={(e) => onUpdatePerson(i, "lastName", e.target.value)} />
              <div className="col-span-2">
                <RoleSelect value={p.role} onChange={(v) => onUpdatePerson(i, "role", v)} />
              </div>
            </div>
            <button type="button" onClick={() => onRemovePerson(i)} className="mt-2 text-brand hover:text-danger transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}

      <button type="button" onClick={onAddPerson}
        className="flex items-center gap-1.5 text-[13px] text-cta hover:text-[#b08f5d] font-medium transition-colors">
        <Plus size={15} />
        Añadir otro invitado
      </button>

      {groups.length > 0 && (
        <div>
          <Label>Asignar a grupo existente (opcional)</Label>
          <select value={groupId} onChange={(e) => onSetGroupId(e.target.value)}
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta">
            <option value="">Crear grupo nuevo</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
