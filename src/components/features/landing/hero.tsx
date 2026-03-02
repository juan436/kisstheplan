"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CountdownRing } from "@/components/ui/countdown-ring";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-bg">
      <div className="max-w-[1200px] mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[11px] font-bold text-cta uppercase tracking-[3px] mb-4 block">
            Planificador de bodas
          </span>
          <h1 className="font-display text-[48px] md:text-[56px] leading-[1.1] text-text mb-6">
            Tu boda,{" "}
            <span className="italic text-cta">organizada</span>
            <br />
            con estilo
          </h1>
          <p className="text-[16px] text-accent leading-relaxed mb-8 max-w-[440px]">
            Todo lo que necesitas para planificar la boda perfecta. Invitados,
            presupuesto, proveedores, mesas y mucho más — en un solo lugar
            diseñado con mimo.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="cta" size="lg">
                Empezar gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right: Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card variant="elevated" className="relative overflow-hidden">
            <div className="flex flex-col items-center gap-6 py-4">
              {/* Mini dashboard preview */}
              <div className="text-center">
                <p className="text-[11px] font-bold text-cta uppercase tracking-[2px] mb-2">
                  Cuenta atrás
                </p>
                <h3 className="font-display text-[24px] italic text-text">
                  Lucía & Pablo
                </h3>
              </div>
              <CountdownRing days={199} totalDays={365} size="lg" />
              <div className="grid grid-cols-3 gap-6 w-full">
                <StatPill value="145" label="Confirmados" color="bg-success/15 text-success" />
                <StatPill value="38" label="Pendientes" color="bg-cta/15 text-cta" />
                <StatPill value="12" label="Rechazados" color="bg-danger/15 text-danger" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function StatPill({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl px-3 py-2.5 text-center ${color}`}>
      <div className="text-[20px] font-display font-bold leading-none">{value}</div>
      <div className="text-[9px] font-semibold uppercase tracking-[0.5px] mt-1 opacity-80">
        {label}
      </div>
    </div>
  );
}
