"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/container";

/* ─── FAQ Data ─────────────────────────────────────────────────────────────── */

interface FaqItem {
  question: string;
  answer: string;
  videoUrl?: string;
}

interface FaqModule {
  label: string;
  faqs: FaqItem[];
}

const FAQ_DATA: FaqModule[] = [
  {
    label: "Lista de invitados",
    faqs: [
      {
        question: "¿Cómo añado un invitado?",
        answer:
          "Puedes añadir invitados de dos formas: usando el botón '+ Añadir invitado' para un formulario completo, o haciendo clic en la fila vacía al final de la tabla para un alta rápida. Pulsa Enter para guardar.",
      },
      {
        question: "¿Cómo importo invitados desde Excel?",
        answer:
          "Pulsa el botón 'Importar Excel'. Primero descarga la plantilla para ver el formato correcto, rellénala y súbela. El sistema creará todos los invitados automáticamente.",
      },
      {
        question: "¿Puedo agrupar invitados por familia o pareja?",
        answer:
          "Sí. Crea un grupo desde el panel lateral y asigna invitados a él. Los grupos te permiten filtrar y gestionar mejor el listado.",
      },
      {
        question: "¿Cómo exporto la lista?",
        answer:
          "Usa los botones 'Exportar Excel' o 'Exportar PDF' en la parte superior de la tabla. El PDF incluye un resumen de alergias y opciones de menú.",
      },
    ],
  },
  {
    label: "Presupuesto",
    faqs: [
      {
        question: "¿Cómo añado una categoría?",
        answer:
          "Pulsa '+ Nueva categoría' al final de la tabla. Escribe el nombre y pulsa Enter para guardarla. Después puedes añadir subcategorías dentro de ella.",
      },
      {
        question: "¿Cómo marco un pago como pagado?",
        answer:
          "En el calendario de pagos, marca el checkbox 'Pagado' de la fila correspondiente. Las columnas de totales se actualizarán automáticamente en el dashboard.",
      },
      {
        question: "¿Puedo editar las celdas directamente?",
        answer:
          "Sí, haz clic en cualquier celda numérica para editarla en línea. Pulsa Enter para guardar o Esc para cancelar.",
      },
    ],
  },
  {
    label: "Tareas",
    faqs: [
      {
        question: "¿Cómo marco una tarea como completada?",
        answer:
          "Marca el checkbox a la izquierda del nombre de la tarea. El porcentaje de progreso del dashboard se actualizará automáticamente.",
      },
      {
        question: "¿Puedo asignar tareas a un colaborador?",
        answer:
          "Sí. En cada tarea, usa el desplegable 'Asignar a' para seleccionar un colaborador. Recibirán una notificación por email.",
      },
      {
        question: "¿Qué son las etapas temporales?",
        answer:
          "Las tareas están agrupadas por etapas: +12 meses, 9–12 meses, 6–8 meses, etc. Son orientativas y puedes mover tareas entre ellas o añadir las tuyas propias.",
      },
    ],
  },
  {
    label: "Web",
    faqs: [
      {
        question: "¿Cómo publico la web de mi boda?",
        answer:
          "Ve al módulo Web y completa los 3 pasos del builder (Diseño, RSVP, Contenido). Cuando estés listo, pulsa 'Publicar web'. La URL será kisstheplan.es/tu-slug.",
      },
      {
        question: "¿Puedo cambiar la URL (slug) de mi boda?",
        answer:
          "Sí, en el paso de publicación puedes editar el slug. El sistema verifica que esté disponible y lo actualiza en tiempo real.",
      },
      {
        question: "¿Cómo recibo los RSVP de los invitados?",
        answer:
          "Cuando un invitado completa el formulario de la web, su estado se actualiza automáticamente en la lista de invitados. Verás los cambios reflejados en el dashboard.",
      },
    ],
  },
  {
    label: "Proveedores",
    faqs: [
      {
        question: "¿Cómo añado un proveedor?",
        answer:
          "Pulsa '+ Añadir proveedor' en la vista de tarjetas. Introduce nombre, categoría y estado (Confirmado / Considerando). Después puedes completar la ficha con todos los detalles.",
      },
      {
        question: "¿Puedo adjuntar contratos?",
        answer:
          "Sí. En la ficha del proveedor, sección 'Contrato firmado', sube el PDF directamente. Quedará guardado y accesible desde ahí.",
      },
      {
        question: "¿El calendario de pagos es compartido con Presupuesto?",
        answer:
          "Exacto. Los pagos que vinculas a un proveedor aparecen tanto en su ficha como en el módulo de Presupuesto y en los próximos pagos del dashboard.",
      },
    ],
  },
  {
    label: "Plano de mesas",
    faqs: [
      {
        question: "¿Cómo creo una mesa?",
        answer:
          "En la vista Canvas, usa las herramientas del panel derecho para añadir una mesa redonda o rectangular. Arrástrala a la posición deseada y haz clic para asignar invitados.",
      },
      {
        question: "¿Puedo subir el plano del espacio?",
        answer:
          "Sí. Usa el botón 'Subir imagen de fondo'. Si introduces dos puntos de referencia y la distancia real entre ellos, el sistema calcula la escala automáticamente.",
      },
      {
        question: "¿Puedo tener varios planos?",
        answer:
          "Sí, puedes crear planos independientes para cada momento: aperitivo, cena, fiesta, etc.",
      },
    ],
  },
  {
    label: "Calendario",
    faqs: [
      {
        question: "¿Cómo añado un evento al calendario?",
        answer:
          "Haz clic en cualquier día del calendario y selecciona 'Nuevo evento'. También puedes añadir tareas con fecha desde el módulo Tareas y aparecerán automáticamente.",
      },
      {
        question: "¿Puedo sincronizar con Google Calendar?",
        answer:
          "Sí. En el módulo Calendario, copia el enlace de sincronización (.ics) y pégalo en Google Calendar, Apple Calendar o Outlook.",
      },
    ],
  },
  {
    label: "Guión",
    faqs: [
      {
        question: "¿Cómo funciona el guión del día?",
        answer:
          "El módulo Guión es un timeline editable con las horas del día. Puedes añadir, eliminar y reordenar líneas arrastrándolas. Hay una plantilla predefinida de boda española que puedes adaptar.",
      },
      {
        question: "¿Puedo exportar el guión a PDF?",
        answer:
          "Sí, pulsa 'Exportar PDF' desde la vista detallada. El PDF incluye el timeline formateado con horas y descripciones.",
      },
    ],
  },
  {
    label: "Notas",
    faqs: [
      {
        question: "¿Qué tipos de notas puedo crear?",
        answer:
          "Puedes crear tres tipos: texto enriquecido (estilo Word con imágenes y tablas), PDF adjunto (visualizable inline), y moodboard (imágenes por categorías + paleta de colores).",
      },
      {
        question: "¿Puedo asociar una nota a un proveedor?",
        answer:
          "Sí. Al crear o editar una nota, selecciona el proveedor en el desplegable 'Asociar a proveedor'. La nota aparecerá también en la ficha de ese proveedor.",
      },
    ],
  },
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function AyudaPage() {
  const [selectedModule, setSelectedModule] = useState<FaqModule | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  const handleSelectModule = (mod: FaqModule) => {
    setSelectedModule(mod);
    setSelectedFaq(mod.faqs[0]);
  };

  const handleBack = () => {
    setSelectedModule(null);
    setSelectedFaq(null);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-8 pb-16 px-4">
      <Container>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-8"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>

        <AnimatePresence mode="wait">
          {!selectedModule ? (
            <GridView key="grid" onSelect={handleSelectModule} />
          ) : (
            <DetailView
              key="detail"
              module={selectedModule}
              selectedFaq={selectedFaq}
              onSelectFaq={setSelectedFaq}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

/* ─── Grid View ─────────────────────────────────────────────────────────────── */

function GridView({ onSelect }: { onSelect: (mod: FaqModule) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="max-w-[700px] mx-auto pt-4"
    >
      <h1 className="font-display text-[36px] md:text-[44px] text-text mb-3">
        Ayuda
      </h1>
      <p className="text-[14px] text-text/60 mb-10 leading-relaxed">
        Aquí encontrarás preguntas frecuentes y vídeos tutoriales:
      </p>

      <div className="flex flex-wrap gap-3">
        {FAQ_DATA.map((mod) => (
          <button
            key={mod.label}
            onClick={() => onSelect(mod)}
            className="px-5 py-2.5 bg-[#f2efe9] text-[#866857] text-[14px] font-medium rounded-full hover:bg-[#e8e2d8] hover:scale-[1.03] transition-all active:scale-[0.97]"
          >
            {mod.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Detail View ────────────────────────────────────────────────────────────── */

function DetailView({
  module,
  selectedFaq,
  onSelectFaq,
  onBack,
}: {
  module: FaqModule;
  selectedFaq: FaqItem | null;
  onSelectFaq: (faq: FaqItem) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="max-w-[860px] mx-auto pt-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] text-[#866857] hover:text-[#6b5549] transition-colors font-medium"
        >
          <ChevronLeft size={18} />
          Todos los módulos
        </button>
        <span className="text-border">·</span>
        <h1 className="font-display text-[24px] text-text">{module.label}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left: question list */}
        <div className="md:w-[280px] shrink-0 space-y-2">
          {module.faqs.map((faq) => {
            const isActive = selectedFaq?.question === faq.question;
            return (
              <button
                key={faq.question}
                onClick={() => onSelectFaq(faq)}
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px] leading-snug transition-colors relative ${
                  isActive
                    ? "bg-[#f2efe9] text-[#866857] font-semibold"
                    : "bg-[#faf7f2] text-text/70 hover:bg-[#f2efe9] hover:text-text"
                }`}
              >
                {faq.question}
                {/* Arrow indicator for active */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white border border-border rotate-45 hidden md:block" />
                )}
              </button>
            );
          })}

          {/* Video tutorial button */}
          <div className="pt-4">
            <button className="flex items-center gap-2 border border-[#c47a7a] text-[#c47a7a] text-[13px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#c47a7a]/5 transition-colors w-full justify-center">
              <Play size={15} fill="currentColor" />
              Vídeo tutorial
            </button>
          </div>
        </div>

        {/* Right: answer panel */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedFaq && (
              <motion.div
                key={selectedFaq.question}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="bg-white border border-border rounded-2xl p-7 shadow-card relative"
              >
                {/* Arrow pointing left toward question list */}
                <div className="absolute left-0 top-8 -translate-x-[7px] w-3 h-3 bg-white border-l border-b border-border rotate-45 hidden md:block" />

                <h3 className="font-semibold text-[15px] text-text mb-3">
                  {selectedFaq.question}
                </h3>
                <p className="text-[14px] text-text/70 leading-relaxed">
                  {selectedFaq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
