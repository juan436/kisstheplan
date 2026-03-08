"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { StepIndicator } from "@/components/features/auth/step-indicator";
import { Check } from "lucide-react";
import Link from "next/link";

const steps = ["Cuenta", "Tu boda", "Pago"];

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
  const [estimatedBudget, setEstimatedBudget] = useState("");

  async function handleStep1() {
    setError("");

    if (!useRealApi) {
      setStep(1);
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError("Rellena todos los campos");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

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

    if (!useRealApi) {
      setStep(2);
      return;
    }

    if (!partner1Name || !partner2Name) {
      setError("Introduce los nombres de los novios");
      return;
    }

    setLoading(true);
    try {
      await createWedding({
        partner1Name,
        partner2Name,
        date: weddingDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        venue: venue || "",
        estimatedGuests: parseInt(estimatedGuests) || 100,
        estimatedBudget: parseInt(estimatedBudget) || 30000,
      });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la boda");
    } finally {
      setLoading(false);
    }
  }

  function handleStep3() {
    // Skip payment for now (trial period)
    router.push("/app");
  }

  function back() {
    if (step > 0) {
      setError("");
      setStep(step - 1);
    }
  }

  return (
    <div className="min-h-screen bg-bg2 flex flex-col items-center pt-10 pb-10 px-4">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-[600px]">
        <StepIndicator steps={steps} current={step} />

        {error && (
          <div className="bg-danger/10 text-danger text-[13px] rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <Step1
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                loading={loading}
                onNext={handleStep1}
              />
            )}
            {step === 1 && (
              <Step2
                partner1Name={partner1Name}
                setPartner1Name={setPartner1Name}
                partner2Name={partner2Name}
                setPartner2Name={setPartner2Name}
                weddingDate={weddingDate}
                setWeddingDate={setWeddingDate}
                venue={venue}
                setVenue={setVenue}
                estimatedGuests={estimatedGuests}
                setEstimatedGuests={setEstimatedGuests}
                estimatedBudget={estimatedBudget}
                setEstimatedBudget={setEstimatedBudget}
                loading={loading}
                onNext={handleStep2}
                onBack={back}
              />
            )}
            {step === 2 && <Step3 onNext={handleStep3} onBack={back} />}
          </motion.div>
        </AnimatePresence>

        <p className="text-[13px] text-brand text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-cta font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

interface Step1Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  loading: boolean;
  onNext: () => void;
}

function Step1({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  loading,
  onNext,
}: Step1Props) {
  return (
    <Card variant="elevated" className="p-8">
      <h2 className="font-display text-[24px] text-text text-center mb-1">
        Crea tu cuenta
      </h2>
      <p className="text-[14px] text-brand text-center mb-8">
        Empieza a planificar en minutos
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="space-y-5"
      >
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repite la contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" variant="cta" size="full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Continuar"}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[12px] text-brand">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button variant="secondary" size="full" className="gap-3" disabled>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Registrarse con Google (próximamente)
      </Button>
    </Card>
  );
}

interface Step2Props {
  partner1Name: string;
  setPartner1Name: (v: string) => void;
  partner2Name: string;
  setPartner2Name: (v: string) => void;
  weddingDate: string;
  setWeddingDate: (v: string) => void;
  venue: string;
  setVenue: (v: string) => void;
  estimatedGuests: string;
  setEstimatedGuests: (v: string) => void;
  estimatedBudget: string;
  setEstimatedBudget: (v: string) => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

function Step2({
  partner1Name,
  setPartner1Name,
  partner2Name,
  setPartner2Name,
  weddingDate,
  setWeddingDate,
  venue,
  setVenue,
  estimatedGuests,
  setEstimatedGuests,
  estimatedBudget,
  setEstimatedBudget,
  loading,
  onNext,
  onBack,
}: Step2Props) {
  return (
    <Card variant="elevated" className="p-8">
      <h2 className="font-display text-[24px] text-text text-center mb-1">
        Háblanos de tu boda
      </h2>
      <p className="text-[14px] text-brand text-center mb-8">
        Personalizaremos todo para vosotros
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="space-y-5"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label>Nombre 1</Label>
            <Input
              placeholder="Lucía"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              disabled={loading}
            />
          </div>
          <span className="font-display text-[28px] italic text-brand pb-2">&</span>
          <div className="flex-1">
            <Label>Nombre 2</Label>
            <Input
              placeholder="Pablo"
              value={partner2Name}
              onChange={(e) => setPartner2Name(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <Label>Fecha de la boda</Label>
          <Input
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label>Lugar / Finca</Label>
          <Input
            placeholder="Nombre del espacio"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Invitados aprox.</Label>
            <Input
              type="number"
              placeholder="300"
              value={estimatedGuests}
              onChange={(e) => setEstimatedGuests(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label>Presupuesto aprox.</Label>
            <Input
              type="number"
              placeholder="60000"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="full" onClick={onBack} disabled={loading}>
            Atrás
          </Button>
          <Button type="submit" variant="cta" size="full" disabled={loading}>
            {loading ? "Creando tu boda..." : "Continuar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Card variant="elevated" className="p-8">
      <h2 className="font-display text-[24px] text-text text-center mb-1">
        Método de pago
      </h2>
      <p className="text-[14px] text-brand text-center mb-8">
        7 días de prueba gratis — no te cobraremos ahora
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8">
        {/* Payment form */}
        <div className="space-y-5">
          <div className="bg-success/10 text-success text-[13px] rounded-lg px-4 py-3">
            Tu cuenta ha sido creada. Puedes empezar tu prueba gratis ahora y configurar el pago más adelante.
          </div>

          <Button onClick={onNext} variant="cta" size="full">
            Empezar prueba gratis
          </Button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[12px] text-brand">Pago diferido</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-[12px] text-brand text-center">
            La integración con Stripe y PayPal estará disponible próximamente.
            Tu prueba gratuita de 7 días comienza ahora.
          </p>

          <Button type="button" variant="ghost" size="full" onClick={onBack}>
            ← Atrás
          </Button>
        </div>

        {/* Plan summary */}
        <div className="bg-bg2 rounded-xl p-6 h-fit">
          <h3 className="font-display text-[16px] font-semibold text-text mb-4">
            Tu plan
          </h3>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between">
              <span className="text-accent">Plan Anual</span>
              <span className="font-semibold text-text">70 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-accent">Prueba gratis</span>
              <span className="text-success font-semibold">7 días</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-[14px]">
              <span className="font-semibold text-text">Hoy pagas</span>
              <span className="font-bold text-text">0 €</span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {["11 módulos", "3 usuarios", "Invitados ilimitados"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-[12px] text-accent">
                <Check size={14} className="text-cta" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
