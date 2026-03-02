"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const features = [
  "Todos los módulos incluidos",
  "Hasta 3 usuarios (pareja + 1)",
  "Invitados ilimitados",
  "Web de boda personalizada",
  "RSVP online integrado",
  "Soporte por email",
  "7 días de prueba gratis",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-bg2">
      <Container>
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-cta uppercase tracking-[3px] mb-4 block">
            Precio
          </span>
          <h2 className="font-display text-[36px] text-text">
            Un plan, <span className="italic text-cta">todo incluido</span>
          </h2>
        </div>

        <motion.div
          className="max-w-[420px] mx-auto bg-white rounded-2xl border border-border overflow-hidden shadow-elevated"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Gold gradient top bar */}
          <div
            className="h-1.5"
            style={{
              background: "linear-gradient(90deg, var(--color-cta), var(--color-accent))",
            }}
          />

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="font-display text-[52px] font-bold text-text">70</span>
                <span className="font-display text-[24px] text-brand">€</span>
              </div>
              <p className="text-[14px] text-brand">/ año</p>
              <p className="text-[12px] text-cta font-semibold mt-2">
                7 días de prueba gratis — sin tarjeta
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check size={16} className="text-cta shrink-0" />
                  <span className="text-[14px] text-text">{f}</span>
                </div>
              ))}
            </div>

            <Link href="/register">
              <Button variant="cta" size="full">
                Empezar prueba gratis
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
