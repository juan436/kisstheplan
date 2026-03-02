"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const features = [
  {
    icon: "💍",
    title: "Todo en uno",
    desc: "Invitados, presupuesto, proveedores, mesas, web y más — en una sola plataforma.",
  },
  {
    icon: "✨",
    title: "Diseño elegante",
    desc: "Una experiencia visual cuidada al detalle para que planificar sea un placer.",
  },
  {
    icon: "👥",
    title: "Colaborativo",
    desc: "Comparte el acceso con tu pareja y wedding planner. Todos sincronizados.",
  },
];

export function FeaturesStrip() {
  return (
    <section id="features" className="bg-fill1 py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-white rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-[36px] mb-4">{f.icon}</div>
              <h3 className="font-display text-[20px] font-semibold text-text mb-2">
                {f.title}
              </h3>
              <p className="text-[14px] text-accent leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
