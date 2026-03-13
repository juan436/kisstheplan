"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Circle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const benefits = [
  "Lista de invitados, web + confirmaciones automáticas",
  "Plano de mesas interactivo y súper visual",
  "Control total del presupuesto y pagos (gastos reales vs. estimados)",
  "Carpeta única con todos tus proveedores y notas importantes",
];

export function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy & List */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col max-w-[550px] lg:mr-auto"
          >
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.2] text-[#866857] mb-8 lg:text-right lg:mr-10">
              Pensado para las parejas,<br />
              <span className="opacity-90">diseñado por Wedding Planners</span>
            </h2>
            
            <div className="text-[15px] md:text-[16px] text-[#6b6159] leading-relaxed space-y-4 mb-6">
              <p>
                La herramienta todo-en-uno que cualquier pareja (y
                cualquier wedding planner) querría tener para planificar su
                gran día.
              </p>
              <p>
                Automatizamos lo más pesado para que tú solo disfrutes:
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Circle className="w-4 h-4 text-[#866857] stroke-[3px]" />
                  </div>
                  <span className="text-[15px] md:text-[16px] text-[#6b6159] leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-[15px] md:text-[16px] text-[#6b6159] leading-relaxed mb-10">
              Porque organizar una boda debería sentirse como preparar
              el mejor día de vuestras vidas... no como un segundo
              trabajo.
            </p>

            <div className="flex justify-start lg:justify-center">
              <Link href="/register">
                <button className="bg-[#cca876] text-white px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold tracking-widest text-[14px] uppercase hover:bg-[#b89564] transition-colors shadow-sm">
                  Prueba Gratis
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            className="relative h-[400px] md:h-[600px] w-full"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image 
              src="/images/portada.jpg" 
              alt="Pareja planificando boda" 
              fill
              className="object-cover object-center rounded-sm shadow-md"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
