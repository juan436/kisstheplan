import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface Step3Props {
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const TRIAL_FEATURES = [
  "Acceso completo a todos los módulos",
  "Sin tarjeta de crédito",
  "7 días para organizar tu boda sin límites",
  "Al terminar, elige continuar desde Mi Cuenta",
];

export function Step3({ loading, onNext, onBack }: Step3Props) {
  return (
    <Card variant="elevated" padding="default" className="p-8">
      <h2 className="font-title text-2xl text-text mb-2">Empieza gratis</h2>
      <p className="text-[13px] text-brand mb-8">
        7 días de prueba gratuita. Sin tarjeta. Sin compromiso.
      </p>

      <div className="bg-cta/5 border-2 border-cta rounded-[14px] p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-[16px] text-text">Prueba gratuita</span>
          <span className="text-[12px] font-semibold text-cta bg-cta/10 px-3 py-1 rounded-full">7 días gratis</span>
        </div>
        <ul className="space-y-2">
          {TRIAL_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-[13px] text-text/70">
              <Check size={14} className="text-cta flex-shrink-0" strokeWidth={3} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="default" onClick={onBack} disabled={loading}>
          Atrás
        </Button>
        <Button variant="cta" size="full" onClick={onNext} disabled={loading}>
          {loading ? "Creando tu boda..." : "Empezar prueba gratuita"}
        </Button>
      </div>
    </Card>
  );
}
