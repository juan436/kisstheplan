"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Link2, Check, ChevronRight, ChevronLeft, Monitor, Smartphone } from "lucide-react";
import { STEP_LABELS, SITE_URL } from "./constants/web.constants";
import { useWebBuilder } from "./hooks/use-web-builder";
import { DesignStep } from "./components/design-step";
import { RsvpStep } from "./components/rsvp-step";
import { ContentStep } from "./components/content-step";
import { LivePreview } from "./components/live-preview";

export default function WebBuilderPage() {
  const [step,        setStep]        = useState(0);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const {
    page, loading, wedding, saving, copied, draft, updateDraft, saveDraft, handlePublish, handleCopyLink,
    editingSlug, setEditingSlug, slugValue, slugStatus, slugError,
    savingSlug, handleSaveSlug, handleCheckSlug, handleSlugInputChange,
  } = useWebBuilder();

  if (loading) return <div className="flex items-center justify-center py-20"><div className="text-brand text-[14px]">Cargando...</div></div>;

  return (
    <div className="flex gap-6 h-full min-h-0" style={{ maxHeight: "calc(100vh - 120px)" }}>
      <div className="w-[420px] flex-shrink-0 flex flex-col min-h-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-display text-[22px] text-text">Web de Boda</h1>
            {wedding?.slug && (
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-[12px] text-brand">{SITE_URL}/</span>
                {editingSlug ? (
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 flex-wrap">
                      <input autoFocus value={slugValue}
                        onChange={(e) => handleSlugInputChange(e.target.value)}
                        className="bg-white border border-cta rounded px-2 py-0.5 text-[12px] text-text outline-none w-32"
                        onKeyDown={(e) => { if (e.key === "Escape") setEditingSlug(false); }} />
                      <button onClick={handleCheckSlug} disabled={slugStatus === "checking"}
                        className="text-[11px] text-brand hover:text-cta border border-border hover:border-cta rounded px-1.5 py-0.5 transition-colors disabled:opacity-50">
                        {slugStatus === "checking" ? "..." : "Verificar"}
                      </button>
                      {slugStatus === "available" && (
                        <Button variant="cta" size="sm" onClick={handleSaveSlug} disabled={savingSlug}>
                          {savingSlug ? "..." : "Guardar"}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setEditingSlug(false)}>✕</Button>
                    </div>
                    {slugStatus === "available" && <span className="text-[11px] text-success">✅ Disponible</span>}
                    {slugStatus === "taken" && <span className="text-[11px] text-danger">❌ Ya está en uso</span>}
                    {slugError && slugStatus === "idle" && <p className="text-[11px] text-danger">{slugError}</p>}
                  </div>
                ) : (
                  <button onClick={() => { setEditingSlug(true); handleSlugInputChange(wedding.slug); }}
                    className="text-[12px] text-cta font-medium hover:underline">{wedding.slug}</button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {wedding?.slug && (
              <button onClick={handleCopyLink} className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors px-2 py-1 rounded border border-border hover:border-cta">
                {copied ? <Check size={12} /> : <Link2 size={12} />} {copied ? "Copiado" : "Enlace"}
              </button>
            )}
            <Button variant={page?.isPublished ? "secondary" : "cta"} size="sm" onClick={handlePublish} disabled={saving}>
              <Globe size={13} className="mr-1" />{page?.isPublished ? "Despublicar" : "Publicar"}
            </Button>
          </div>
        </div>

        {page?.isPublished && (
          <div className="bg-success/10 border border-success/30 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
            <span className="text-[12px] text-text">Web publicada en <a href={`/${wedding?.slug}`} target="_blank" rel="noopener noreferrer" className="text-cta font-medium hover:underline">{SITE_URL}/{wedding?.slug}</a></span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-4">
          {STEP_LABELS.map((label, i) => (
            <button key={label} onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${step === i ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          <Card className="p-5">
            {step === 0 && <DesignStep draft={draft} updateDraft={updateDraft} />}
            {step === 1 && <RsvpStep draft={draft} updateDraft={updateDraft} />}
            {step === 2 && <ContentStep draft={draft} updateDraft={updateDraft} />}
          </Card>
        </div>

        <div className="flex items-center justify-between mt-4 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-1"><ChevronLeft size={14} />Anterior</Button>
          <Button variant="cta" size="sm" onClick={saveDraft} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
          <Button variant="ghost" size="sm" onClick={() => setStep(Math.min(2, step + 1))} disabled={step === 2} className="gap-1">Siguiente<ChevronRight size={14} /></Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <span className="text-[13px] text-brand font-medium">Vista previa</span>
          <div className="flex items-center gap-1 bg-bg2 rounded-lg p-1 border border-border">
            {(["desktop", "mobile"] as const).map((m) => (
              <button key={m} onClick={() => setPreviewMode(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${previewMode === m ? "bg-white shadow-sm text-text" : "text-brand hover:text-text"}`}>
                {m === "desktop" ? <Monitor size={13} /> : <Smartphone size={13} />}
                {m === "desktop" ? "Desktop" : "Móvil"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-bg2 rounded-xl border border-border overflow-auto flex items-start justify-center p-4 min-h-0">
          <div className="transition-all duration-300 origin-top" style={{ width: previewMode === "mobile" ? "390px" : "100%", minWidth: previewMode === "mobile" ? "390px" : undefined, maxWidth: previewMode === "desktop" ? "900px" : "390px" }}>
            <LivePreview draft={draft} updateDraft={updateDraft} previewMode={previewMode} wedding={wedding} />
          </div>
        </div>
      </div>
    </div>
  );
}
