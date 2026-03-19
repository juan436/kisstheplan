"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe, Link2, Check, ChevronRight, ChevronLeft, Plus, Trash2,
  Monitor, Smartphone,
} from "lucide-react";
import type { WebPageConfig } from "@/types";

const TEMPLATES = [
  { id: "classic", name: "Clásico", desc: "Elegante y atemporal" },
  { id: "modern", name: "Moderno", desc: "Minimalista y limpio" },
  { id: "romantic", name: "Romántico", desc: "Suave y delicado" },
  { id: "rustic", name: "Rústico", desc: "Natural y cálido" },
];

const COLOR_PALETTES = [
  { name: "Arena", colors: { primary: "#C4B7A6", accent: "#c7a977", bg: "#FAF7F2", text: "#4A3C32" } },
  { name: "Oliva", colors: { primary: "#8B9A7B", accent: "#A4B494", bg: "#F5F7F2", text: "#3A4A32" } },
  { name: "Rosa", colors: { primary: "#C4A6B7", accent: "#D4A6C7", bg: "#FBF2F7", text: "#4A323C" } },
  { name: "Azul", colors: { primary: "#A6B7C4", accent: "#7799BB", bg: "#F2F5FA", text: "#32404A" } },
];

const FONT_OPTIONS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Libre Baskerville",
  "Lora",
];

const STEP_LABELS = ["Diseño", "RSVP", "Contenido"];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export default function WebBuilderPage() {
  const { wedding } = useAuth();
  const [page, setPage] = useState<WebPageConfig | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState<Partial<WebPageConfig>>({});
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugValue, setSlugValue] = useState("");
  const [slugError, setSlugError] = useState("");
  const [savingSlug, setSavingSlug] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const loadPage = useCallback(async () => {
    try {
      const data = await api.getWebPage();
      if (data) {
        setPage(data);
        setDraft(data);
      }
    } catch {
      // No page yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const saveDraft = async (): Promise<WebPageConfig | null> => {
    setSaving(true);
    try {
      if (page) {
        const updated = await api.updateWebPage(draft);
        setPage(updated);
        // Only update draft with what the server confirms — don't overwrite with partial data
        setDraft((prev) => ({ ...prev, ...updated }));
        return updated;
      } else {
        const created = await api.createWebPage(draft);
        setPage(created);
        setDraft((prev) => ({ ...prev, ...created }));
        return created;
      }
    } catch {
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    // Capture current publish state BEFORE saving (to avoid stale closure)
    const currentlyPublished = page?.isPublished ?? false;
    const saved = await saveDraft();
    // If save failed, don't proceed
    if (!saved && !page) return;

    setSaving(true);
    try {
      const result = currentlyPublished
        ? await api.unpublishWebPage()
        : await api.publishWebPage();
      // Only merge isPublished + publishedAt — never touch content
      const publishFields = {
        isPublished: result.isPublished,
        publishedAt: result.publishedAt,
      };
      setPage((prev) => prev ? { ...prev, ...publishFields } : result);
      setDraft((prev) => ({ ...prev, ...publishFields }));
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (wedding?.slug) {
      navigator.clipboard.writeText(`${SITE_URL}/${wedding.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveSlug = async () => {
    if (!slugValue.trim() || !wedding) return;
    const clean = slugValue.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean.length < 3) {
      setSlugError("El slug debe tener al menos 3 caracteres");
      return;
    }
    setSavingSlug(true);
    setSlugError("");
    try {
      await api.updateWedding(wedding.id, { slug: clean });
      wedding.slug = clean;
      setEditingSlug(false);
    } catch (err) {
      setSlugError(err instanceof Error ? err.message : "Ese slug ya está en uso");
    } finally {
      setSavingSlug(false);
    }
  };

  const updateDraft = (updates: Partial<WebPageConfig>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-brand text-[14px]">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full min-h-0" style={{ maxHeight: "calc(100vh - 120px)" }}>
      {/* LEFT: Form panel */}
      <div className="w-[420px] flex-shrink-0 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-display text-[22px] text-text">Web de Boda</h1>
            {wedding?.slug && (
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-[12px] text-brand">{SITE_URL}/</span>
                {editingSlug ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={slugValue}
                      onChange={(e) => setSlugValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="bg-white border border-cta rounded px-2 py-0.5 text-[12px] text-text outline-none w-32"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveSlug();
                        if (e.key === "Escape") { setEditingSlug(false); setSlugError(""); }
                      }}
                    />
                    <Button variant="cta" size="sm" onClick={handleSaveSlug} disabled={savingSlug}>
                      {savingSlug ? "..." : "OK"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingSlug(false); setSlugError(""); }}>
                      ✕
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingSlug(true); setSlugValue(wedding.slug); }}
                    className="text-[12px] text-cta font-medium hover:underline"
                  >
                    {wedding.slug}
                  </button>
                )}
              </div>
            )}
            {slugError && <p className="text-[11px] text-danger mt-0.5">{slugError}</p>}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {wedding?.slug && (
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors px-2 py-1 rounded border border-border hover:border-cta"
              >
                {copied ? <Check size={12} /> : <Link2 size={12} />}
                {copied ? "Copiado" : "Enlace"}
              </button>
            )}
            <Button
              variant={page?.isPublished ? "secondary" : "cta"}
              size="sm"
              onClick={handlePublish}
              disabled={saving}
            >
              <Globe size={13} className="mr-1" />
              {page?.isPublished ? "Despublicar" : "Publicar"}
            </Button>
          </div>
        </div>

        {/* Status banner */}
        {page?.isPublished && (
          <div className="bg-success/10 border border-success/30 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
            <span className="text-[12px] text-text">
              Web publicada en{" "}
              <a href={`/${wedding?.slug}`} target="_blank" rel="noopener noreferrer" className="text-cta font-medium hover:underline">
                {SITE_URL}/{wedding?.slug}
              </a>
            </span>
          </div>
        )}

        {/* Step tabs */}
        <div className="flex items-center gap-1.5 mb-4">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                step === i ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                {i + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Step content — scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          <Card className="p-5">
            {step === 0 && <DesignStep draft={draft} updateDraft={updateDraft} />}
            {step === 1 && <RsvpStep draft={draft} updateDraft={updateDraft} />}
            {step === 2 && <ContentStep draft={draft} updateDraft={updateDraft} />}
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft size={14} />
            Anterior
          </Button>
          <Button variant="cta" size="sm" onClick={saveDraft} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2}
            className="gap-1"
          >
            Siguiente
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* RIGHT: Live preview panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Preview toolbar */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <span className="text-[13px] text-brand font-medium">Vista previa</span>
          <div className="flex items-center gap-1 bg-bg2 rounded-lg p-1 border border-border">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                previewMode === "desktop" ? "bg-white shadow-sm text-text" : "text-brand hover:text-text"
              }`}
            >
              <Monitor size={13} />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                previewMode === "mobile" ? "bg-white shadow-sm text-text" : "text-brand hover:text-text"
              }`}
            >
              <Smartphone size={13} />
              Móvil
            </button>
          </div>
        </div>

        {/* Preview frame */}
        <div className="flex-1 bg-bg2 rounded-xl border border-border overflow-auto flex items-start justify-center p-4 min-h-0">
          <div
            className="transition-all duration-300 origin-top"
            style={{
              width: previewMode === "mobile" ? "390px" : "100%",
              minWidth: previewMode === "mobile" ? "390px" : undefined,
              maxWidth: previewMode === "desktop" ? "900px" : "390px",
            }}
          >
            <LivePreview draft={draft} updateDraft={updateDraft} previewMode={previewMode} wedding={wedding} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Template style configs ---
type TemplateStyle = {
  heroAlign: "center" | "left";
  heroGradient: (bg: string, primary: string) => string;
  titleItalic: boolean;
  titleSize: string;
  sectionTitleAlign: "center" | "left";
  divider: (accent: string) => React.ReactNode;
  sectionBg: (primary: string, index: number) => string | undefined;
  borderStyle: string;
  sectionRadius: string;
  buttonRadius: string;
};

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  classic: {
    heroAlign: "center",
    heroGradient: (bg, primary) => `linear-gradient(180deg, ${primary}22 0%, ${bg} 60%)`,
    titleItalic: true,
    titleSize: "52px",
    sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}50` }} />
        <span style={{ color: accent, fontSize: "18px" }}>✦</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}50` }} />
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}18` : undefined,
    borderStyle: "1px solid",
    sectionRadius: "0",
    buttonRadius: "999px",
  },
  modern: {
    heroAlign: "left",
    heroGradient: (bg, primary) => `linear-gradient(135deg, ${bg} 0%, ${primary}15 100%)`,
    titleItalic: false,
    titleSize: "48px",
    sectionTitleAlign: "left",
    divider: (accent) => (
      <div style={{ width: "40px", height: "3px", backgroundColor: accent, marginBottom: "16px", borderRadius: "2px" }} />
    ),
    sectionBg: (_p, _i) => undefined,
    borderStyle: "1px solid",
    sectionRadius: "0",
    buttonRadius: "6px",
  },
  romantic: {
    heroAlign: "center",
    heroGradient: (bg, primary) => `radial-gradient(ellipse at top, ${primary}40 0%, ${bg} 65%)`,
    titleItalic: true,
    titleSize: "54px",
    sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ textAlign: "center", fontSize: "22px", color: accent, marginBottom: "12px", letterSpacing: "8px" }}>
        ❧ ❧ ❧
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}20` : undefined,
    borderStyle: "1px dashed",
    sectionRadius: "0",
    buttonRadius: "999px",
  },
  rustic: {
    heroAlign: "left",
    heroGradient: (_bg, primary) => `linear-gradient(160deg, ${primary}55 0%, ${primary}22 100%)`,
    titleItalic: false,
    titleSize: "44px",
    sectionTitleAlign: "left",
    divider: (accent) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <span style={{ color: accent, fontSize: "16px" }}>◆</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}60`, backgroundImage: `repeating-linear-gradient(90deg, ${accent}60 0px, ${accent}60 4px, transparent 4px, transparent 8px)` }} />
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}25` : `${primary}08`,
    borderStyle: "2px solid",
    sectionRadius: "0",
    buttonRadius: "4px",
  },
};

// --- Live Preview ---
function LivePreview({
  draft,
  updateDraft,
  previewMode,
  wedding,
}: {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
  previewMode: "desktop" | "mobile";
  wedding: { partner1Name?: string; partner2Name?: string; date?: string; venue?: string; slug?: string } | null;
}) {
  const palette = draft.colorPalette || { primary: "#C4B7A6", accent: "#c7a977", bg: "#FAF7F2", text: "#4A3C32" };
  const fontTitle = draft.fontTitle || "Playfair Display";
  const fontBody = draft.fontBody || "Quicksand";
  const tpl = TEMPLATE_STYLES[draft.templateId || "classic"];

  const editable = (field: keyof WebPageConfig) => ({
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      updateDraft({ [field]: e.currentTarget.textContent || "" });
    },
    className: "outline-none cursor-text hover:opacity-70 transition-opacity",
  });

  const defaultTitle = wedding
    ? `${wedding.partner1Name || "Nombre"} & ${wedding.partner2Name || "Nombre"}`
    : "Nombre & Nombre";

  const defaultDate = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "12 de septiembre de 2026";

  const mobile = previewMode === "mobile";
  const px = mobile ? "24px" : "48px";
  const py = mobile ? "48px" : "72px";

  const sectionStyle = (index: number): React.CSSProperties => ({
    padding: `${mobile ? "32px" : "48px"} ${px}`,
    borderTop: `${tpl.borderStyle} ${palette.primary}35`,
    backgroundColor: tpl.sectionBg(palette.primary, index) || undefined,
    textAlign: tpl.sectionTitleAlign,
  });

  const h2Style: React.CSSProperties = {
    fontFamily: fontTitle,
    color: palette.text,
    fontSize: mobile ? "20px" : "24px",
    fontStyle: tpl.titleItalic ? "italic" : "normal",
    marginBottom: "4px",
  };

  const pStyle: React.CSSProperties = {
    color: palette.text,
    opacity: 0.72,
    fontSize: "14px",
    lineHeight: 1.9,
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-elevated"
      style={{ backgroundColor: palette.bg, color: palette.text, fontFamily: fontBody }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          padding: `${py} ${px}`,
          background: tpl.heroGradient(palette.bg, palette.primary),
          textAlign: tpl.heroAlign,
          display: "flex",
          flexDirection: "column",
          alignItems: tpl.heroAlign === "center" ? "center" : "flex-start",
        }}
      >
        {tpl.divider(palette.accent)}
        <h1
          {...editable("heroTitle")}
          style={{
            fontFamily: fontTitle,
            color: palette.text,
            fontSize: mobile ? "34px" : tpl.titleSize,
            fontStyle: tpl.titleItalic ? "italic" : "normal",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}
        >
          {draft.heroTitle || defaultTitle}
        </h1>
        {tpl.divider(palette.accent)}
        <p
          {...editable("heroSubtitle")}
          style={{ color: palette.text, opacity: 0.65, fontSize: "15px", letterSpacing: "0.06em" }}
        >
          {draft.heroSubtitle || defaultDate}
        </p>
        {wedding?.venue && (
          <p style={{ color: palette.text, opacity: 0.45, fontSize: "13px", marginTop: "6px" }}>
            {wedding.venue}
          </p>
        )}
      </div>

      {/* ── Nuestra historia ── */}
      <div style={sectionStyle(0)}>
        {tpl.divider(palette.accent)}
        <h2 style={h2Style}>Nuestra historia</h2>
        <p {...editable("storyText")} style={{ ...pStyle, marginTop: "12px" }}>
          {draft.storyText || <em style={{ opacity: 0.4 }}>Cuéntales cómo os conocisteis... (haz clic para editar)</em>}
        </p>
      </div>

      {/* ── Horarios ── */}
      <div style={sectionStyle(1)}>
        {tpl.divider(palette.accent)}
        <h2 style={h2Style}>Horarios del día</h2>
        <pre
          {...editable("scheduleText")}
          style={{ ...pStyle, marginTop: "12px", fontFamily: fontBody, whiteSpace: "pre-wrap" }}
        >
          {draft.scheduleText || "17:00 — Ceremonia\n18:00 — Cóctel\n20:00 — Cena"}
        </pre>
      </div>

      {/* ── Cómo llegar ── */}
      <div style={sectionStyle(2)}>
        {tpl.divider(palette.accent)}
        <h2 style={h2Style}>Cómo llegar</h2>
        <p {...editable("locationText")} style={{ ...pStyle, marginTop: "12px" }}>
          {draft.locationText || <em style={{ opacity: 0.4 }}>Escribe la dirección y cómo llegar... (haz clic para editar)</em>}
        </p>
      </div>

      {/* ── Transporte ── */}
      <div style={sectionStyle(3)}>
        {tpl.divider(palette.accent)}
        <h2 style={h2Style}>Transporte</h2>
        <p {...editable("transportText")} style={{ ...pStyle, marginTop: "12px" }}>
          {draft.transportText || <em style={{ opacity: 0.4 }}>Información sobre el transporte... (haz clic para editar)</em>}
        </p>
        {(draft.transportOptions || []).length > 0 && (
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", alignItems: tpl.heroAlign === "center" ? "center" : "flex-start" }}>
            {(draft.transportOptions || []).map((opt, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: tpl.buttonRadius,
                  backgroundColor: `${palette.accent}22`,
                  color: palette.text,
                  fontSize: "13px",
                }}
              >
                <span style={{ color: palette.accent }}>◎</span>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Alojamiento ── */}
      <div style={sectionStyle(4)}>
        {tpl.divider(palette.accent)}
        <h2 style={h2Style}>Alojamiento recomendado</h2>
        <p {...editable("accommodationText")} style={{ ...pStyle, marginTop: "12px" }}>
          {draft.accommodationText || <em style={{ opacity: 0.4 }}>Hoteles y opciones cercanas... (haz clic para editar)</em>}
        </p>
      </div>

      {/* ── Código de vestimenta ── */}
      <div
        style={{
          marginTop: "8px",
          marginBottom: "8px",
          marginLeft: px,
          marginRight: px,
          padding: "20px 24px",
          borderRadius: "12px",
          backgroundColor: `${palette.accent}18`,
          border: `1px solid ${palette.accent}35`,
          textAlign: "center",
        }}
      >
        <p style={{ color: palette.accent, fontSize: "10px", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "6px" }}>
          CÓDIGO DE VESTIMENTA
        </p>
        <p {...editable("dressCode")} style={{ fontFamily: fontTitle, color: palette.text, fontSize: "17px", fontStyle: tpl.titleItalic ? "italic" : "normal" }}>
          {draft.dressCode || <em style={{ opacity: 0.4 }}>Ej: Elegante, semiformal...</em>}
        </p>
      </div>

      {/* ── Secciones personalizadas ── */}
      {(draft.customSections || []).map((section, i) => (
        <div key={i} style={sectionStyle(5 + i)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{section.title || "Sección personalizada"}</h2>
          <p style={{ ...pStyle, marginTop: "12px" }}>{section.content}</p>
        </div>
      ))}

      {/* ── RSVP ── */}
      {draft.rsvpEnabled !== false && (
        <div
          style={{
            padding: `${mobile ? "40px" : "56px"} ${px}`,
            textAlign: "center",
            borderTop: `${tpl.borderStyle} ${palette.primary}35`,
            backgroundColor: `${palette.primary}28`,
          }}
        >
          <h2 style={{ fontFamily: fontTitle, color: palette.text, fontSize: mobile ? "26px" : "32px", fontStyle: tpl.titleItalic ? "italic" : "normal", marginBottom: "8px" }}>
            ¿Vendrás?
          </h2>
          {draft.rsvpDeadline && (
            <p style={{ color: palette.text, opacity: 0.55, fontSize: "13px", marginBottom: "24px" }}>
              Confirma antes del{" "}
              {new Date(draft.rsvpDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "12px 28px",
                borderRadius: tpl.buttonRadius,
                backgroundColor: palette.accent,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: "default",
              }}
            >
              Confirmar asistencia
            </button>
            <button
              style={{
                padding: "12px 28px",
                borderRadius: tpl.buttonRadius,
                backgroundColor: "transparent",
                color: palette.text,
                fontSize: "14px",
                fontWeight: 500,
                border: `1px solid ${palette.primary}80`,
                cursor: "default",
              }}
            >
              No podré ir
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ padding: "20px", textAlign: "center", borderTop: `1px solid ${palette.primary}30` }}>
        <p style={{ color: palette.text, opacity: 0.35, fontSize: "11px" }}>Con amor • KissthePlan</p>
      </div>
    </div>
  );
}

// --- Step 1: Design ---
function DesignStep({
  draft,
  updateDraft,
}: {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Template */}
      <div>
        <Label>Plantilla</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateDraft({ templateId: t.id })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                (draft.templateId || "classic") === t.id
                  ? "border-cta bg-cta/5"
                  : "border-border hover:border-brand"
              }`}
            >
              <p className="text-[12px] font-semibold text-text">{t.name}</p>
              <p className="text-[11px] text-brand mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color palette */}
      <div>
        <Label>Paleta de colores</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {COLOR_PALETTES.map((p) => (
            <button
              key={p.name}
              onClick={() => updateDraft({ colorPalette: p.colors })}
              className={`p-3 rounded-xl border-2 transition-all ${
                draft.colorPalette?.primary === p.colors.primary
                  ? "border-cta"
                  : "border-border hover:border-brand"
              }`}
            >
              <div className="flex gap-1 mb-1.5">
                {Object.values(p.colors).map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-[12px] font-medium text-text">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div className="space-y-3">
        <div>
          <Label>Tipografía títulos</Label>
          <select
            value={draft.fontTitle || "Playfair Display"}
            onChange={(e) => updateDraft({ fontTitle: e.target.value })}
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text outline-none focus:border-cta mt-1"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Tipografía cuerpo</Label>
          <select
            value={draft.fontBody || "Quicksand"}
            onChange={(e) => updateDraft({ fontBody: e.target.value })}
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text outline-none focus:border-cta mt-1"
          >
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

// --- Step 2: RSVP ---
function RsvpStep({
  draft,
  updateDraft,
}: {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}) {
  const addMealOption = () => {
    const options = [...(draft.mealOptions || []), ""];
    updateDraft({ mealOptions: options });
  };

  const updateMealOption = (i: number, value: string) => {
    const options = [...(draft.mealOptions || [])];
    options[i] = value;
    updateDraft({ mealOptions: options });
  };

  const removeMealOption = (i: number) => {
    const options = (draft.mealOptions || []).filter((_, idx) => idx !== i);
    updateDraft({ mealOptions: options });
  };

  const addTransportOption = () => {
    const options = [...(draft.transportOptions || []), ""];
    updateDraft({ transportOptions: options });
  };

  const updateTransportOption = (i: number, value: string) => {
    const options = [...(draft.transportOptions || [])];
    options[i] = value;
    updateDraft({ transportOptions: options });
  };

  const removeTransportOption = (i: number) => {
    const options = (draft.transportOptions || []).filter((_, idx) => idx !== i);
    updateDraft({ transportOptions: options });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={draft.rsvpEnabled !== false}
            onChange={(e) => updateDraft({ rsvpEnabled: e.target.checked })}
            className="w-4 h-4 rounded accent-cta"
          />
          <span className="text-[13px] text-text font-medium">Habilitar confirmación de asistencia (RSVP)</span>
        </label>
      </div>

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

          {/* Meal options */}
          <div>
            <Label>Opciones de plato</Label>
            <div className="space-y-2 mt-2">
              {(draft.mealOptions || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => updateMealOption(i, e.target.value)}
                    placeholder="Ej: Carne, Pescado..."
                  />
                  <button
                    onClick={() => removeMealOption(i)}
                    className="text-brand hover:text-danger transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addMealOption}
                className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors mt-1"
              >
                <Plus size={12} />
                Añadir opción de plato
              </button>
            </div>
          </div>

          {/* Transport options */}
          <div>
            <Label>Puntos de recogida (transporte)</Label>
            <div className="space-y-2 mt-2">
              {(draft.transportOptions || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => updateTransportOption(i, e.target.value)}
                    placeholder="Ej: Barcelona centro, Aeropuerto..."
                  />
                  <button
                    onClick={() => removeTransportOption(i)}
                    className="text-brand hover:text-danger transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addTransportOption}
                className="flex items-center gap-1 text-[12px] text-brand hover:text-cta transition-colors mt-1"
              >
                <Plus size={12} />
                Añadir punto de recogida
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Step 3: Content ---
function ContentStep({
  draft,
  updateDraft,
}: {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
}) {
  const addCustomSection = () => {
    const sections = [...(draft.customSections || []), { title: "", content: "" }];
    updateDraft({ customSections: sections });
  };

  const updateCustomSection = (i: number, field: "title" | "content", value: string) => {
    const sections = [...(draft.customSections || [])];
    sections[i] = { ...sections[i], [field]: value };
    updateDraft({ customSections: sections });
  };

  const removeCustomSection = (i: number) => {
    const sections = (draft.customSections || []).filter((_, idx) => idx !== i);
    updateDraft({ customSections: sections });
  };

  const ta = "w-full bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="heroTitle">Título principal</Label>
          <Input
            id="heroTitle"
            value={draft.heroTitle || ""}
            onChange={(e) => updateDraft({ heroTitle: e.target.value })}
            placeholder="Lucía & Pablo"
          />
        </div>
        <div>
          <Label htmlFor="heroSubtitle">Subtítulo</Label>
          <Input
            id="heroSubtitle"
            value={draft.heroSubtitle || ""}
            onChange={(e) => updateDraft({ heroSubtitle: e.target.value })}
            placeholder="12 de septiembre de 2026"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="storyText">Nuestra historia</Label>
        <textarea
          id="storyText"
          value={draft.storyText || ""}
          onChange={(e) => updateDraft({ storyText: e.target.value })}
          placeholder="Cuéntales cómo os conocisteis..."
          rows={3}
          className={ta}
        />
      </div>

      <div>
        <Label htmlFor="scheduleText">Horarios del día</Label>
        <textarea
          id="scheduleText"
          value={draft.scheduleText || ""}
          onChange={(e) => updateDraft({ scheduleText: e.target.value })}
          placeholder={"17:00 — Ceremonia\n18:00 — Cóctel\n20:00 — Cena"}
          rows={3}
          className={ta}
        />
      </div>

      <div>
        <Label htmlFor="locationText">Cómo llegar</Label>
        <textarea
          id="locationText"
          value={draft.locationText || ""}
          onChange={(e) => updateDraft({ locationText: e.target.value })}
          placeholder="Dirección y indicaciones para llegar al lugar..."
          rows={2}
          className={ta}
        />
      </div>

      <div>
        <Label htmlFor="transportText">Transporte</Label>
        <textarea
          id="transportText"
          value={draft.transportText || ""}
          onChange={(e) => updateDraft({ transportText: e.target.value })}
          placeholder="Información sobre el transporte..."
          rows={2}
          className={ta}
        />
      </div>

      <div>
        <Label htmlFor="accommodationText">Alojamiento recomendado</Label>
        <textarea
          id="accommodationText"
          value={draft.accommodationText || ""}
          onChange={(e) => updateDraft({ accommodationText: e.target.value })}
          placeholder="Hotels y opciones de alojamiento cerca del venue..."
          rows={2}
          className={ta}
        />
      </div>

      <div>
        <Label htmlFor="dressCode">Código de vestimenta</Label>
        <Input
          id="dressCode"
          value={draft.dressCode || ""}
          onChange={(e) => updateDraft({ dressCode: e.target.value })}
          placeholder="Ej: Elegante, semiformal..."
        />
      </div>

      {/* Custom sections */}
      <div>
        <Label>Secciones personalizadas</Label>
        <div className="space-y-3 mt-2">
          {(draft.customSections || []).map((section, i) => (
            <div key={i} className="bg-bg2 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={section.title}
                  onChange={(e) => updateCustomSection(i, "title", e.target.value)}
                  placeholder="Título de la sección"
                  className="flex-1"
                />
                <button
                  onClick={() => removeCustomSection(i)}
                  className="text-brand hover:text-danger transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                value={section.content}
                onChange={(e) => updateCustomSection(i, "content", e.target.value)}
                placeholder="Contenido..."
                rows={2}
                className="w-full bg-white border-[1.5px] border-border rounded-md px-3 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta transition-all"
              />
            </div>
          ))}
          <button
            onClick={addCustomSection}
            className="flex items-center gap-1.5 text-[13px] text-brand hover:text-cta transition-colors"
          >
            <Plus size={14} />
            Añadir sección personalizada
          </button>
        </div>
      </div>
    </div>
  );
}
