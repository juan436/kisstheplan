"use client";

import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { WebPageConfig } from "@/types";
import { getImgUrl } from "@/lib/img-url";
import { TEMPLATES, COLOR_PALETTES, FONT_OPTIONS } from "../../constants/web.constants";
import { usePhotoUpload } from "../../hooks/use-photo-upload";
import { FontSelect } from "../font-select";

interface DesignStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
  onPhotoSave?: (url: string) => Promise<void>;
}

const SCHEDULE_STYLES = [
  { id: "A", label: "Vertical con iconos", desc: "Línea central con puntos" },
  { id: "B", label: "Lista centrada",       desc: "Minimalista, hora encima" },
  { id: "C", label: "Zigzag",               desc: "Alternado, simétrico" },
] as const;

export function DesignStep({ draft, updateDraft, onPhotoSave }: DesignStepProps) {
  const { uploading, handleUpload } = usePhotoUpload((url) => updateDraft({ heroImage: url }), onPhotoSave);

  return (
    <div className="space-y-6">
      <div>
        <Label>Plantilla</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => updateDraft({ templateId: t.id })}
              className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                (draft.templateId || "elegante") === t.id ? "border-cta bg-cta/5" : "border-border hover:border-brand"
              }`}>
              <p className="text-[12px] font-semibold text-text">{t.name}</p>
              <p className="text-[11px] text-brand mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Imagen de portada</Label>
        <div className="mt-2">
          {draft.heroImage ? (
            <div className="relative rounded-lg overflow-hidden h-28 group">
              <img src={getImgUrl(draft.heroImage)} alt="Portada" className="w-full h-full object-cover" />
              <button onClick={() => updateDraft({ heroImage: "" })}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all">
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full h-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cta hover:bg-cta/5 transition-all text-[13px] text-brand hover:text-cta">
              {uploading ? <span>Subiendo...</span> : <><Upload size={14} /><span>Subir foto de portada</span></>}
              <input type="file" accept="image/*" className="hidden" disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
          )}
        </div>
      </div>

      <div>
        <Label>Paleta de colores</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {COLOR_PALETTES.map((p) => (
            <button key={p.name} onClick={() => updateDraft({ colorPalette: p.colors })}
              className={`p-3 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                draft.colorPalette?.primary === p.colors.primary ? "border-cta" : "border-border hover:border-brand"
              }`}>
              <div className="flex gap-1 mb-1.5">
                {Object.values(p.colors).map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-[12px] font-medium text-text">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Tipografía títulos</Label>
          <FontSelect value={draft.fontTitle || "Playfair Display"} options={FONT_OPTIONS}
            onChange={(v) => updateDraft({ fontTitle: v })} />
        </div>
        <div>
          <Label>Tipografía cuerpo</Label>
          <FontSelect value={draft.fontBody || "Quicksand"} options={FONT_OPTIONS}
            onChange={(v) => updateDraft({ fontBody: v })} />
        </div>
      </div>

      <div>
        <Label>Estilo de horarios del día</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {SCHEDULE_STYLES.map((s) => (
            <button key={s.id} onClick={() => updateDraft({ scheduleStyle: s.id })}
              className={`p-2.5 rounded-xl border-2 text-center transition-all hover:scale-[1.02] ${
                (draft.scheduleStyle || "B") === s.id ? "border-cta bg-cta/5" : "border-border hover:border-brand"
              }`}>
              <p className="text-[12px] font-semibold text-text">{s.label}</p>
              <p className="text-[10px] text-brand mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
