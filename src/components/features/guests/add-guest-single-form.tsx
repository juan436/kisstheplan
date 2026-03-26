import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RSVP_OPTIONS, RsvpVal, RoleSelect } from "./add-guest-group-form";

export interface SingleFormState {
  firstName: string; lastName: string; email: string;
  mealChoice: string; allergies: string; transport: boolean;
  rsvpStatus: RsvpVal; role: string; listName: string; singleGroupId: string;
}

interface AddGuestSingleFormProps {
  state: SingleFormState;
  onChange: <K extends keyof SingleFormState>(field: K, val: SingleFormState[K]) => void;
  error: string;
  mealOptions: string[];
  groups: { id: string; name: string }[];
}

const sel = "w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none focus:border-cta";

export function AddGuestSingleForm({ state, onChange, error, mealOptions, groups }: AddGuestSingleFormProps) {
  const { firstName, lastName, email, mealChoice, allergies, transport, rsvpStatus, role, listName, singleGroupId } = state;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Nombre *</Label>
          <Input value={firstName} onChange={(e) => onChange("firstName", e.target.value)} placeholder="Nombre"
            error={!!error && !firstName.trim()} autoFocus />
        </div>
        <div>
          <Label>Apellidos</Label>
          <Input value={lastName} onChange={(e) => onChange("lastName", e.target.value)} placeholder="Apellidos" />
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => onChange("email", e.target.value)} placeholder="email@ejemplo.com" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Plato</Label>
          <select value={mealChoice} onChange={(e) => onChange("mealChoice", e.target.value)} className={sel}>
            <option value="">—</option>
            {mealOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <Label>RSVP</Label>
          <select value={rsvpStatus} onChange={(e) => onChange("rsvpStatus", e.target.value as RsvpVal)} className={sel}>
            {RSVP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <Label>Rol</Label>
          <RoleSelect value={role} onChange={(v) => onChange("role", v)} />
        </div>
      </div>

      <div>
        <Label>Alergias / Restricciones</Label>
        <Input value={allergies} onChange={(e) => onChange("allergies", e.target.value)} placeholder="Ej: celiaco, intolerante a la lactosa..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Lista</Label>
          <select value={listName} onChange={(e) => onChange("listName", e.target.value)} className={sel}>
            <option value="A">Lista A</option>
            <option value="B">Lista B</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={transport} onChange={(e) => onChange("transport", e.target.checked)} className="w-4 h-4 rounded border-border accent-cta" />
            <span className="text-[13px] text-text">Necesita transporte</span>
          </label>
        </div>
      </div>

      {groups.length > 0 && (
        <div>
          <Label>Grupo (opcional)</Label>
          <select value={singleGroupId} onChange={(e) => onChange("singleGroupId", e.target.value)} className={sel}>
            <option value="">Sin grupo</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
