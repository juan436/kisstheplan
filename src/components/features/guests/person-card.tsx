import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RSVP_OPTIONS, ROLE_OPTIONS, type RsvpVal, type PersonRow } from "./add-guest-group-form";
import { MultiSelectChips } from "./multi-select-chips";

interface PersonCardProps {
  person: PersonRow;
  index: number;
  onChange: (field: keyof PersonRow, val: string | boolean) => void;
  mealOptions: string[];
  allergyOptions: string[];
  transportPoints: string[];
  autoFocus?: boolean;
  onRemove?: () => void;
}

// Same select style as the individual form — proper border, no transparent bg
const sel = "w-full bg-[#f2efe9] border-[1.5px] border-border rounded-md px-3 py-[8px] text-[13px] text-text outline-none focus:border-cta";

export function PersonCard({ person, index, onChange, mealOptions, allergyOptions, transportPoints, autoFocus, onRemove }: PersonCardProps) {
  const transportValue = !person.transport ? "" : (person.transportPickupPoint || "yes");

  const handleTransport = (val: string) => {
    if (val === "") { onChange("transport", false); onChange("transportPickupPoint", ""); }
    else if (val === "yes") { onChange("transport", true); onChange("transportPickupPoint", ""); }
    else { onChange("transport", true); onChange("transportPickupPoint", val); }
  };

  return (
    <div className="bg-bg2 rounded-xl p-4 space-y-2.5 border border-border/60">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
          Persona {index + 1}
        </span>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-brand hover:text-danger transition-colors">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Fila 1: Nombre | Apellidos | Email */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-[11px] mb-0.5">Nombre *</Label>
          <Input placeholder="Nombre" value={person.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            autoFocus={autoFocus} className="bg-[#f2efe9] border-[1.5px] border-border h-9 text-[13px]" />
        </div>
        <div>
          <Label className="text-[11px] mb-0.5">Apellidos</Label>
          <Input placeholder="Apellidos" value={person.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="bg-[#f2efe9] border-[1.5px] border-border h-9 text-[13px]" />
        </div>
        <div>
          <Label className="text-[11px] mb-0.5">Email</Label>
          <Input type="email" placeholder="Email" value={person.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="bg-[#f2efe9] border-[1.5px] border-border h-9 text-[13px]" />
        </div>
      </div>

      {/* Fila 2: Rol | RSVP | Lista */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-[11px] mb-0.5">Rol</Label>
          <select value={person.role} onChange={(e) => onChange("role", e.target.value)} className={sel}>
            {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-[11px] mb-0.5">RSVP</Label>
          <select value={person.rsvpStatus} onChange={(e) => onChange("rsvpStatus", e.target.value as RsvpVal)} className={sel}>
            {RSVP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-[11px] mb-0.5">Lista</Label>
          <select value={person.listName} onChange={(e) => onChange("listName", e.target.value)} className={sel}>
            <option value="A">Lista A</option>
            <option value="B">Lista B</option>
          </select>
        </div>
      </div>

      {/* Fila 3: Plato (multi-select chips) */}
      <div>
        <Label className="text-[11px] mb-0.5">Plato</Label>
        {mealOptions.length > 0
          ? <MultiSelectChips options={mealOptions} selected={person.mealChoice} onChange={(v) => onChange("mealChoice", v)} />
          : <Input placeholder="Plato" value={person.mealChoice} onChange={(e) => onChange("mealChoice", e.target.value)}
              className="bg-[#f2efe9] border-[1.5px] border-border h-9 text-[13px]" />
        }
      </div>

      {/* Fila 4: Alergias (multi-select chips) */}
      <div>
        <Label className="text-[11px] mb-0.5">Alergias</Label>
        {allergyOptions.length > 0
          ? <MultiSelectChips options={allergyOptions} selected={person.allergies} onChange={(v) => onChange("allergies", v)} />
          : <Input placeholder="Alergias" value={person.allergies} onChange={(e) => onChange("allergies", e.target.value)}
              className="bg-[#f2efe9] border-[1.5px] border-border h-9 text-[13px]" />
        }
      </div>

      {/* Fila 5: Transporte */}
      <div>
        <Label className="text-[11px] mb-0.5">Transporte</Label>
        {transportPoints.length > 0 ? (
          <select value={transportValue} onChange={(e) => handleTransport(e.target.value)} className={sel}>
            <option value="">No</option>
            <option value="yes">Sí</option>
            {transportPoints.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        ) : (
          <div className="flex items-center h-[34px] px-1 gap-2">
            <input type="checkbox" checked={person.transport}
              onChange={(e) => onChange("transport", e.target.checked)}
              className="w-4 h-4 accent-cta cursor-pointer" />
            <span className="text-[13px] text-text">Necesita</span>
          </div>
        )}
      </div>
    </div>
  );
}
