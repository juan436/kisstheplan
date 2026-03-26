"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, XCircle, AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MetodoPago } from "./payment-section";
import { CancelarPlan } from "./cancel-section";
import { CerrarCuenta } from "./close-account-section";

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
        <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-8">
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
