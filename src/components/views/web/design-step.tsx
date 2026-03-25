import { Label } from "@/components/ui/label";
import type { WebPageConfig } from "@/types";
import { TEMPLATES, COLOR_PALETTES, FONT_OPTIONS } from "./web-constants";

interface DesignStepProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}

export function DesignStep({ draft, updateDraft }: DesignStepProps) {
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
