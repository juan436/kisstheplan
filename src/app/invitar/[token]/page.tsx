"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/features/auth/auth-form";
import { useInviteAccept } from "./use-invite-accept";

export default function InvitarPage() {
  const iv = useInviteAccept();
  const router = useRouter();

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

        {iv.step === "wrong-user" && (
          <div className="text-center space-y-4">
            <p className="font-display text-[22px] text-text">Cuenta incorrecta</p>
            <p className="text-[13px] text-text/50">
              Hay una sesión activa con <strong>{iv.currentUserEmail}</strong>.<br />
              Esta invitación es para <strong>{iv.info?.email}</strong>.
            </p>
            <Button
              onClick={iv.handleLogoutAndContinue}
              className="w-full py-4 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl font-bold tracking-widest uppercase text-[13px]"
            >
              Cerrar sesión y continuar
            </Button>
          </div>
        )}

        {iv.step === "already-accepted" && (
          <div className="text-center space-y-3">
            <p className="font-display text-[22px] text-text">Invitación ya aceptada</p>
            <p className="text-[13px] text-text/50">
              Ya formas parte de la boda de{" "}
              <strong>{iv.info?.partner1Name} & {iv.info?.partner2Name}</strong>.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full py-4 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl font-bold tracking-widest uppercase text-[13px]"
            >
              Iniciar sesión
            </Button>
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
          <AuthForm
            header={
              <div className="mb-2">
                <p className="text-[11px] text-text/40 uppercase tracking-widest mb-1">Invitación</p>
                <h1 className="font-display text-[22px] text-text">
                  {iv.info.partner1Name} & {iv.info.partner2Name}
                </h1>
              </div>
            }
            showTabs
            prefillEmail={iv.info.email}
            onSubmit={async (email, password, mode, name) => {
              await iv.handleAuth(email, password, mode, name);
            }}
            onGoogleLogin={iv.handleGoogleLogin}
            submitLabel={{ login: "Entrar y aceptar", register: "Registrarme y aceptar" }}
            error={iv.error}
            submitting={iv.submitting}
          />
        )}
      </motion.div>
    </div>
  );
}
