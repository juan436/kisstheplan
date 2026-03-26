"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ColaboradoresPage() {
  const [emails, setEmails] = useState(["", ""]);
  const [errors, setErrors] = useState(["", ""]);
  const [sent, setSent] = useState([false, false]);

  const handleChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);

    // Clear error while typing
    const updatedErrors = [...errors];
    updatedErrors[index] = "";
    setErrors(updatedErrors);
  };

  const handleRemove = (index: number) => {
    const updatedEmails = [...emails];
    const updatedSent = [...sent];
    updatedEmails[index] = "";
    updatedSent[index] = false;
    setEmails(updatedEmails);
    setSent(updatedSent);
  };

  const handleInvite = () => {
    const newErrors = emails.map((email) => {
      if (!email.trim()) return "";
      if (!isValidEmail(email.trim())) return "Email no válido";
      return "";
    });
    setErrors(newErrors);

    const hasErrors = newErrors.some((e) => e !== "");
    const hasFilled = emails.some((e) => e.trim() !== "");
    if (hasErrors || !hasFilled) return;

    // Mark filled emails as sent
    setSent(emails.map((e) => e.trim() !== "" && isValidEmail(e.trim())));
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[560px] mx-auto pt-6"
        >
          <h1 className="font-display text-[36px] md:text-[44px] text-text mb-4">
            Colaboradores
          </h1>
          <p className="text-[14px] text-text/60 mb-12 leading-relaxed">
            Puedes invitar hasta un máximo de 2 colaboradores más con acceso
            total a tu boda:
          </p>

          <div className="space-y-6">
            {emails.map((email, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="Introduce e-mail:"
                      value={email}
                      onChange={(e) => handleChange(i, e.target.value)}
                      disabled={sent[i]}
                      className={`bg-[#f2efe9] border-none h-12 rounded-xl text-text pr-10 ${
                        sent[i] ? "opacity-60" : ""
                      }`}
                    />
                    {sent[i] && (
                      <button
                        onClick={() => handleRemove(i)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text/30 hover:text-danger transition-colors"
                        title="Quitar"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(i)}
                    className="text-[13px] text-[#866857] hover:text-[#6b5549] transition-colors font-medium whitespace-nowrap shrink-0"
                  >
                    Eliminar acceso
                  </button>
                </div>

                {errors[i] && (
                  <p className="text-[12px] text-danger pl-1">{errors[i]}</p>
                )}
                {sent[i] && (
                  <p className="text-[12px] text-success pl-1">
                    Invitación enviada
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleInvite}
              className="px-10 py-5 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-[14px] font-bold tracking-[2px] uppercase">
                Invitar
              </span>
            </Button>
          </div>

          <p className="text-[12px] text-text/30 text-center mt-10 leading-relaxed">
            Los colaboradores tendrán acceso completo a todos los módulos de tu
            boda. Puedes revocar el acceso en cualquier momento.
          </p>
        </motion.div>
      </Container>
    </div>
  );
}
