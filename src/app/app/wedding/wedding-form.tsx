import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "./custom-select";
import { SectionTitle } from "./section-title";

const TIMEZONE_LABELS: Record<string, string> = {
  "Europe/Madrid": "Madrid (Por defecto)",
  "Europe/London": "Londres",
  "America/New_York": "Nueva York",
  "America/Mexico_City": "México DF",
};

const CURRENCY_LABELS: Record<string, string> = {
  EUR: "Euro (Por defecto)",
  USD: "Dólar USD",
  MXN: "Peso MXN",
  GBP: "Libra GBP",
};

export interface WeddingFormData {
  partner1Role: string; partner1Name: string; partner1Last: string;
  partner2Role: string; partner2Name: string; partner2Last: string;
  venue: string; location: string; date: string;
  timezone: string; currency: string;
  estimatedGuests: string; estimatedBudget: string;
}

interface WeddingFormProps {
  data: WeddingFormData;
  onChange: (field: string, value: string) => void;
}

export function WeddingForm({ data, onChange }: WeddingFormProps) {
  return (
    <div className="space-y-8">
      {/* Partners */}
      <SectionTitle title="Datos de la pareja" />
      <Card variant="elevated" className="overflow-visible border-none shadow-sm pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-4 px-2">
          <div className="space-y-6">
            <CustomSelect label="Rol" value={data.partner1Role} options={["Novio", "Novia", "Otro"]} onChange={(v) => onChange("partner1Role", v)} />
            <div className="space-y-4">
              <Input placeholder="Nombre" value={data.partner1Name} onChange={(e) => onChange("partner1Name", e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text font-medium" />
              <Input placeholder="Apellidos" value={data.partner1Last} onChange={(e) => onChange("partner1Last", e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text" />
            </div>
          </div>
          <div className="flex justify-center"><span className="font-display text-[32px] text-[#866857]">&</span></div>
          <div className="space-y-6">
            <CustomSelect label="Rol" value={data.partner2Role} options={["Novio", "Novia", "Otro"]} onChange={(v) => onChange("partner2Role", v)} />
            <div className="space-y-4">
              <Input placeholder="Nombre" value={data.partner2Name} onChange={(e) => onChange("partner2Name", e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text font-medium" />
              <Input placeholder="Apellidos" value={data.partner2Last} onChange={(e) => onChange("partner2Last", e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text" />
            </div>
          </div>
        </div>
      </Card>

      {/* Event details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionTitle title="Lugar de la boda" />
          <Card variant="default" className="p-6 space-y-4 border-none shadow-sm bg-white/50">
            <Input placeholder="Nombre del lugar" value={data.venue} onChange={(e) => onChange("venue", e.target.value)} className="bg-[#f2efe9] border-none text-center h-11" />
            <Input placeholder="Dirección" value={data.location} onChange={(e) => onChange("location", e.target.value)} className="bg-[#f2efe9] border-none text-center h-11" />
            <div className="text-center">
              <span className="text-[11px] text-[#A0877C] uppercase tracking-wider bg-[#f2efe9] px-2 py-1 rounded-full cursor-pointer hover:bg-[#e8e2d8] transition-colors">Posibilidad de buscar en Maps</span>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">Nº Invitados</Label>
              <Input type="number" value={data.estimatedGuests} onChange={(e) => onChange("estimatedGuests", e.target.value)} className="bg-[#f2efe9] border-none text-center h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">Presupuesto</Label>
              <Input type="number" value={data.estimatedBudget} onChange={(e) => onChange("estimatedBudget", e.target.value)} className="bg-[#f2efe9] border-none text-center h-11" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <SectionTitle title="Fecha de la boda" />
            <Input type="date" value={data.date} onChange={(e) => onChange("date", e.target.value)} className="bg-[#f2efe9] border-none text-center h-11" />
          </div>
          <div className="space-y-2">
            <SectionTitle title="Uso horario" />
            <CustomSelect
              value={TIMEZONE_LABELS[data.timezone] || data.timezone}
              options={Object.values(TIMEZONE_LABELS)}
              onChange={(v) => {
                const tz = Object.entries(TIMEZONE_LABELS).find(([, label]) => label === v);
                onChange("timezone", tz ? tz[0] : v);
              }}
            />
          </div>
          <div className="space-y-2">
            <SectionTitle title="Moneda" />
            <CustomSelect
              value={CURRENCY_LABELS[data.currency] || data.currency}
              options={Object.values(CURRENCY_LABELS)}
              onChange={(v) => {
                const cur = Object.entries(CURRENCY_LABELS).find(([, label]) => label === v);
                onChange("currency", cur ? cur[0] : v);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
