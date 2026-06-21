"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api/index";
import type { Collaborator } from "@/types";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"invite" | "manual">("invite");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviting, setInviting] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [manualPassword, setManualPassword] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualError, setManualError] = useState("");
  const [creating, setCreating] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    api.getCollaborators()
      .then((data) => setCollaborators(data as Collaborator[]))
      .finally(() => setLoading(false));
  }, []);

  const slotsLeft = 3 - collaborators.length;

  const handleRevoke = async (id: string) => {
    try {
      await api.revokeCollaborator(id);
      setCollaborators((prev) => prev.filter((c) => c.id !== id));
    } catch (e: unknown) {
      setGlobalError(e instanceof Error ? e.message : "Error al revocar acceso");
    }
  };

  const handleInvite = async () => {
    setInviteError("");
    if (!inviteEmail.trim()) return;
    if (!isValidEmail(inviteEmail.trim())) { setInviteError("Email no válido"); return; }
    setInviting(true);
    try {
      const collab = await api.inviteCollaborator(inviteEmail.trim());
      setCollaborators((prev) => [...prev, collab as Collaborator]);
      setInviteEmail("");
    } catch (e: unknown) {
      setInviteError(e instanceof Error ? e.message : "Error al enviar invitación");
    } finally {
      setInviting(false);
    }
  };

  const handleCreateManual = async () => {
    setManualError("");
    if (!manualName.trim() || !manualEmail.trim() || !manualPassword.trim()) {
      setManualError("Todos los campos son obligatorios"); return;
    }
    if (!isValidEmail(manualEmail.trim())) { setManualError("Email no válido"); return; }
    if (manualPassword.length < 6) {
      setManualError("La contraseña debe tener al menos 6 caracteres"); return;
    }
    setCreating(true);
    try {
      const collab = await api.createManualCollaborator({
        email: manualEmail.trim(),
        password: manualPassword,
        name: manualName.trim(),
      });
      setCollaborators((prev) => [...prev, collab as Collaborator]);
      setManualEmail(""); setManualPassword(""); setManualName("");
    } catch (e: unknown) {
      setManualError(e instanceof Error ? e.message : "Error al crear cuenta");
    } finally {
      setCreating(false);
    }
  };

  return {
    collaborators, loading, slotsLeft,
    mode, setMode,
    inviteEmail, setInviteEmail, inviteError, setInviteError, inviting, handleInvite,
    manualEmail, setManualEmail, manualPassword, setManualPassword,
    manualName, setManualName, manualError, setManualError, creating, handleCreateManual,
    globalError, handleRevoke,
  };
}
