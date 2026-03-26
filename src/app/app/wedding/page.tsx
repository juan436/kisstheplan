"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services";
import type { UpdateWeddingData } from "@/services/api";
import { WeddingForm, type WeddingFormData } from "./wedding-form";
import { CoverPhotoUpload } from "./cover-photo-upload";
import { SectionTitle } from "./section-title";

export default function MiBodaPage() {
  const { wedding, refreshUserData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<WeddingFormData>({
    partner1Role: "Novio", partner1Name: "", partner1Last: "",
    partner2Role: "Novia", partner2Name: "", partner2Last: "",
    venue: "", location: "", date: "",
    timezone: "Europe/Madrid", currency: "EUR",
    estimatedGuests: "", estimatedBudget: "",
  });

  useEffect(() => {
    if (wedding?.photoUrl) setPhotoUrl(wedding.photoUrl);
  }, [wedding?.photoUrl]);

  useEffect(() => {
    if (wedding) {
      setFormData({
        partner1Role: wedding.partner1Role || "Novio",
        partner1Name: wedding.partner1Name || "",
        partner1Last: wedding.partner1Last || "",
        partner2Role: wedding.partner2Role || "Novia",
        partner2Name: wedding.partner2Name || "",
        partner2Last: wedding.partner2Last || "",
        venue: wedding.venue || "",
        location: wedding.location || "",
        date: wedding.date || "",
        timezone: wedding.timezone || "Europe/Madrid",
        currency: wedding.currency || "EUR",
        estimatedGuests: wedding.estimatedGuests?.toString() || "",
        estimatedBudget: wedding.estimatedBudget?.toString() || "",
      });
    }
  }, [wedding]);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const handleSave = async () => {
    if (!wedding) return;
    setSaving(true);
    try {
      const data: UpdateWeddingData = {
        partner1Name: formData.partner1Name, partner1Last: formData.partner1Last, partner1Role: formData.partner1Role,
        partner2Name: formData.partner2Name, partner2Last: formData.partner2Last, partner2Role: formData.partner2Role,
        venue: formData.venue, location: formData.location, date: formData.date,
        currency: formData.currency,
        estimatedGuests: parseInt(formData.estimatedGuests) || 0,
        estimatedBudget: parseInt(formData.estimatedBudget) || 0,
      };
      await api.updateWedding(wedding.id, data);
      await refreshUserData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving wedding:", err);
    } finally {
      setSaving(false);
    }
  };

  const displayName1 = formData.partner1Name || "Nombre";
  const displayName2 = formData.partner2Name || "Nombre";

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-8 pb-16 px-4">
      <Container>
        <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-6">
          <ArrowLeft size={16} />Volver al dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-[40px] md:text-[56px] text-text leading-tight flex items-center justify-center gap-4 flex-wrap">
            <span className="relative group">
              {displayName1}
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#866857] opacity-0 group-hover:opacity-30 transition-opacity" />
            </span>
            <span className="text-[#866857] italic serif">&</span>
            <span className="relative group">
              {displayName2}
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#866857] opacity-0 group-hover:opacity-30 transition-opacity" />
            </span>
          </h1>
          <p className="text-[#a89f91] text-[14px] mt-2 uppercase tracking-[3px] font-medium">Panel de configuración directa</p>
        </motion.div>

        <div className="max-w-[900px] mx-auto space-y-8">
          <WeddingForm data={formData} onChange={handleChange} />

          <div className="pt-8 space-y-4">
            <SectionTitle title="Foto de portada" />
            <CoverPhotoUpload
              currentUrl={photoUrl}
              weddingId={wedding?.id ?? ""}
              onUploaded={(url) => { setPhotoUrl(url); refreshUserData(); }}
              onRemove={() => { setPhotoUrl(null); if (wedding) api.updateWedding(wedding.id, { photoUrl: "" }); }}
            />
          </div>

          <div className="flex justify-center pt-12">
            <Button onClick={handleSave} disabled={saving} className="px-16 py-7 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">
              {saved
                ? <span className="flex items-center gap-2 text-[16px] font-bold tracking-[2px] uppercase"><Check size={20} />Guardado</span>
                : <span className="text-[16px] font-bold tracking-[2px] uppercase">{saving ? "Guardando..." : "Guardar"}</span>
              }
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
