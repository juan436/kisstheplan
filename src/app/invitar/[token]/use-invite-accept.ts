"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api/index";
import { apiLogin, apiRegister, apiRefreshTokens, isAuthenticated } from "@/services/api/auth-helpers";
import { useAuth } from "@/hooks/useAuth";
import type { CollaboratorInviteInfo } from "@/types";

const PENDING_INVITE_KEY = "ktp_pending_invite";

export type InviteStep = "loading" | "info" | "auth" | "accepting" | "done" | "error";
export type AuthMode = "login" | "register";

export function useInviteAccept() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { refreshUserData } = useAuth();

  const [step, setStep] = useState<InviteStep>("loading");
  const [info, setInfo] = useState<CollaboratorInviteInfo | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const doAccept = async () => {
    try {
      await api.acceptCollaboratorInvite(token);
      await apiRefreshTokens();
      await refreshUserData();
      localStorage.removeItem(PENDING_INVITE_KEY);
      setStep("done");
      setTimeout(() => router.push("/app/dashboard"), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al aceptar la invitación");
      setStep("error");
    }
  };

  useEffect(() => {
    api.getCollaboratorInviteInfo(token)
      .then((data) => {
        const inviteInfo = data as CollaboratorInviteInfo;
        setInfo(inviteInfo);
        setEmail(inviteInfo.email);
        if (inviteInfo.status === 'revoked') {
          setError('Esta invitación ha sido cancelada por el propietario de la boda.');
          setStep("error");
          return;
        }
        if (isAuthenticated()) {
          setStep("accepting");
          doAccept();
        } else {
          setStep("info");
        }
      })
      .catch(() => setStep("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAuth = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (authMode === "login") {
        await apiLogin(email, password);
      } else {
        await apiRegister(email, password, name || email.split("@")[0]);
      }
      setStep("accepting");
      await doAccept();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error de autenticación");
      setStep("auth");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem(PENDING_INVITE_KEY, token);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return {
    step, setStep, info,
    authMode, setAuthMode,
    email, setEmail,
    password, setPassword,
    name, setName,
    error, submitting,
    handleAuth, handleGoogleLogin,
  };
}
