"use client";

/**
 * DesignStep
 *
 * Qué hace: paso 1 del builder web; permite elegir plantilla, foto portada, paleta y tipografías.
 * Recibe:   draft (WebPageConfig), onUpdate, hooks de foto (usePhotoUpload).
 * Provee:   export { DesignStep } — usado por WebView.
 */

import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { WebPageConfig } from "@/types";
import { getImgUrl } from "@/lib/img-url";
import { TEMPLATES, COLOR_PALETTES, FONT_OPTIONS } from "../../constants/web.constants";
import { usePhotoUpload } from "../../hooks/use-photo-upload";

interface DesignStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}

export function DesignStep({ draft, updateDraft }: DesignStepProps) {
  const { uploading, handleUpload } = usePhotoUpload((url) => updateDraft({ heroImage: url }));

  return (
    <div className="space-y-6">
      <div>
        <Label>Plantilla</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => updateDraft({ templateId: t.id })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                (draft.templateId || "classic") === t.id ? "border-cta bg-cta/5" : "border-border hover:border-brand"
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
            <div className="relative rounded-lg overflow-hidden h-28">
              <img src={getImgUrl(draft.heroImage)} alt="Portada" className="w-full h-full object-cover" />
              <button onClick={() => updateDraft({ heroImage: "" })}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70 transition-colors">
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
              className={`p-3 rounded-xl border-2 transition-all ${
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
          <select value={draft.fontTitle || "Playfair Display"} onChange={(e) => updateDraft({ fontTitle: e.target.value })}
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text outline-none focus:border-cta mt-1">
            {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <Label>Tipografía cuerpo</Label>
          <select value={draft.fontBody || "Quicksand"} onChange={(e) => updateDraft({ fontBody: e.target.value })}
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text outline-none focus:border-cta mt-1">
            <option value="Quicksand">Quicksand</option>
            <option value="Lato">Lato</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Raleway">Raleway</option>
          </select>
        </div>
      </div>
    </div>
  );
}
