"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

export function AboutSection() {
  return (
    <section className="py-24 bg-bg">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[4/3] bg-fill1 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-[64px] mb-2">💒</div>
                <p className="font-display text-[20px] italic text-accent">
                  Vuestro día perfecto
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Copy + stats */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-[11px] font-bold text-cta uppercase tracking-[3px] mb-4 block">
              Sobre KissthePlan
            </span>
            <h2 className="font-display text-[36px] leading-[1.15] text-text mb-6">
              Planificar una boda<br />
              <span className="italic text-cta">no debería ser caótico</span>
            </h2>
            <p className="text-[15px] text-accent leading-relaxed mb-8">
              Creamos KissthePlan porque creemos que organizar tu boda debería ser tan
              especial como el gran día. Sin hojas de cálculo, sin caos — solo una
              herramienta bonita y funcional hecha para parejas reales.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "11", label: "Módulos" },
                { value: "3", label: "Usuarios" },
                { value: "∞", label: "Invitados" },
              ].map((stat) => (
                <div key={stat.label} className="bg-bg2 rounded-xl p-4 text-center">
                  <div className="font-display text-[28px] font-bold text-text">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-semibold text-brand uppercase tracking-[1px] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
