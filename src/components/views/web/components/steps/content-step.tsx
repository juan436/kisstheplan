"use client";

import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WebPageConfig } from "@/types";
import { SectionEditor } from "../section-editor";
import { GalleryEditor } from "../gallery-editor";

interface ContentStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}

const ta = "w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all";

function vis(draft: Partial<WebPageConfig>, key: string) {
  return draft.visibleSections?.[key] !== false;
}
function toggleVis(key: string, draft: Partial<WebPageConfig>, upd: (u: Partial<WebPageConfig>) => void) {
  upd({ visibleSections: { ...(draft.visibleSections || {}), [key]: !vis(draft, key) } });
}

export function ContentStep({ draft, updateDraft }: ContentStepProps) {
  const addSection = () => updateDraft({ customSections: [...(draft.customSections || []), { title: "", content: "" }] });
  const updSection = (i: number, f: "title" | "content", v: string) => {
    const s = [...(draft.customSections || [])]; s[i] = { ...s[i], [f]: v };
    updateDraft({ customSections: s });
  };
  const delSection = (i: number) =>
    updateDraft({ customSections: (draft.customSections || []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Título principal</Label>
          <Input value={draft.heroTitle || ""} onChange={(e) => updateDraft({ heroTitle: e.target.value })} placeholder="Lucía & Pablo" /></div>
        <div><Label>Subtítulo</Label>
          <Input value={draft.heroSubtitle || ""} onChange={(e) => updateDraft({ heroSubtitle: e.target.value })} placeholder="12 de septiembre de 2026" /></div>
      </div>

      <SectionEditor defaultTitle="Nuestra historia" title={draft.storyTitle}
        visible={vis(draft, "story")} onTitleChange={(v) => updateDraft({ storyTitle: v })}
        onVisibilityToggle={() => toggleVis("story", draft, updateDraft)}>
        <textarea value={draft.storyText || ""} onChange={(e) => updateDraft({ storyText: e.target.value })}
          placeholder="Cuéntales cómo os conocisteis..." rows={3} className={ta} />
      </SectionEditor>

      <SectionEditor defaultTitle="Horarios del día" title={draft.scheduleTitle}
        visible={vis(draft, "schedule")} onTitleChange={(v) => updateDraft({ scheduleTitle: v })}
        onVisibilityToggle={() => toggleVis("schedule", draft, updateDraft)}>
        <textarea value={draft.scheduleText || ""} onChange={(e) => updateDraft({ scheduleText: e.target.value })}
          placeholder={"17:00 — Ceremonia\n18:00 — Cóctel\n20:00 — Cena"} rows={3} className={ta} />
      </SectionEditor>

      <SectionEditor defaultTitle="Cómo llegar" title={draft.locationTitle}
        visible={vis(draft, "location")} onTitleChange={(v) => updateDraft({ locationTitle: v })}
        onVisibilityToggle={() => toggleVis("location", draft, updateDraft)}>
        <textarea value={draft.locationText || ""} onChange={(e) => updateDraft({ locationText: e.target.value })}
          placeholder="Dirección e indicaciones..." rows={2} className={ta} />
      </SectionEditor>

      <SectionEditor defaultTitle="Transporte" title={draft.transportTitle}
        visible={vis(draft, "transport")} onTitleChange={(v) => updateDraft({ transportTitle: v })}
        onVisibilityToggle={() => toggleVis("transport", draft, updateDraft)}>
        <textarea value={draft.transportText || ""} onChange={(e) => updateDraft({ transportText: e.target.value })}
          placeholder="Información sobre el transporte..." rows={2} className={ta} />
      </SectionEditor>

      <SectionEditor defaultTitle="Alojamiento" title={draft.accommodationTitle}
        visible={vis(draft, "accommodation")} onTitleChange={(v) => updateDraft({ accommodationTitle: v })}
        onVisibilityToggle={() => toggleVis("accommodation", draft, updateDraft)}>
        <textarea value={draft.accommodationText || ""} onChange={(e) => updateDraft({ accommodationText: e.target.value })}
          placeholder="Hoteles y opciones cercanas..." rows={2} className={ta} />
      </SectionEditor>

      <SectionEditor defaultTitle="Código de vestimenta" title={draft.dressCodeTitle}
        visible={vis(draft, "dressCode")} onTitleChange={(v) => updateDraft({ dressCodeTitle: v })}
        onVisibilityToggle={() => toggleVis("dressCode", draft, updateDraft)}>
        <Input value={draft.dressCode || ""} onChange={(e) => updateDraft({ dressCode: e.target.value })}
          placeholder="Ej: Elegante, semiformal..." />
      </SectionEditor>

      <SectionEditor defaultTitle="Galería de fotos" visible={vis(draft, "gallery")}
        onTitleChange={() => {}} onVisibilityToggle={() => toggleVis("gallery", draft, updateDraft)}>
        <GalleryEditor images={draft.galleryImages || []} onChange={(imgs) => updateDraft({ galleryImages: imgs })} />
      </SectionEditor>

      <div>
        <Label>Secciones personalizadas</Label>
        <div className="space-y-3 mt-2">
          {(draft.customSections || []).map((section, i) => (
            <div key={i} className="bg-bg2 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input value={section.title} onChange={(e) => updSection(i, "title", e.target.value)}
                  placeholder="Título de la sección" className="flex-1" />
                <button onClick={() => delSection(i)} className="text-brand hover:text-danger transition-colors"><Trash2 size={14} /></button>
              </div>
              <textarea value={section.content} onChange={(e) => updSection(i, "content", e.target.value)}
                placeholder="Contenido..." rows={2}
                className="w-full bg-white border-[1.5px] border-border rounded-md px-3 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta transition-all" />
            </div>
          ))}
          <button onClick={addSection} className="flex items-center gap-1.5 text-[13px] text-brand hover:text-cta transition-colors">
            <Plus size={14} /> Añadir sección personalizada
          </button>
        </div>
      </div>
    </div>
  );
}
