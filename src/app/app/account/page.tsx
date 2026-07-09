"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle, Tag, User, Lock, BarChart2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/useAuth";
import { CerrarCuenta } from "./close-account-section";
import { CodigoDescuento } from "./discount-section";
import { EstadoSuscripcion } from "./subscription-section";
import { DatosPersonales } from "./personal-section";
import { CambiarContrasena } from "./password-section";

type Section = "personal" | "password" | "suscripcion" | "descuento" | "cerrar";

const ownerItems: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "personal",    label: "Datos personales",         icon: <User size={18} /> },
  { key: "password",    label: "Cambiar contraseña",        icon: <Lock size={18} /> },
  { key: "suscripcion", label: "Estado suscripción",        icon: <BarChart2 size={18} /> },
  { key: "descuento",   label: "Código de descuento",       icon: <Tag size={18} /> },
  { key: "cerrar",      label: "Cerrar cuenta",             icon: <AlertTriangle size={18} /> },
];

const collaboratorItems: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "personal",    label: "Datos personales",  icon: <User size={18} /> },
  { key: "password",    label: "Cambiar contraseña", icon: <Lock size={18} /> },
  { key: "cerrar",      label: "Cerrar cuenta",      icon: <AlertTriangle size={18} /> },
];

export default function CuentaPage() {
  const { activeRole } = useAuth();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get("expired") === "true";
  const isCollaborator = activeRole === 'collaborator';
  const menuItems = isCollaborator ? collaboratorItems : ownerItems;
  const [active, setActive] = useState<Section>(
    isExpired && !isCollaborator ? "suscripcion" : "personal"
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-8 pb-16 px-4">
      <Container>
        {!isExpired && (
          <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-8">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        )}

        <h1 className="font-display text-[32px] md:text-[40px] text-text mb-10 text-center">
          Mi Cuenta
        </h1>

        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row gap-0 md:gap-0 min-h-[480px]">
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

          <div className="flex-1 md:pl-10">
            <AnimatePresence mode="wait">
              {active === "personal"    && <DatosPersonales key="personal" />}
              {active === "password"    && <CambiarContrasena key="password" />}
              {active === "suscripcion" && <EstadoSuscripcion key="suscripcion" />}
              {active === "descuento"   && <CodigoDescuento key="descuento" />}
              {active === "cerrar"      && <CerrarCuenta key="cerrar" />}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  );
}
