import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface Step2Props {
  partner1Name: string;
  setPartner1Name: (v: string) => void;
  partner2Name: string;
  setPartner2Name: (v: string) => void;
  weddingDate: string;
  setWeddingDate: (v: string) => void;
  venue: string;
  setVenue: (v: string) => void;
  estimatedGuests: string;
  setEstimatedGuests: (v: string) => void;
  estimatedBudget: string;
  setEstimatedBudget: (v: string) => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function Step2({
  partner1Name, setPartner1Name, partner2Name, setPartner2Name,
  weddingDate, setWeddingDate, venue, setVenue,
  estimatedGuests, setEstimatedGuests,
  estimatedBudget, setEstimatedBudget,
  loading, onNext, onBack,
}: Step2Props) {
  return (
    <Card variant="elevated" className="p-8 md:p-10">
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="max-w-[420px] mx-auto space-y-6">
        <h2 className="font-display text-[26px] text-[#A0877C] mb-8 text-center md:text-left">Información de la boda</h2>
        <div className="space-y-3">
          <Label className="text-[#6b5549] text-[13px] font-semibold">Datos de la pareja</Label>
          <div className="flex flex-col gap-2 relative">
            <Input placeholder="Nombre" value={partner1Name} onChange={(e) => setPartner1Name(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91]" />
            <span className="font-display text-[20px] text-[#A0877C] mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">&</span>
            <Input placeholder="Nombre" value={partner2Name} onChange={(e) => setPartner2Name(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91] mt-3" />
          </div>
        </div>
        <div className="space-y-1 relative">
          <Label className="text-[#6b5549] text-[13px] font-semibold">Fecha de la boda</Label>
          <Input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm text-[#a89f91]" />
        </div>
        <div className="space-y-1">
          <Label className="text-[#6b5549] text-[13px] font-semibold">Lugar de la boda</Label>
          <Input placeholder="Nombre" value={venue} onChange={(e) => setVenue(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91]" />
        </div>
        <div className="space-y-1">
          <Label className="text-[#6b5549] text-[13px] font-semibold">Número de invitados</Label>
          <Input type="number" placeholder="Número" value={estimatedGuests} onChange={(e) => setEstimatedGuests(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91]" />
        </div>
        <div className="space-y-1">
          <Label className="text-[#6b5549] text-[13px] font-semibold">Presupuesto estimado</Label>
          <Input type="number" placeholder="ej: 30000" value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91]" />
          <p className="text-[11px] text-[#a89f91] text-center">Puedes modificarlo más tarde</p>
        </div>

        <div className="flex justify-end mt-8 gap-3">
          <Button type="button" variant="ghost" className="text-brand text-[13px]" onClick={onBack} disabled={loading}>Atrás</Button>
          <Button type="submit" variant="cta" className="px-10 py-5 bg-[#CBA978] hover:bg-[#b08f5d]" disabled={loading}>
            {loading ? "Cargando..." : "COMENZAR"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
