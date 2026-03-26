"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionWrapper, FieldGroup } from "./cuenta-helpers";

export function MetodoPago() {
  const [titular, setTitular] = useState("");
  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">Método de pago</h2>
      <div className="space-y-5 max-w-[380px]">
        <FieldGroup label="Titular tarjeta">
          <Input placeholder="Nombre completo" value={titular} onChange={(e) => setTitular(e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl" />
        </FieldGroup>
        <FieldGroup label="Número tarjeta">
          <Input placeholder="0000 0000 0000 0000" value={numero} onChange={(e) => setNumero(e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl" />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Fecha caducidad">
            <Input placeholder="MM/AA" value={fecha} onChange={(e) => setFecha(e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl" />
          </FieldGroup>
          <FieldGroup label="CVV">
            <Input placeholder="000" value={cvv} onChange={(e) => setCvv(e.target.value)} className="bg-[#f2efe9] border-none text-center h-12 rounded-xl" />
          </FieldGroup>
        </div>
        <Button className="w-full py-6 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
          <span className="text-[14px] font-bold tracking-[2px] uppercase">Guardar</span>
        </Button>
        <div className="relative flex items-center justify-center pt-4">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <span className="relative bg-[#fdfcfb] px-3 text-[12px] text-text/40 uppercase tracking-wider">o bien</span>
        </div>
        <button className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-[#003087]/20 bg-white hover:bg-[#f9f6f3] transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#003087">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.79A.77.77 0 0 1 5.703 2.1h6.162c2.045 0 3.475.474 4.249 1.41.363.44.593.918.698 1.465.11.575.112 1.265.006 2.112l-.008.055v.484l.377.214c.32.171.575.372.77.607.328.393.54.893.631 1.486.094.609.063 1.315-.089 2.1-.176.904-.463 1.693-.852 2.34-.36.598-.822 1.088-1.37 1.453-.52.345-1.138.601-1.836.761-.677.155-1.448.234-2.292.234H11.62a.94.94 0 0 0-.63.244.97.97 0 0 0-.313.6l-.033.178-.558 3.542-.025.127a.97.97 0 0 1-.313.6.94.94 0 0 1-.63.244H7.076z" />
          </svg>
          <span className="text-[13px] font-medium text-[#003087]">Como método de pago</span>
        </button>
      </div>
    </SectionWrapper>
  );
}
