"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type Status = "idle" | "loading" | "success" | "error";

export function EarlyAccessForm() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch(`${API_URL}/leads/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Error al registrarse");
      }
      setStatus("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Inténtalo de nuevo");
      setStatus("error");
    }
  };

  return (
    <section style={{ backgroundColor: "#F8F3ED" }} className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mx-auto text-center"
      >
        <span className="inline-block text-[11px] uppercase tracking-[3px] text-[#9b8b7b] mb-4">
          Early Access
        </span>
        <h2 className="font-display text-[32px] md:text-[40px] text-[#4A3C32] leading-tight mb-3">
          Sé de los primeros en probar KissthePlan
        </h2>
        <p className="text-[15px] text-[#4A3C32]/60 mb-8 leading-relaxed">
          Déjanos tu email y te avisaremos en cuanto abra la lista de acceso anticipado.
        </p>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-6"
          >
            <CheckCircle2 size={40} className="text-[#7db87d]" />
            <p className="text-[16px] font-medium text-[#4A3C32]">¡Anotado! Te avisaremos pronto.</p>
            <p className="text-[13px] text-[#4A3C32]/50">Recibirás un email en <span className="font-medium">{email}</span></p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b8b7b]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#D4C9B8] bg-white text-[14px] text-[#4A3C32] placeholder:text-[#9b8b7b] outline-none focus:border-[#B4A494] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3.5 rounded-xl text-[13px] font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-85 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: "#B4A494" }}
            >
              {status === "loading"
                ? <><Loader2 size={15} className="animate-spin" /> Enviando...</>
                : "Quiero acceso anticipado"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-[13px] text-[#c47a7a]">{errMsg}</p>
        )}
      </motion.div>
    </section>
  );
}
