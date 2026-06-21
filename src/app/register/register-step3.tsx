import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface Step3Props {
  plan: 'trial' | 'annual';
  setPlan: (v: 'trial' | 'annual') => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function Step3({ plan, setPlan, loading, onNext, onBack }: Step3Props) {
  return (
    <Card variant="elevated" padding="default" className="p-8">
      <h2 className="font-title text-2xl text-text mb-2">Elige tu plan</h2>
      <p className="text-[13px] text-brand mb-8">Puedes cambiar en cualquier momento desde tu cuenta.</p>

      <div className="flex flex-col gap-4 mb-8">
        <PlanOption
          selected={plan === 'trial'}
          onSelect={() => setPlan('trial')}
          title="Prueba gratuita — 7 días"
          description="Sin tarjeta. Acceso total. Al terminar decides si continúas."
          badge="Gratis"
        />
        <PlanOption
          selected={plan === 'annual'}
          onSelect={() => setPlan('annual')}
          title="Plan anual — 70 €/año"
          description="Acceso completo desde el primer día. Sin interrupciones."
          badge="70 €/año"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="default" onClick={onBack} disabled={loading}>
          Atrás
        </Button>
        <Button variant="cta" size="full" onClick={onNext} disabled={loading}>
          {loading ? "Creando..." : plan === 'trial' ? "Empezar prueba gratuita" : "Continuar al pago"}
        </Button>
      </div>
    </Card>
  );
}

interface PlanOptionProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  badge: string;
}

function PlanOption({ selected, onSelect, title, description, badge }: PlanOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-[14px] border-2 p-5 transition-all ${
        selected ? 'border-cta bg-cta/5' : 'border-border bg-white hover:border-brand'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[14px] text-text">{title}</span>
            <span className="text-[11px] font-semibold text-cta bg-cta/10 px-2 py-0.5 rounded-full">{badge}</span>
          </div>
          <p className="text-[12px] text-brand">{description}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          selected ? 'border-cta bg-cta' : 'border-border'
        }`}>
          {selected && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}
