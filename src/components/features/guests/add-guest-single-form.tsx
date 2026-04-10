import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RSVP_OPTIONS, RsvpVal, RoleSelect } from "./add-guest-group-form";
import { MultiSelectChips } from "./multi-select-chips";

export interface SingleFormState {
  firstName: string; lastName: string; email: string;
  mealChoice: string; allergies: string;
  transport: boolean; transportPickupPoint: string;
  rsvpStatus: RsvpVal; role: string; listName: string; singleGroupId: string;
}

interface AddGuestSingleFormProps {
  state: SingleFormState;
  onChange: <K extends keyof SingleFormState>(field: K, val: SingleFormState[K]) => void;
  error: string;
  mealOptions: string[];
  allergyOptions: string[];
  transportPoints: string[];
  groups: { id: string; name: string }[];
}

const sel = "w-full bg-[#f2efe9] border-[1.5px] border-border rounded-md px-4 py-[8px] text-[14px] font-body text-text outline-none focus:border-cta";

export function AddGuestSingleForm({ state, onChange, error, mealOptions, allergyOptions, transportPoints, groups }: AddGuestSingleFormProps) {
  const { firstName, lastName, email, mealChoice, allergies, transport, transportPickupPoint, rsvpStatus, role, listName, singleGroupId } = state;

  const handleTransportChange = (val: string) => {
    if (val === "") { onChange("transport", false); onChange("transportPickupPoint", ""); }
    else if (val === "yes") { onChange("transport", true); onChange("transportPickupPoint", ""); }
    else { onChange("transport", true); onChange("transportPickupPoint", val); }
  };
  const transportSelectValue = !transport ? "" : (transportPickupPoint || "yes");

  return (
    <div className="space-y-3">
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
          <Label>RSVP</Label>
          <select value={rsvpStatus} onChange={(e) => onChange("rsvpStatus", e.target.value as RsvpVal)} className={sel}>
            {RSVP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <Label>Rol</Label>
          <RoleSelect value={role} onChange={(v) => onChange("role", v)} />
        </div>
        <div>
          <Label>Lista</Label>
          <select value={listName} onChange={(e) => onChange("listName", e.target.value)} className={sel}>
            <option value="A">Lista A</option>
            <option value="B">Lista B</option>
          </select>
        </div>
      </div>

      <div>
        <Label>Plato</Label>
        {mealOptions.length > 0
          ? <MultiSelectChips options={mealOptions} selected={mealChoice} onChange={(v) => onChange("mealChoice", v)} />
          : <Input value={mealChoice} onChange={(e) => onChange("mealChoice", e.target.value)} placeholder="Ej: Carne, Pescado..." />
        }
      </div>

      <div>
        <Label>Alergias / Restricciones</Label>
        {allergyOptions.length > 0
          ? <MultiSelectChips options={allergyOptions} selected={allergies} onChange={(v) => onChange("allergies", v)} />
          : <Input value={allergies} onChange={(e) => onChange("allergies", e.target.value)} placeholder="Ej: celiaco, intolerante a la lactosa..." />
        }
      </div>

      <div>
        <Label>Transporte</Label>
        {transportPoints.length > 0 ? (
          <select value={transportSelectValue} onChange={(e) => handleTransportChange(e.target.value)} className={sel}>
            <option value="">No necesita</option>
            <option value="yes">Sí (sin punto)</option>
            {transportPoints.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        ) : (
          <div className="flex items-center h-[36px]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={transport} onChange={(e) => onChange("transport", e.target.checked)} className="w-4 h-4 rounded border-border accent-cta" />
              <span className="text-[13px] text-text">Necesita transporte</span>
            </label>
          </div>
        )}
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
