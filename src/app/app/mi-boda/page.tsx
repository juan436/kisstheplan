"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Camera, ChevronDown, Check, X, ImagePlus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services";
import type { UpdateWeddingData } from "@/services/api";

export default function MiBodaPage() {
  const { wedding, refreshUserData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Sync photo from wedding on load
  useEffect(() => {
    if (wedding?.photoUrl) setPhotoUrl(wedding.photoUrl);
  }, [wedding?.photoUrl]);

  const [formData, setFormData] = useState({
    partner1Role: "Novio",
    partner1Name: "",
    partner1Last: "",
    partner2Role: "Novia",
    partner2Name: "",
    partner2Last: "",
    venue: "",
    location: "",
    date: "",
    timezone: "Europe/Madrid",
    currency: "EUR",
    estimatedGuests: "",
    estimatedBudget: "",
  });

  // Load wedding data into form
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
        partner1Name: formData.partner1Name,
        partner1Last: formData.partner1Last,
        partner1Role: formData.partner1Role,
        partner2Name: formData.partner2Name,
        partner2Last: formData.partner2Last,
        partner2Role: formData.partner2Role,
        venue: formData.venue,
        location: formData.location,
        date: formData.date,
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
        {/* Back to dashboard */}
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-[13px] text-accent hover:text-cta transition-colors no-underline font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>

        {/* Dynamic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
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
          <p className="text-[#a89f91] text-[14px] mt-2 uppercase tracking-[3px] font-medium">
            Panel de configuración directa
          </p>
        </motion.div>

        <div className="max-w-[900px] mx-auto space-y-8">
          {/* Section: Datos de la pareja */}
          <SectionTitle title="Datos de la pareja" />
          <Card
            variant="elevated"
            className="overflow-visible border-none shadow-sm pb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-4 px-2">
              {/* Partner 1 */}
              <div className="space-y-6">
                <CustomSelect
                  label="Rol"
                  value={formData.partner1Role}
                  options={["Novio", "Novia", "Otro"]}
                  onChange={(v) => handleChange("partner1Role", v)}
                />
                <div className="space-y-4">
                  <Input
                    placeholder="Nombre"
                    value={formData.partner1Name}
                    onChange={(e) =>
                      handleChange("partner1Name", e.target.value)
                    }
                    className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text font-medium"
                  />
                  <Input
                    placeholder="Apellidos"
                    value={formData.partner1Last}
                    onChange={(e) =>
                      handleChange("partner1Last", e.target.value)
                    }
                    className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text"
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="flex justify-center">
                <span className="font-display text-[32px] text-[#866857]">
                  &
                </span>
              </div>

              {/* Partner 2 */}
              <div className="space-y-6">
                <CustomSelect
                  label="Rol"
                  value={formData.partner2Role}
                  options={["Novio", "Novia", "Otro"]}
                  onChange={(v) => handleChange("partner2Role", v)}
                />
                <div className="space-y-4">
                  <Input
                    placeholder="Nombre"
                    value={formData.partner2Name}
                    onChange={(e) =>
                      handleChange("partner2Name", e.target.value)
                    }
                    className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text font-medium"
                  />
                  <Input
                    placeholder="Apellidos"
                    value={formData.partner2Last}
                    onChange={(e) =>
                      handleChange("partner2Last", e.target.value)
                    }
                    className="bg-[#f2efe9] border-none text-center h-12 rounded-xl text-text"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Detalles del Evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lugar de la boda */}
            <div className="space-y-6">
              <SectionTitle title="Lugar de la boda" />
              <Card
                variant="default"
                className="p-6 space-y-4 border-none shadow-sm bg-white/50"
              >
                <Input
                  placeholder="Nombre del lugar"
                  value={formData.venue}
                  onChange={(e) => handleChange("venue", e.target.value)}
                  className="bg-[#f2efe9] border-none text-center h-11"
                />
                <Input
                  placeholder="Dirección"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="bg-[#f2efe9] border-none text-center h-11"
                />
                <div className="text-center">
                  <span className="text-[11px] text-[#A0877C] uppercase tracking-wider bg-[#f2efe9] px-2 py-1 rounded-full cursor-pointer hover:bg-[#e8e2d8] transition-colors">
                    Posibilidad de buscar en Maps
                  </span>
                </div>
              </Card>

              {/* Guests and Budget */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">
                    Nº Invitados
                  </Label>
                  <Input
                    type="number"
                    value={formData.estimatedGuests}
                    onChange={(e) =>
                      handleChange("estimatedGuests", e.target.value)
                    }
                    className="bg-[#f2efe9] border-none text-center h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">
                    Presupuesto
                  </Label>
                  <Input
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) =>
                      handleChange("estimatedBudget", e.target.value)
                    }
                    className="bg-[#f2efe9] border-none text-center h-11"
                  />
                </div>
              </div>
            </div>

            {/* Fecha, Horario, Moneda */}
            <div className="space-y-6">
              <div className="space-y-2">
                <SectionTitle title="Fecha de la boda" />
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="bg-[#f2efe9] border-none text-center h-11"
                />
              </div>

              <div className="space-y-2">
                <SectionTitle title="Uso horario" />
                <CustomSelect
                  value={
                    TIMEZONE_LABELS[formData.timezone] || formData.timezone
                  }
                  options={Object.values(TIMEZONE_LABELS)}
                  onChange={(v) => {
                    const tz = Object.entries(TIMEZONE_LABELS).find(
                      ([, label]) => label === v
                    );
                    handleChange("timezone", tz ? tz[0] : v);
                  }}
                />
              </div>

              <div className="space-y-2">
                <SectionTitle title="Moneda" />
                <CustomSelect
                  value={CURRENCY_LABELS[formData.currency] || formData.currency}
                  options={Object.values(CURRENCY_LABELS)}
                  onChange={(v) => {
                    const cur = Object.entries(CURRENCY_LABELS).find(
                      ([, label]) => label === v
                    );
                    handleChange("currency", cur ? cur[0] : v);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section: Portada */}
          <div className="pt-8 space-y-4">
            <SectionTitle title="Foto de portada" />
            <CoverPhotoUpload
              currentUrl={photoUrl}
              weddingId={wedding?.id ?? ""}
              onUploaded={(url) => {
                setPhotoUrl(url);
                refreshUserData();
              }}
              onRemove={() => {
                setPhotoUrl(null);
                if (wedding) api.updateWedding(wedding.id, { photoUrl: "" });
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-12">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="px-16 py-7 bg-[#CBA978] hover:bg-[#b08f5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {saved ? (
                <span className="flex items-center gap-2 text-[16px] font-bold tracking-[2px] uppercase">
                  <Check size={20} />
                  Guardado
                </span>
              ) : (
                <span className="text-[16px] font-bold tracking-[2px] uppercase">
                  {saving ? "Guardando..." : "Guardar"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

/* ---------- CoverPhotoUpload ---------- */

function CoverPhotoUpload({
  currentUrl,
  weddingId,
  onUploaded,
  onRemove,
}: {
  currentUrl: string | null;
  weddingId: string;
  onUploaded: (url: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes (jpg, png, webp)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar los 5 MB");
        return;
      }
      setError(null);
      setUploading(true);
      try {
        const { url } = await api.uploadPhoto(file);
        // If real API returns relative path, prepend API base
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        const staticBase = apiBase.replace(/\/api$/, "");
        const fullUrl = url.startsWith("http") ? url : `${staticBase}${url}`;
        await api.updateWedding(weddingId, { photoUrl: fullUrl });
        onUploaded(fullUrl);
      } catch {
        setError("Error al subir la imagen. Inténtalo de nuevo.");
      } finally {
        setUploading(false);
      }
    },
    [weddingId, onUploaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile],
  );

  return (
    <div className="relative w-full">
      {currentUrl ? (
        /* Preview mode */
        <div className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden group">
          <img
            src={currentUrl}
            alt="Foto de portada"
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#866857] text-[13px] font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Camera size={16} />
              Cambiar foto
            </button>
            <button
              onClick={onRemove}
              className="flex items-center gap-2 bg-white/90 hover:bg-white text-red-500 text-[13px] font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <X size={16} />
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          className={`w-full aspect-[3/1] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer select-none
            ${dragging
              ? "border-[#CBA978] bg-[#fdf6ec] scale-[1.01]"
              : "border-[#e8ded1] bg-white hover:bg-[#f9f6f3] hover:border-[#d4bfa8]"
            }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform
            ${dragging ? "bg-[#fbefd8] scale-110" : "bg-[#f2efe9]"}`}>
            {uploading
              ? <div className="w-6 h-6 border-2 border-[#CBA978] border-t-transparent rounded-full animate-spin" />
              : <ImagePlus size={26} className="text-[#866857]" />
            }
          </div>
          <div className="text-center">
            <p className="text-[#866857] font-medium">
              {uploading ? "Subiendo imagen…" : dragging ? "Suelta aquí la imagen" : "Arrastra tu foto aquí"}
            </p>
            {!uploading && !dragging && (
              <p className="text-[#a89f91] text-[13px] mt-1">
                o <span className="underline underline-offset-2">haz clic para seleccionar</span> · JPG, PNG, WEBP · máx. 5 MB
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-[13px] text-red-500 text-center">{error}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}

/* ---------- Constants ---------- */

const TIMEZONE_LABELS: Record<string, string> = {
  "Europe/Madrid": "Madrid (Por defecto)",
  "Europe/London": "Londres",
  "America/New_York": "Nueva York",
  "America/Mexico_City": "México DF",
};

const CURRENCY_LABELS: Record<string, string> = {
  EUR: "Euro (Por defecto)",
  USD: "Dólar USD",
  MXN: "Peso MXN",
  GBP: "Libra GBP",
};

/* ---------- Sub-components ---------- */

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-[#866857] font-semibold text-[15px] uppercase tracking-widest pl-1 mb-4">
      {title}
    </h3>
  );
}

function CustomSelect({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2 relative">
      {label && (
        <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">
          {label}
        </Label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-[#f2efe9] rounded-xl px-4 flex items-center justify-between text-text group"
      >
        <span className="flex-1 text-center font-medium pl-6">{value}</span>
        <ChevronDown
          size={18}
          className={`text-[#866857] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-20 animate-fade-in">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full px-4 py-3 text-[14px] text-text hover:bg-bg2 transition-colors text-center"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
