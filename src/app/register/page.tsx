"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/logo";
import { StepIndicator } from "@/components/features/auth/step-indicator";
import Link from "next/link";
import { Step1 } from "./register-step1";
import { Step2 } from "./register-step2";

const steps = ["Cuenta", "Configuración"];

export default function RegisterPage() {
  const router = useRouter();
  const { register, createWedding } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

  // Step 1 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // Step 2 state
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [venue, setVenue] = useState("");
  const [estimatedGuests, setEstimatedGuests] = useState("");

  async function handleStep1() {
    setError("");
    if (!useRealApi) { setStep(1); return; }
    if (!email || !password || !confirmPassword) { setError("Rellena todos los campos"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true);
    try {
      await register(email, password, name || email.split("@")[0]);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    setError("");
    if (!useRealApi) { router.push("/app/dashboard"); return; }
    if (!partner1Name || !partner2Name) { setError("Introduce los nombres de los novios"); return; }
    setLoading(true);
    try {
      await createWedding({
        partner1Name, partner2Name,
        date: weddingDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        venue: venue || "",
        estimatedGuests: parseInt(estimatedGuests) || 100,
        estimatedBudget: 30000,
      });
      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la boda");
    } finally {
      setLoading(false);
    }
  }

  function back() {
    if (step > 0) { setError(""); setStep(step - 1); }
  }

  return (
    <div className="min-h-screen bg-bg2 flex flex-col items-center pt-10 pb-10 px-4">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-[800px]">
        <StepIndicator steps={steps} current={step} />
        {error && (
          <div className="bg-danger/10 text-danger text-[13px] rounded-lg px-4 py-3 mb-4">{error}</div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            {step === 0 && (
              <Step1
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                name={name} setName={setName}
                loading={loading} onNext={handleStep1}
              />
            )}
            {step === 1 && (
              <Step2
                partner1Name={partner1Name} setPartner1Name={setPartner1Name}
                partner2Name={partner2Name} setPartner2Name={setPartner2Name}
                weddingDate={weddingDate} setWeddingDate={setWeddingDate}
                venue={venue} setVenue={setVenue}
                estimatedGuests={estimatedGuests} setEstimatedGuests={setEstimatedGuests}
                loading={loading} onNext={handleStep2} onBack={back}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {step === 0 && (
          <p className="text-[13px] text-brand text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-cta font-semibold hover:underline">Inicia sesión</Link>
          </p>
        )}
      </div>
    </div>
  );
}
