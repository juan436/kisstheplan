"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Section = "pago" | "cancelar" | "cerrar";

const menuItems: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "pago", label: "Modificar método de pago", icon: <CreditCard size={18} /> },
  { key: "cancelar", label: "Cancelar Plan", icon: <XCircle size={18} /> },
  { key: "cerrar", label: "Cerrar cuenta", icon: <AlertTriangle size={18} /> },
];

export default function CuentaPage() {
  const [active, setActive] = useState<Section>("pago");

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-8 pb-16 px-4">
      <Container>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-8"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>

        <h1 className="font-display text-[32px] md:text-[40px] text-text mb-10 text-center">
          Mi Cuenta
        </h1>

        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row gap-0 md:gap-0 min-h-[480px]">
          {/* Sidebar */}
          <nav className="md:w-[260px] shrink-0 flex flex-row md:flex-col gap-1 md:border-r md:border-border md:pr-8 mb-8 md:mb-0 overflow-x-auto scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors whitespace-nowrap w-full text-left ${
                  active === item.key
                    ? "bg-[#f2efe9] text-[#866857]"
                    : "text-text/60 hover:bg-[#f9f6f3] hover:text-text"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 md:pl-10">
            <AnimatePresence mode="wait">
              {active === "pago" && <MetodoPago key="pago" />}
              {active === "cancelar" && <CancelarPlan key="cancelar" />}
              {active === "cerrar" && <CerrarCuenta key="cerrar" />}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  );
}

/* ─── Flujo 1: Modificar método de pago ─── */

function MetodoPago() {
  const [titular, setTitular] = useState("");
  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">
        Método de pago
      </h2>

      <div className="space-y-5 max-w-[380px]">
        <FieldGroup label="Titular tarjeta">
          <Input
            placeholder="Nombre completo"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            className="bg-[#f2efe9] border-none text-center h-12 rounded-xl"
          />
        </FieldGroup>

        <FieldGroup label="Número tarjeta">
          <Input
            placeholder="0000 0000 0000 0000"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="bg-[#f2efe9] border-none text-center h-12 rounded-xl"
          />
        </FieldGroup>

        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Fecha caducidad">
            <Input
              placeholder="MM/AA"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-[#f2efe9] border-none text-center h-12 rounded-xl"
            />
          </FieldGroup>
          <FieldGroup label="CVV">
            <Input
              placeholder="000"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="bg-[#f2efe9] border-none text-center h-12 rounded-xl"
            />
          </FieldGroup>
        </div>

        <Button className="w-full py-6 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
          <span className="text-[14px] font-bold tracking-[2px] uppercase">
            Guardar
          </span>
        </Button>

        {/* PayPal */}
        <div className="relative flex items-center justify-center pt-4">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <span className="relative bg-[#fdfcfb] px-3 text-[12px] text-text/40 uppercase tracking-wider">
            o bien
          </span>
        </div>

        <button className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-[#003087]/20 bg-white hover:bg-[#f9f6f3] transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#003087">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.79A.77.77 0 0 1 5.703 2.1h6.162c2.045 0 3.475.474 4.249 1.41.363.44.593.918.698 1.465.11.575.112 1.265.006 2.112l-.008.055v.484l.377.214c.32.171.575.372.77.607.328.393.54.893.631 1.486.094.609.063 1.315-.089 2.1-.176.904-.463 1.693-.852 2.34-.36.598-.822 1.088-1.37 1.453-.52.345-1.138.601-1.836.761-.677.155-1.448.234-2.292.234H11.62a.94.94 0 0 0-.63.244.97.97 0 0 0-.313.6l-.033.178-.558 3.542-.025.127a.97.97 0 0 1-.313.6.94.94 0 0 1-.63.244H7.076z" />
          </svg>
          <span className="text-[13px] font-medium text-[#003087]">
            Como método de pago
          </span>
        </button>
      </div>
    </SectionWrapper>
  );
}

/* ─── Flujo 2: Cancelar Plan ─── */

function CancelarPlan() {
  const [feedback, setFeedback] = useState("");

  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-4">
        Cancelar Plan
      </h2>

      <div className="max-w-[420px] space-y-6">
        <p className="text-[14px] text-text/70 leading-relaxed">
          Sentimos mucho que KissthePlan no haya cumplido tus expectativas.
          Nos encantaría saber cómo podemos mejorar. Si tienes un momento,
          déjanos tus sugerencias antes de cancelar.
        </p>

        <div className="space-y-2">
          <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">
            Tu opinión nos importa
          </Label>
          <textarea
            placeholder="INTRODUCIR SUGERENCIAS"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-36 bg-[#f2efe9] border-none rounded-xl p-4 text-[14px] text-text placeholder:text-text/30 placeholder:uppercase placeholder:tracking-wider resize-none focus:outline-none focus:ring-2 focus:ring-cta/30"
          />
        </div>

        <button className="text-[13px] text-cta hover:text-[#b08f5d] font-medium transition-colors uppercase tracking-wider">
          Enviar sugerencia
        </button>

        <div className="pt-4">
          <Button className="w-full py-6 bg-[#866857] hover:bg-[#6b5549] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="text-[14px] font-bold tracking-[2px] uppercase">
              Cancelar plan
            </span>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

/* ─── Flujo 3: Cerrar cuenta ─── */

function CerrarCuenta() {
  return (
    <SectionWrapper>
      <h2 className="font-display text-[24px] text-text mb-8">
        Cerrar cuenta
      </h2>

      <div className="max-w-[420px]">
        <div className="bg-[#f5f2ed] rounded-2xl p-8 space-y-5">
          <span className="inline-block bg-[#866857] text-white text-[11px] font-bold uppercase tracking-[2px] px-4 py-1.5 rounded-full">
            Importante
          </span>

          <p className="text-[14px] text-text/80 leading-relaxed">
            Al cerrar tu cuenta, <strong>toda tu información será eliminada
            de forma definitiva</strong> y no podrás volver a acceder a ella.
            Esto incluye los datos de tu boda, invitados, presupuesto,
            proveedores y cualquier contenido que hayas creado.
          </p>

          <p className="text-[14px] text-text/80 leading-relaxed">
            Te recomendamos <strong>descargar tus datos</strong> antes de
            proceder con el cierre de la cuenta.
          </p>

          <button className="text-[13px] text-cta hover:text-[#b08f5d] font-medium transition-colors uppercase tracking-wider">
            Descargar mis datos
          </button>
        </div>

        <div className="pt-8">
          <Button className="w-full py-6 bg-[#866857] hover:bg-[#6b5549] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="text-[14px] font-bold tracking-[2px] uppercase">
              Cerrar cuenta
            </span>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

/* ─── Helpers ─── */

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[#6b5549] text-[13px] font-semibold pl-1 uppercase tracking-wider">
        {label}
      </Label>
      {children}
    </div>
  );
}
