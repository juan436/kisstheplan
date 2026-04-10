"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { WebPageConfig } from "@/types";
import { SITE_URL } from "../constants/web.constants";

type SlugStatus = "idle" | "checking" | "available" | "taken";

export function useWebBuilder() {
  const { wedding } = useAuth();

  const [page,        setPage]        = useState<WebPageConfig | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [draft,       setDraft]       = useState<Partial<WebPageConfig>>({});
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugValue,   setSlugValue]   = useState("");
  const [slugError,   setSlugError]   = useState("");
  const [slugStatus,  setSlugStatus]  = useState<SlugStatus>("idle");
  const [savingSlug,  setSavingSlug]  = useState(false);

  useEffect(() => {
    api.getWebPage()
      .then((data) => { if (data) { setPage(data); setDraft(data); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateDraft = useCallback((updates: Partial<WebPageConfig>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSlugInputChange = useCallback((value: string) => {
    setSlugValue(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setSlugStatus("idle");
    setSlugError("");
  }, []);

  const handleCheckSlug = useCallback(async () => {
    if (!slugValue.trim()) return;
    const clean = slugValue.trim();
    if (clean.length < 3) { setSlugError("Mínimo 3 caracteres"); return; }
    setSlugStatus("checking"); setSlugError("");
    try {
      const result = await api.checkSlug(clean);
      setSlugStatus(result.available ? "available" : "taken");
      if (!result.available) setSlugError("Ese slug ya está en uso por otra pareja");
    } catch {
      setSlugStatus("idle");
      setSlugError("Error al verificar disponibilidad");
    }
  }, [slugValue]);

  const saveDraft = useCallback(async (): Promise<WebPageConfig | null> => {
    setSaving(true);
    try {
      if (page) {
        const updated = await api.updateWebPage(draft);
        setPage(updated); setDraft((prev) => ({ ...prev, ...updated }));
        return updated;
      } else {
        const created = await api.createWebPage(draft);
        setPage(created); setDraft((prev) => ({ ...prev, ...created }));
        return created;
      }
    } catch { return null; }
    finally { setSaving(false); }
  }, [page, draft]);

  const handlePublish = useCallback(async () => {
    const currentlyPublished = page?.isPublished ?? false;
    const saved = await saveDraft();
    if (!saved && !page) return;
    setSaving(true);
    try {
      const result = currentlyPublished ? await api.unpublishWebPage() : await api.publishWebPage();
      const fields = { isPublished: result.isPublished, publishedAt: result.publishedAt };
      setPage((prev) => prev ? { ...prev, ...fields } : result);
      setDraft((prev) => ({ ...prev, ...fields }));
    } finally { setSaving(false); }
  }, [page, saveDraft]);

  const handleCopyLink = useCallback(() => {
    if (wedding?.slug) {
      navigator.clipboard.writeText(`${SITE_URL}/${wedding.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [wedding]);

  const handleSaveSlug = useCallback(async () => {
    if (!slugValue.trim() || !wedding) return;
    const clean = slugValue.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean.length < 3) { setSlugError("Mínimo 3 caracteres"); return; }
    setSavingSlug(true); setSlugError("");
    try {
      await api.updateWedding(wedding.id, { slug: clean });
      wedding.slug = clean;
      setEditingSlug(false); setSlugStatus("idle");
    } catch (err) { setSlugError(err instanceof Error ? err.message : "Ese slug ya está en uso"); }
    finally { setSavingSlug(false); }
  }, [slugValue, wedding]);

  return {
    page, loading, wedding, saving, copied, draft, updateDraft, saveDraft, handlePublish, handleCopyLink,
    editingSlug, setEditingSlug, slugValue, slugStatus, slugError,
    savingSlug, handleSaveSlug, handleCheckSlug, handleSlugInputChange,
  };
}
