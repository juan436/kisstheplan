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
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function Step2({
  partner1Name, setPartner1Name, partner2Name, setPartner2Name,
  weddingDate, setWeddingDate, venue, setVenue,
  estimatedGuests, setEstimatedGuests, loading, onNext, onBack,
}: Step2Props) {
  return (
    <Card variant="elevated" className="p-8 md:p-10">
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-10">
        {/* Left: Información de la boda */}
        <div className="space-y-6">
          <h2 className="font-display text-[26px] text-[#A0877C] mb-8 text-center md:text-left">Información de la boda</h2>
          <div className="space-y-3">
            <Label className="text-[#6b5549] text-[13px] font-semibold">Datos de la pareja</Label>
            <div className="flex flex-col gap-2 relative">
              <Input placeholder="Nombre" value={partner1Name} onChange={(e) => setPartner1Name(e.target.value)} disabled={loading} className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91]" />
              <span className="font-display text-[20px] text-[#A0877C] mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-2">&</span>
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
        </div>

        {/* Dividers */}
        <div className="hidden md:block w-px bg-border my-8" />
        <div className="block md:hidden h-px w-full bg-border my-2" />

        {/* Right: Información de pago */}
        <div className="space-y-6 flex flex-col">
          <h2 className="font-display text-[26px] text-[#A0877C] mb-6 text-center md:text-left">Información de pago</h2>
          <div className="text-[14px] text-[#6b6159] leading-relaxed">
            <p><strong className="font-bold text-[#866857]">No se te cobrará nada ahora</strong>, tienes <strong className="font-bold text-[#866857]">7 días gratis de prueba.</strong></p>
            <p className="mt-1 opacity-90 text-[13px]">Una vez pasados los 7 días, si no cancelas antes, se te cobrará el importe anual - 70€.</p>
          </div>
          <div className="space-y-4 mt-8 flex-1">
            <Input placeholder="TITULAR TARJETA" disabled className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91] placeholder:uppercase placeholder:text-[12px]" />
            <Input placeholder="Número tarjeta" disabled className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91] placeholder:text-[13px]" />
            <div className="grid grid-cols-[45%_auto_45%] gap-2 items-center">
              <Input placeholder="cvv" disabled className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91] placeholder:uppercase placeholder:text-[12px]" />
              <div className="flex justify-center -mb-2 mt-4 mx-2">
                <div className="w-2 h-2 rounded-full border-[1.5px] border-[#a0877c]" />
              </div>
              <Input placeholder="Fecha caducidad" disabled className="bg-[#f2efe9] border-transparent text-center h-11 shadow-sm placeholder:text-[#a89f91] placeholder:text-[13px]" />
            </div>
            <Button disabled variant="secondary" className="w-full bg-[#f2efe9] hover:bg-[#e8e0d5] text-[#6b6159] border-transparent h-11 shadow-sm flex items-center justify-center gap-2 mt-4">
              <svg width="60" height="auto" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.3 14H30C28.7 14 27.6 14.9 27.4 16.2L20.6 58.7C20.4 59.5 21.1 60.3 22 60.3H31C32.3 60.3 33.4 59.4 33.6 58.1L35.2 47.9C35.4 46.6 36.5 45.7 37.8 45.7H40.7C52.7 45.7 59.1 39.9 61 28.5C61.8 23.3 60.9 19.3 58 16.5C54.6 14.8 49.3 14 42.3 14ZM45.8 28.9C44.7 36 39.4 36 33.7 36H30.5L32.8 21.5C32.9 21.1 33.3 20.8 33.7 20.8H35.8C40.6 20.8 44 21.3 45.6 23.4C46.8 24.8 47 26.5 45.8 28.9Z" fill="#003087"/>
                <path d="M110.1 27.2L108 39.7C107.8 40.5 108.5 41.3 109.4 41.3H118.5C119.8 41.3 120.9 40.4 121.1 39.1L124.9 15C125.1 14.2 124.4 13.4 123.5 13.4H114.6C113.3 13.4 112.2 14.3 112 15.6L110.1 27.2ZM128.2 27.2L126.1 39.7C125.9 40.5 126.6 41.3 127.5 41.3H136.6C137.9 41.3 139 40.4 139.2 39.1L143 15C143.2 14.2 142.5 13.4 141.6 13.4H132.7C131.4 13.4 130.3 14.3 130.1 15.6L128.2 27.2Z" fill="#009CDE"/>
                <path d="M85 14H70.7C69.4 14 68.3 14.9 68.1 16.2L64.4 39.3C64.2 40.1 64.9 40.9 65.8 40.9H74C75.3 40.9 76.4 40 76.6 38.7L77 36.3H82.2C89.5 36.3 94.3 32.7 95.8 25.6C96.9 20.6 94.8 14 85 14ZM84.7 24.5C84 28.6 80.5 28.6 77.2 28.6H74.8L76 21C76.1 20.5 76.6 20.1 77.1 20.1H78.8C81.8 20.1 84.1 20.4 85.1 21.8C85.7 22.5 85.9 23.3 84.7 24.5Z" fill="#003087"/>
              </svg>
              <span className="text-[13px] ml-1 opacity-70">Usa PayPal como método de pago</span>
            </Button>
          </div>
          <div className="flex justify-end mt-8 gap-3">
            <Button type="button" variant="ghost" className="text-brand text-[13px]" onClick={onBack} disabled={loading}>Atrás</Button>
            <Button type="submit" variant="cta" className="px-10 py-5 bg-[#CBA978] hover:bg-[#b08f5d]" disabled={loading}>
              {loading ? "Cargando..." : "COMENZAR"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
