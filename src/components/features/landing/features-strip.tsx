"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Handshake, CircleCheck, MonitorDot } from "lucide-react";

export function FeaturesStrip() {
  return (
    <section id="features" className="bg-[#e8e2d8] py-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          
          {/* Col 1 */}
          <motion.div
            className="flex flex-col items-center text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex items-center justify-center h-20 w-20">
              <Handshake className="text-[#6b5549] w-14 h-14 stroke-[1.5]" />
            </div>
            <p className="text-[15px] text-[#6b5549] leading-relaxed text-justify md:text-left">
              Controla tu presupuesto, calendario de pagos y todos los proveedores.
              Crea tu listado de tareas, guión del día, notas, carpetas de inspiración
              de manera intuitiva y visual. Descárgate toda la información para compartir
              con tus proveedores.
            </p>
          </motion.div>

          {/* Col 2 */}
          <motion.div
            className="flex flex-col items-center text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="mb-8 flex items-center justify-center h-20 w-20">
              <CircleCheck className="text-[#6b5549] w-14 h-14 stroke-[1.5]" />
            </div>
            <p className="text-[15px] text-[#6b5549] leading-relaxed text-justify md:text-left">
              Planifica tu boda junto a tu pareja con toda la información y
              funcionalidades desde un solo lugar. Olvídate de tener varios excels,
              words, power points, etc.<br/><br/>
              Todo lo que necesitas, está en KissthePlan.
            </p>
          </motion.div>

          {/* Col 3 */}
          <motion.div
            className="flex flex-col items-center text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-8 flex items-center justify-center h-20 w-20 relative">
              <MonitorDot className="text-[#6b5549] w-14 h-14 stroke-[1.5]" />
              <div className="absolute inset-0 flex items-center justify-center mt-2">
                <span className="text-[9px] font-bold text-[#6b5549] uppercase tracking-wider bg-[#e8e2d8] px-1">RSVP</span>
              </div>
            </div>
            <p className="text-[15px] text-[#6b5549] leading-relaxed text-justify md:text-left">
              Crea tu lista de invitados, tu página web de la boda y envía
              confirmación de asistencia a tus invitados. Actualizaciones
              automáticas y vinculadas con el plano de mesas para facilitarte el
              trabajo.
            </p>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
