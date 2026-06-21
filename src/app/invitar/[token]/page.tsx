"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useInviteAccept } from "./use-invite-accept";
import { InviteAuthForm } from "./invite-auth-form";

export default function InvitarPage() {
  const iv = useInviteAccept();

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-10">
        <Logo variant="mocha" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-card border border-border p-10"
      >
        {iv.step === "loading" && (
          <p className="text-center text-[14px] text-text/50">Cargando invitación...</p>
        )}

        {iv.step === "error" && (
          <div className="text-center space-y-3">
            <p className="font-display text-[22px] text-text">Invitación no válida</p>
            <p className="text-[13px] text-text/50">
              {iv.error || "Este enlace ha expirado o ya no es válido."}
            </p>
          </div>
        )}

        {iv.step === "accepting" && (
          <p className="text-center text-[14px] text-text/50">Aceptando invitación...</p>
        )}

        {iv.step === "done" && (
          <div className="text-center space-y-3">
            <p className="font-display text-[26px] text-text">¡Bienvenido/a!</p>
            <p className="text-[13px] text-text/50">
              Ya tienes acceso a la boda de{" "}
              <strong>{iv.info?.partner1Name} & {iv.info?.partner2Name}</strong>.
              Redirigiendo...
            </p>
          </div>
        )}

        {iv.step === "info" && iv.info && (
          <div className="space-y-6">
            <div>
              <p className="text-[11px] text-text/40 uppercase tracking-widest mb-2">Invitación</p>
              <h1 className="font-display text-[26px] text-text mb-1">
                {iv.info.partner1Name} & {iv.info.partner2Name}
              </h1>
              <p className="text-[13px] text-text/50">
                Te han invitado a colaborar en la organización de su boda.
              </p>
            </div>
            <Button
              onClick={() => iv.setStep("auth")}
              className="w-full py-4 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl font-bold tracking-widest uppercase text-[13px]"
            >
              Aceptar invitación
            </Button>
          </div>
        )}

        {iv.step === "auth" && iv.info && (
          <InviteAuthForm
            info={iv.info}
            authMode={iv.authMode} setAuthMode={iv.setAuthMode}
            email={iv.email} setEmail={iv.setEmail}
            password={iv.password} setPassword={iv.setPassword}
            name={iv.name} setName={iv.setName}
            error={iv.error} submitting={iv.submitting}
            handleAuth={iv.handleAuth}
            handleGoogleLogin={iv.handleGoogleLogin}
          />
        )}
      </motion.div>
    </div>
  );
}
