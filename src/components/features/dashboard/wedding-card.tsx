import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Heart } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Wedding, BudgetSummary } from "@/types";

interface WeddingCardProps {
  wedding: Wedding;
  budget: BudgetSummary;
  onClick?: () => void;
}

export function WeddingCard({ wedding, budget, onClick }: WeddingCardProps) {
  const hasPhoto = !!wedding.photoUrl;

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-card h-full min-h-[340px] flex flex-col"
      style={onClick ? { cursor: "pointer" } : undefined}
      onClick={onClick}
      title={onClick ? "Configurar mi boda" : undefined}
    >

      {/* Foto / fondo */}
      {hasPhoto ? (
        <img
          src={wedding.photoUrl}
          alt="Portada de la boda"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, var(--color-fill) 0%, var(--color-fill-2) 60%, var(--color-bg-3) 100%)",
          }}
        />
      )}

      {/* Gradiente overlay: transparente arriba → oscuro abajo */}
      <div
        className="absolute inset-0"
        style={{
          background: hasPhoto
            ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.82) 100%)"
            : "linear-gradient(to bottom, transparent 30%, rgba(74,60,50,0.45) 100%)",
        }}
      />

      {/* Icono corazón cuando no hay foto */}
      {!hasPhoto && (
        <div className="relative flex-1 flex items-center justify-center">
          <Heart
            size={48}
            strokeWidth={1}
            style={{ color: "var(--color-brand)", opacity: 0.5 }}
          />
        </div>
      )}

      {/* Datos superpuestos abajo */}
      <div className="relative mt-auto p-5 space-y-3">
        {/* Fecha */}
        <div className="flex items-center gap-2">
          <Calendar size={13} className="shrink-0" style={{ color: hasPhoto ? "rgba(255,255,255,0.7)" : "var(--color-cta)" }} />
          <span
            className="text-[12px] font-medium"
            style={{ color: hasPhoto ? "rgba(255,255,255,0.9)" : "var(--color-accent)" }}
          >
            {formatDate(wedding.date)}
          </span>
        </div>

        {/* Lugar */}
        <div className="flex items-start gap-2">
          <MapPin size={13} className="shrink-0 mt-px" style={{ color: hasPhoto ? "rgba(255,255,255,0.7)" : "var(--color-cta)" }} />
          <span
            className="text-[12px] leading-snug"
            style={{ color: hasPhoto ? "rgba(255,255,255,0.85)" : "var(--color-accent)" }}
          >
            {wedding.venue}, {wedding.location}
          </span>
        </div>
      </div>
    </div>
  );
}
