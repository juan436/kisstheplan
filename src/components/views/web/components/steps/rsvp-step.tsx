"use client";

/**
 * RsvpStep
 *
 * Qué hace: paso 2 del builder web; configura fecha límite RSVP y selecciona
 *           (mediante chips) qué opciones de plato, alergia y transporte del
 *           inventario maestro se publican en el formulario RSVP de la web.
 * Recibe:   draft (WebPageConfig), updateDraft callback, wedding (inventario maestro).
 * Provee:   export { RsvpStep } — usado por WebView.
 */

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WebPageConfig, Wedding } from "@/types";

interface RsvpStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
  wedding: Wedding | null;
}

const ta = "w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all";

function OptionChips({
  master,
  selected,
  onToggle,
  emptyText,
}: {
  master: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  emptyText: string;
}) {
  if (!master.length) {
    return <p className="text-[12px] text-brand italic">{emptyText}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {master.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              active
                ? "bg-cta text-white border-cta"
                : "bg-bg2 text-text border-border hover:border-cta hover:bg-bg3"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function toggle(list: string[], opt: string): string[] {
  return list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt];
}

export function RsvpStep({ draft, updateDraft, wedding }: RsvpStepProps) {
  const masterMeal      = wedding?.mealOptions      ?? [];
  const masterAllergy   = wedding?.allergyOptions   ?? [];
  const masterTransport = wedding?.transportOptions ?? [];

  const selMeal      = draft.mealOptions      ?? [];
  const selAllergy   = draft.allergyOptions   ?? [];
  const selTransport = draft.transportOptions ?? [];

  return (
    <div className="space-y-5">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={draft.rsvpEnabled !== false}
          onChange={(e) => updateDraft({ rsvpEnabled: e.target.checked })}
          className="w-4 h-4 rounded accent-cta"
        />
        <span className="text-[13px] text-text font-medium">Habilitar confirmación de asistencia (RSVP)</span>
      </label>

      {draft.rsvpEnabled !== false && (
        <>
          <div>
            <Label htmlFor="rsvpDeadline">Fecha límite RSVP</Label>
            <Input
              id="rsvpDeadline"
              type="date"
              value={draft.rsvpDeadline || ""}
              onChange={(e) => updateDraft({ rsvpDeadline: e.target.value })}
            />
          </div>

          <div>
            <Label>Opciones de plato</Label>
            <p className="text-[11px] text-brand mt-0.5 mb-1">
              Selecciona cuáles aparecerán en el formulario del invitado
            </p>
            <OptionChips
              master={masterMeal}
              selected={selMeal}
              onToggle={(opt) => updateDraft({ mealOptions: toggle(selMeal, opt) })}
              emptyText="Aún no hay platos configurados. Añádelos en Invitados → Restricciones / Transporte."
            />
          </div>

          <div>
            <Label>Alergias y restricciones</Label>
            <p className="text-[11px] text-brand mt-0.5 mb-1">
              Selecciona cuáles aparecerán en el formulario del invitado
            </p>
            <OptionChips
              master={masterAllergy}
              selected={selAllergy}
              onToggle={(opt) => updateDraft({ allergyOptions: toggle(selAllergy, opt) })}
              emptyText="Aún no hay alergias configuradas. Añádelas en Invitados → Restricciones / Transporte."
            />
          </div>

          <div>
            <Label>Puntos de recogida (transporte)</Label>
            <p className="text-[11px] text-brand mt-0.5 mb-1">
              Selecciona cuáles aparecerán en el formulario del invitado
            </p>
            <OptionChips
              master={masterTransport}
              selected={selTransport}
              onToggle={(opt) => updateDraft({ transportOptions: toggle(selTransport, opt) })}
              emptyText="Aún no hay puntos de recogida configurados. Añádelos en Invitados → Restricciones / Transporte."
            />
          </div>

          <div>
            <Label htmlFor="confirmMessage">Mensaje de confirmación</Label>
            <textarea
              id="confirmMessage"
              value={draft.confirmMessage || ""}
              onChange={(e) => updateDraft({ confirmMessage: e.target.value })}
              placeholder="Ej: ¡Nos vemos allí! Gracias por confirmar 🎉"
              rows={2}
              className={ta}
            />
          </div>

          <div>
            <Label htmlFor="rejectMessage">Mensaje si no pueden asistir</Label>
            <textarea
              id="rejectMessage"
              value={draft.rejectMessage || ""}
              onChange={(e) => updateDraft({ rejectMessage: e.target.value })}
              placeholder="Ej: ¡Te echaremos de menos! Gracias por avisarnos."
              rows={2}
              className={ta}
            />
          </div>
        </>
      )}
    </div>
  );
}
