"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Link2, Check, ChevronRight, ChevronLeft, Plus, Trash2 } from "lucide-react";
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

  const saveDraft = async () => {
    setSaving(true);
    try {
      if (page) {
        const updated = await api.updateWebPage(draft);
        setPage(updated);
        setDraft(updated);
      } else {
        const created = await api.createWebPage(draft);
        setPage(created);
        setDraft(created);
      }
    } catch {
      // Error saving
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await saveDraft();
    setSaving(true);
    try {
      const updated = page?.isPublished
        ? await api.unpublishWebPage()
        : await api.publishWebPage();
      setPage(updated);
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (wedding?.slug) {
      navigator.clipboard.writeText(`http://kisstheplan.com/${wedding.slug}`);
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
    <div className="max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-[28px] text-text">Web de Boda</h1>
          {wedding?.slug && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] text-brand">kisstheplan.es/</span>
              {editingSlug ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    value={slugValue}
                    onChange={(e) => setSlugValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="bg-white border border-cta rounded px-2 py-0.5 text-[13px] text-text outline-none w-40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveSlug();
                      if (e.key === "Escape") { setEditingSlug(false); setSlugError(""); }
                    }}
                  />
                  <Button variant="cta" size="sm" onClick={handleSaveSlug} disabled={savingSlug}>
                    {savingSlug ? "..." : "Guardar"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingSlug(false); setSlugError(""); }}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingSlug(true); setSlugValue(wedding.slug); }}
                  className="text-[13px] text-cta font-medium hover:underline"
                >
                  {wedding.slug}
                </button>
              )}
            </div>
          )}
          {slugError && <p className="text-[12px] text-danger mt-1">{slugError}</p>}
        </div>
        <div className="flex items-center gap-2">
          {wedding?.slug && (
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleCopyLink}>
              {copied ? <Check size={14} /> : <Link2 size={14} />}
              {copied ? "Copiado" : "Copiar enlace"}
            </Button>
          )}
          <Button
            variant={page?.isPublished ? "secondary" : "cta"}
            size="sm"
            className="gap-1.5"
            onClick={handlePublish}
            disabled={saving}
          >
            <Globe size={14} />
            {page?.isPublished ? "Despublicar" : "Publicar web"}
          </Button>
        </div>
      </div>

      {/* Status banner */}
      {page?.isPublished && (
        <div className="bg-success/10 border border-success/30 rounded-lg px-4 py-3 mb-6 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="text-[13px] text-text">
            Tu web está publicada en{" "}
            <a
              href={`/${wedding?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cta font-medium hover:underline"
            >
              kisstheplan.es/{wedding?.slug}
            </a>
          </span>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEP_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${step === i
                ? "bg-accent text-white"
                : "bg-bg2 text-text hover:bg-bg3"
              }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[11px]">
              {i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card className="p-6">
        {step === 0 && (
          <DesignStep draft={draft} updateDraft={updateDraft} />
        )}
        {step === 1 && (
          <RsvpStep draft={draft} updateDraft={updateDraft} />
        )}
        {step === 2 && (
          <ContentStep draft={draft} updateDraft={updateDraft} />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="gap-1.5"
        >
          <ChevronLeft size={16} />
          Anterior
        </Button>
        <Button variant="cta" onClick={saveDraft} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setStep(Math.min(2, step + 1))}
          disabled={step === 2}
          className="gap-1.5"
        >
          Siguiente
          <ChevronRight size={16} />
        </Button>
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
    <div className="space-y-8">
      {/* Template */}
      <div>
        <Label>Plantilla</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateDraft({ templateId: t.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${(draft.templateId || "classic") === t.id
                  ? "border-cta bg-cta/5"
                  : "border-border hover:border-brand"
                }`}
            >
              <p className="text-[13px] font-semibold text-text">{t.name}</p>
              <p className="text-[11px] text-brand mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color palette */}
      <div>
        <Label>Paleta de colores</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {COLOR_PALETTES.map((p) => (
            <button
              key={p.name}
              onClick={() => updateDraft({ colorPalette: p.colors })}
              className={`p-3 rounded-xl border-2 transition-all ${draft.colorPalette?.primary === p.colors.primary
                  ? "border-cta"
                  : "border-border hover:border-brand"
                }`}
            >
              <div className="flex gap-1 mb-2">
                {Object.values(p.colors).map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-border"
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
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Tipografía títulos</Label>
          <select
            value={draft.fontTitle || "Playfair Display"}
            onChange={(e) => updateDraft({ fontTitle: e.target.value })}
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] text-text outline-none focus:border-cta mt-1"
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
            className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] text-text outline-none focus:border-cta mt-1"
          >
            <option value="Quicksand">Quicksand</option>
            <option value="Lato">Lato</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Raleway">Raleway</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div>
        <Label>Vista previa</Label>
        <div
          className="mt-2 rounded-xl border border-border overflow-hidden p-8 text-center"
          style={{
            backgroundColor: draft.colorPalette?.bg || "#FAF7F2",
            color: draft.colorPalette?.text || "#4A3C32",
          }}
        >
          <p
            className="text-[32px] italic mb-2"
            style={{ fontFamily: draft.fontTitle || "Playfair Display" }}
          >
            {draft.heroTitle || "Nombre & Nombre"}
          </p>
          <p
            className="text-[14px] opacity-70"
            style={{ fontFamily: draft.fontBody || "Quicksand" }}
          >
            {draft.heroSubtitle || "12 de septiembre de 2026"}
          </p>
          <div
            className="w-16 h-0.5 mx-auto my-4"
            style={{ backgroundColor: draft.colorPalette?.accent || "#c7a977" }}
          />
          <p
            className="text-[13px] opacity-60"
            style={{ fontFamily: draft.fontBody || "Quicksand" }}
          >
            Finca Tagamanent, Barcelona
          </p>
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={draft.rsvpEnabled !== false}
            onChange={(e) => updateDraft({ rsvpEnabled: e.target.checked })}
            className="w-4 h-4 rounded accent-cta"
          />
          <span className="text-[14px] text-text font-medium">Habilitar confirmación de asistencia (RSVP)</span>
        </label>
      </div>

      {draft.rsvpEnabled !== false && (
        <>
          <div className="max-w-xs">
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
                    className="max-w-xs"
                  />
                  <button
                    onClick={() => removeMealOption(i)}
                    className="text-brand hover:text-danger transition-colors"
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
                    className="max-w-xs"
                  />
                  <button
                    onClick={() => removeTransportOption(i)}
                    className="text-brand hover:text-danger transition-colors"
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
          rows={4}
          className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-3 text-[14px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all"
        />
      </div>

      <div>
        <Label htmlFor="scheduleText">Horarios del día</Label>
        <textarea
          id="scheduleText"
          value={draft.scheduleText || ""}
          onChange={(e) => updateDraft({ scheduleText: e.target.value })}
          placeholder="17:00 — Ceremonia&#10;18:00 — Cóctel&#10;20:00 — Cena"
          rows={4}
          className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-3 text-[14px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all"
        />
      </div>

      <div>
        <Label htmlFor="locationText">Cómo llegar</Label>
        <textarea
          id="locationText"
          value={draft.locationText || ""}
          onChange={(e) => updateDraft({ locationText: e.target.value })}
          placeholder="Dirección y indicaciones para llegar al lugar..."
          rows={3}
          className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-3 text-[14px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all"
        />
      </div>

      <div>
        <Label htmlFor="transportText">Transporte</Label>
        <textarea
          id="transportText"
          value={draft.transportText || ""}
          onChange={(e) => updateDraft({ transportText: e.target.value })}
          placeholder="Información sobre el transporte para los invitados..."
          rows={3}
          className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-3 text-[14px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all"
        />
      </div>

      <div>
        <Label htmlFor="accommodationText">Alojamiento recomendado</Label>
        <textarea
          id="accommodationText"
          value={draft.accommodationText || ""}
          onChange={(e) => updateDraft({ accommodationText: e.target.value })}
          placeholder="Hotels y opciones de alojamiento cerca del venue..."
          rows={3}
          className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-3 text-[14px] text-text placeholder:text-brand outline-none focus:border-cta focus:bg-white transition-all"
        />
      </div>

      <div className="max-w-md">
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
        <div className="space-y-4 mt-2">
          {(draft.customSections || []).map((section, i) => (
            <div key={i} className="bg-bg2 rounded-lg p-4 space-y-3">
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
                rows={3}
                className="w-full bg-white border-[1.5px] border-border rounded-md px-4 py-3 text-[14px] text-text placeholder:text-brand outline-none focus:border-cta transition-all"
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
