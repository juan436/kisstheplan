import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WebPageConfig } from "@/types";

interface ContentStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}

const ta = "w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all";

export function ContentStep({ draft, updateDraft }: ContentStepProps) {
  const addCustomSection = () => updateDraft({ customSections: [...(draft.customSections || []), { title: "", content: "" }] });
  const updateCustomSection = (i: number, field: "title" | "content", value: string) => {
    const sections = [...(draft.customSections || [])];
    sections[i] = { ...sections[i], [field]: value };
    updateDraft({ customSections: sections });
  };
  const removeCustomSection = (i: number) => updateDraft({ customSections: (draft.customSections || []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="heroTitle">Título principal</Label>
          <Input id="heroTitle" value={draft.heroTitle || ""} onChange={(e) => updateDraft({ heroTitle: e.target.value })} placeholder="Lucía & Pablo" />
        </div>
        <div>
          <Label htmlFor="heroSubtitle">Subtítulo</Label>
          <Input id="heroSubtitle" value={draft.heroSubtitle || ""} onChange={(e) => updateDraft({ heroSubtitle: e.target.value })} placeholder="12 de septiembre de 2026" />
        </div>
      </div>

      <div>
        <Label htmlFor="storyText">Nuestra historia</Label>
        <textarea id="storyText" value={draft.storyText || ""} onChange={(e) => updateDraft({ storyText: e.target.value })}
          placeholder="Cuéntales cómo os conocisteis..." rows={3} className={ta} />
      </div>

      <div>
        <Label htmlFor="scheduleText">Horarios del día</Label>
        <textarea id="scheduleText" value={draft.scheduleText || ""} onChange={(e) => updateDraft({ scheduleText: e.target.value })}
          placeholder={"17:00 — Ceremonia\n18:00 — Cóctel\n20:00 — Cena"} rows={3} className={ta} />
      </div>

      <div>
        <Label htmlFor="locationText">Cómo llegar</Label>
        <textarea id="locationText" value={draft.locationText || ""} onChange={(e) => updateDraft({ locationText: e.target.value })}
          placeholder="Dirección y indicaciones para llegar al lugar..." rows={2} className={ta} />
      </div>

      <div>
        <Label htmlFor="transportText">Transporte</Label>
        <textarea id="transportText" value={draft.transportText || ""} onChange={(e) => updateDraft({ transportText: e.target.value })}
          placeholder="Información sobre el transporte..." rows={2} className={ta} />
      </div>

      <div>
        <Label htmlFor="accommodationText">Alojamiento recomendado</Label>
        <textarea id="accommodationText" value={draft.accommodationText || ""} onChange={(e) => updateDraft({ accommodationText: e.target.value })}
          placeholder="Hotels y opciones de alojamiento cerca del venue..." rows={2} className={ta} />
      </div>

      <div>
        <Label htmlFor="dressCode">Código de vestimenta</Label>
        <Input id="dressCode" value={draft.dressCode || ""} onChange={(e) => updateDraft({ dressCode: e.target.value })} placeholder="Ej: Elegante, semiformal..." />
      </div>

      <div>
        <Label>Secciones personalizadas</Label>
        <div className="space-y-3 mt-2">
          {(draft.customSections || []).map((section, i) => (
            <div key={i} className="bg-bg2 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input value={section.title} onChange={(e) => updateCustomSection(i, "title", e.target.value)} placeholder="Título de la sección" className="flex-1" />
                <button onClick={() => removeCustomSection(i)} className="text-brand hover:text-danger transition-colors"><Trash2 size={14} /></button>
              </div>
              <textarea value={section.content} onChange={(e) => updateCustomSection(i, "content", e.target.value)}
                placeholder="Contenido..." rows={2}
                className="w-full bg-white border-[1.5px] border-border rounded-md px-3 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta transition-all" />
            </div>
          ))}
          <button onClick={addCustomSection} className="flex items-center gap-1.5 text-[13px] text-brand hover:text-cta transition-colors">
            <Plus size={14} /> Añadir sección personalizada
          </button>
        </div>
      </div>
    </div>
  );
}
