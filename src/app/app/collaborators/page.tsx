"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCollaborators } from "./use-collaborators";
import { CollaboratorCard } from "./collaborator-card";
import { AddCollaboratorForm } from "./add-collaborator-form";

export default function ColaboradoresPage() {
  const c = useCollaborators();

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-8 pb-16 px-4">
      <Container>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-8"
        >
          <ArrowLeft size={16} />
          Volver al inicio
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
          <p className="text-[14px] text-text/60 mb-10 leading-relaxed">
            Hasta 3 colaboradores con acceso total a la boda.
          </p>

          {!c.loading && c.collaborators.length > 0 && (
            <div className="mb-10 space-y-3">
              <p className="text-[11px] text-text/40 uppercase tracking-widest mb-3">
                Colaboradores actuales
              </p>
              {c.collaborators.map((collab) => (
                <CollaboratorCard key={collab.id} collaborator={collab} onRevoke={c.handleRevoke} />
              ))}
            </div>
          )}

          {c.globalError && (
            <p className="text-[12px] text-danger mb-4">{c.globalError}</p>
          )}

          {c.slotsLeft > 0 ? (
            <AddCollaboratorForm
              mode={c.mode} setMode={c.setMode}
              inviteEmail={c.inviteEmail} setInviteEmail={c.setInviteEmail}
              inviteError={c.inviteError} setInviteError={c.setInviteError}
              inviting={c.inviting} handleInvite={c.handleInvite}
              manualName={c.manualName} setManualName={c.setManualName}
              manualEmail={c.manualEmail} setManualEmail={c.setManualEmail}
              manualPassword={c.manualPassword} setManualPassword={c.setManualPassword}
              manualError={c.manualError} setManualError={c.setManualError}
              creating={c.creating} handleCreateManual={c.handleCreateManual}
            />
          ) : (
            <p className="text-[13px] text-text/50 text-center mt-4">
              Has alcanzado el máximo de 3 colaboradores.
            </p>
          )}

          <p className="text-[12px] text-text/30 text-center mt-12 leading-relaxed">
            Los colaboradores tienen acceso completo a todos los módulos.
            Puedes revocar el acceso en cualquier momento.
          </p>
        </motion.div>
      </Container>
    </div>
  );
}
