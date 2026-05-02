"use client";

import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WebPageConfig } from "@/types";

interface RsvpStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}

const ta = "w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all";

export function RsvpStep({ draft, updateDraft }: RsvpStepProps) {
  const addMealOption = () => updateDraft({ mealOptions: [...(draft.mealOptions || []), ""] });
  const updateMealOption = (i: number, v: string) => {
    const opts = [...(draft.mealOptions || [])]; opts[i] = v; updateDraft({ mealOptions: opts });
  };
  const removeMealOption = (i: number) => updateDraft({ mealOptions: (draft.mealOptions || []).filter((_, idx) => idx !== i) });

  const addTransportOption = () => updateDraft({ transportOptions: [...(draft.transportOptions || []), ""] });
  const updateTransportOption = (i: number, v: string) => {
    const opts = [...(draft.transportOptions || [])]; opts[i] = v; updateDraft({ transportOptions: opts });
  };
  const removeTransportOption = (i: number) => updateDraft({ transportOptions: (draft.transportOptions || []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={draft.rsvpEnabled !== false} onChange={(e) => updateDraft({ rsvpEnabled: e.target.checked })} className="w-4 h-4 rounded accent-cta" />
        <span className="text-[13px] text-text font-medium">Habilitar confirmación de asistencia (RSVP)</span>
      </label>

      {draft.rsvpEnabled !== false && (
        <>
          <div>
            <Label htmlFor="rsvpDeadline">Fecha límite RSVP</Label>
            <Input id="rsvpDeadline" type="date" value={draft.rsvpDeadline || ""} onChange={(e) => updateDraft({ rsvpDeadline: e.target.value })} />
          </div>

          <div>
            <Label>Opciones de plato</Label>
            <div className="space-y-2 mt-2">
              {(draft.mealOptions || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={opt} onChange={(e) => updateMealOption(i, e.target.value)} placeholder="Ej: Carne, Pescado..." />
                  <button onClick={() => removeMealOption(i)} className="text-brand hover:text-danger transition-colors flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={addMealOption} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors mt-1">
                <Plus size={12} /> Añadir opción de plato
              </button>
            </div>
          </div>

          <div>
            <Label>Puntos de recogida (transporte)</Label>
            <div className="space-y-2 mt-2">
              {(draft.transportOptions || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={opt} onChange={(e) => updateTransportOption(i, e.target.value)} placeholder="Ej: Barcelona centro, Aeropuerto..." />
                  <button onClick={() => removeTransportOption(i)} className="text-brand hover:text-danger transition-colors flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={addTransportOption} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors mt-1">
                <Plus size={12} /> Añadir punto de recogida
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmMessage">Mensaje de confirmación</Label>
            <textarea id="confirmMessage" value={draft.confirmMessage || ""} onChange={(e) => updateDraft({ confirmMessage: e.target.value })}
              placeholder="Ej: ¡Nos vemos allí! Gracias por confirmar 🎉" rows={2} className={ta} />
          </div>

          <div>
            <Label htmlFor="rejectMessage">Mensaje si no pueden asistir</Label>
            <textarea id="rejectMessage" value={draft.rejectMessage || ""} onChange={(e) => updateDraft({ rejectMessage: e.target.value })}
              placeholder="Ej: ¡Te echaremos de menos! Gracias por avisarnos." rows={2} className={ta} />
          </div>
        </>
      )}
    </div>
  );
}
