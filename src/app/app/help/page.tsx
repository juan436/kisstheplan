"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { FAQ_DATA, type FaqModule, type FaqItem } from "./faq-data";

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

function GridView({ onSelect }: { onSelect: (mod: FaqModule) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="max-w-[700px] mx-auto pt-4"
    >
      <h1 className="font-display text-[36px] md:text-[44px] text-text mb-3">Ayuda</h1>
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
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white border border-border rotate-45 hidden md:block" />
                )}
              </button>
            );
          })}
          <div className="pt-4">
            <button className="flex items-center gap-2 border border-[#c47a7a] text-[#c47a7a] text-[13px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#c47a7a]/5 transition-colors w-full justify-center">
              <Play size={15} fill="currentColor" />
              Vídeo tutorial
            </button>
          </div>
        </div>

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
                <div className="absolute left-0 top-8 -translate-x-[7px] w-3 h-3 bg-white border-l border-b border-border rotate-45 hidden md:block" />
                <h3 className="font-semibold text-[15px] text-text mb-3">{selectedFaq.question}</h3>
                <p className="text-[14px] text-text/70 leading-relaxed">{selectedFaq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
