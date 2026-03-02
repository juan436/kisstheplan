"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CheckSquare,
  Globe,
  Store,
  Grid3X3,
  Calendar,
  FileText,
  StickyNote,
  UserPlus,
} from "lucide-react";

const modules = [
  { icon: LayoutDashboard, name: "Dashboard", desc: "Vista general de tu boda", highlight: false },
  { icon: Users, name: "Invitados", desc: "Gestiona tu lista completa", highlight: false },
  { icon: Wallet, name: "Presupuesto", desc: "Control total de gastos", highlight: true },
  { icon: CheckSquare, name: "Tareas", desc: "Tu to-do list nupcial", highlight: false },
  { icon: Globe, name: "Web de boda", desc: "Tu página personalizada", highlight: false },
  { icon: Store, name: "Proveedores", desc: "Directorio y contactos", highlight: false },
  { icon: Grid3X3, name: "Plano de mesas", desc: "Organiza el seating", highlight: false },
  { icon: Calendar, name: "Calendario", desc: "Todas las fechas clave", highlight: false },
  { icon: FileText, name: "Guión", desc: "El timeline del día", highlight: false },
  { icon: StickyNote, name: "Notas", desc: "Apuntes y recordatorios", highlight: false },
  { icon: UserPlus, name: "Colaboradores", desc: "Invita a tu equipo", highlight: false },
];

export function ModulesGrid() {
  return (
    <section id="modules" className="py-24 bg-bg">
      <Container>
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold text-cta uppercase tracking-[3px] mb-4 block">
            Módulos
          </span>
          <h2 className="font-display text-[36px] text-text">
            Todo lo que necesitas,{" "}
            <span className="italic text-cta">nada que sobre</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.name}
                className={`rounded-xl p-6 border transition-all duration-200 hover:-translate-y-0.5 ${
                  mod.highlight
                    ? "bg-accent border-accent text-white"
                    : "bg-white border-border text-text hover:shadow-card"
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Icon
                  size={28}
                  className={mod.highlight ? "text-cta mb-3" : "text-cta mb-3"}
                />
                <h3
                  className={`font-display text-[16px] font-semibold mb-1 ${
                    mod.highlight ? "text-white" : "text-text"
                  }`}
                >
                  {mod.name}
                </h3>
                <p
                  className={`text-[12px] ${
                    mod.highlight ? "text-white/70" : "text-brand"
                  }`}
                >
                  {mod.desc}
                </p>
              </motion.div>
            );
          })}

          {/* Decorative card */}
          <motion.div
            className="rounded-xl p-6 bg-fill1 border border-border flex items-center justify-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <p className="text-[13px] text-brand italic text-center">
              Y más por venir...
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
