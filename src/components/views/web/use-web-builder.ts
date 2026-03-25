"use client";

import { useState, useCallback } from "react";
import { api } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import type { WebPageConfig } from "@/types";
import { SITE_URL } from "./web-constants";

export function useWebBuilder(
  page: WebPageConfig | null,
  setPage: React.Dispatch<React.SetStateAction<WebPageConfig | null>>,
) {
  const { wedding } = useAuth();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState<Partial<WebPageConfig>>(page ?? {});
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugValue, setSlugValue] = useState("");
  const [slugError, setSlugError] = useState("");
  const [savingSlug, setSavingSlug] = useState(false);

  const updateDraft = useCallback((updates: Partial<WebPageConfig>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const saveDraft = useCallback(async (): Promise<WebPageConfig | null> => {
    setSaving(true);
    try {
      if (page) {
        const updated = await api.updateWebPage(draft);
        setPage(updated);
        setDraft((prev) => ({ ...prev, ...updated }));
        return updated;
      } else {
        const created = await api.createWebPage(draft);
        setPage(created);
        setDraft((prev) => ({ ...prev, ...created }));
        return created;
      }
    } catch { return null; }
    finally { setSaving(false); }
  }, [page, draft, setPage]);

  const handlePublish = useCallback(async () => {
    const currentlyPublished = page?.isPublished ?? false;
    const saved = await saveDraft();
    if (!saved && !page) return;
    setSaving(true);
    try {
      const result = currentlyPublished ? await api.unpublishWebPage() : await api.publishWebPage();
      const publishFields = { isPublished: result.isPublished, publishedAt: result.publishedAt };
      setPage((prev) => prev ? { ...prev, ...publishFields } : result);
      setDraft((prev) => ({ ...prev, ...publishFields }));
    } finally { setSaving(false); }
  }, [page, saveDraft, setPage]);

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
    if (clean.length < 3) { setSlugError("El slug debe tener al menos 3 caracteres"); return; }
    setSavingSlug(true); setSlugError("");
    try {
      await api.updateWedding(wedding.id, { slug: clean });
      wedding.slug = clean;
      setEditingSlug(false);
    } catch (err) { setSlugError(err instanceof Error ? err.message : "Ese slug ya está en uso"); }
    finally { setSavingSlug(false); }
  }, [slugValue, wedding]);

  return {
    wedding, saving, copied, draft, updateDraft, saveDraft, handlePublish, handleCopyLink,
    editingSlug, setEditingSlug, slugValue, setSlugValue, slugError, setSlugError,
    savingSlug, handleSaveSlug,
  };
}
