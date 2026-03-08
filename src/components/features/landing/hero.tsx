"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-[90px] min-h-screen bg-white overflow-hidden flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-12 md:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-0 items-center">
        
        {/* Left: Images composition */}
        <div className="relative w-full h-[550px] md:h-[650px] lg:h-[750px] flex items-start justify-center lg:justify-start pt-4 lg:pt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[300px] md:w-[380px] lg:w-[420px] aspect-[4/5] z-10 -translate-y-8 lg:-translate-y-12"
          >
            <Image 
              src="/images/portada.jpg" 
              alt="Pareja feliz en boda" 
              fill
              className="object-cover rounded-sm shadow-md"
              priority
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-8 md:bottom-12 lg:bottom-16 right-0 md:right-8 lg:-right-32 w-[380px] md:w-[500px] lg:w-[650px] aspect-video z-20 shadow-2xl rounded-sm overflow-hidden border-4 border-white"
          >
            <Image 
              src="/images/pantalla.jpg" 
              alt="Dashboard de la app" 
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* Right: Copy & Call to action */}
        <div className="relative w-full h-full flex flex-col justify-center">
          {/* Beige Background Block styling from mockup */}
          <div className="absolute inset-0 bg-[#f9f6f0] rounded-3xl -z-10 lg:-ml-32 lg:scale-y-[1.15]" />
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="px-8 py-16 lg:pl-40 lg:pr-16"
          >
            <h1 className="font-display font-semibold text-[40px] md:text-[52px] lg:text-[60px] leading-[1.15] text-[#7C5D4B] mb-8">
              Organiza tu boda<br />como los profesionales
            </h1>
            
            <p className="text-[18px] md:text-[21px] text-[#A69C92] font-medium leading-relaxed mb-8 max-w-[600px]">
              Lista de invitados, plano de mesas, RSVP, presupuesto, proveedores y todo lo que necesitas para organizar tu boda.
            </p>
            
            <p className="text-[20px] md:text-[24px] text-[#7C5D4B] font-display mb-10 max-w-[500px] leading-snug">
              De forma sencilla. Sin estrés.<br />Desde un solo lugar.
            </p>
            
            <div className="flex">
              <Link href="/register">
                <button className="bg-[#c8b8a6] text-white px-10 py-4 rounded-xl font-bold tracking-wider text-[15px] hover:bg-[#b09e89] transition-colors shadow-sm uppercase">
                  Planifica ya
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
