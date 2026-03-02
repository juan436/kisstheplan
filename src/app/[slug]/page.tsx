"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import {
  MapPin,
  Calendar,
  Heart,
  Check,
  Clock,
  Bus,
  Hotel,
  Shirt,
  ChevronDown,
} from "lucide-react";
import type { PublicWeddingData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function PublicWeddingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<PublicWeddingData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/public/wedding/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Heart size={32} className="text-cta" />
          <p className="text-brand text-[14px]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
        <Card variant="elevated" className="text-center max-w-[500px] py-12 px-8">
          <div className="text-[48px] mb-4">💒</div>
          <h1 className="font-display text-[32px] italic text-text mb-2">
            {slug.replace(/-y-/g, " & ").replace(/-/g, " ")}
          </h1>
          <p className="text-[14px] text-brand mb-8 leading-relaxed">
            Esta web de boda aun no esta disponible. Pronto podras ver todos los detalles aqui.
          </p>
          <Logo />
        </Card>
      </div>
    );
  }

  const { wedding, page } = data;
  const colors = page.colorPalette;
  const template = page.templateId || "classic";

  // Calculate days until wedding
  const weddingDate = new Date(wedding.date);
  const today = new Date();
  const daysLeft = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formattedDate = weddingDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Check if there's any content to show
  const hasContent =
    page.storyText ||
    page.scheduleText ||
    page.locationText ||
    page.transportText ||
    page.accommodationText ||
    page.dressCode ||
    (page.customSections && page.customSections.length > 0);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: page.fontBody,
      }}
    >
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6"
        style={{
          background: template === "modern"
            ? `linear-gradient(180deg, ${colors.bg} 0%, ${colors.primary}15 100%)`
            : template === "romantic"
            ? `radial-gradient(ellipse at center, ${colors.accent}08 0%, ${colors.bg} 70%)`
            : undefined,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {template === "classic" && (
            <>
              <div
                className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-0.5 opacity-20"
                style={{ backgroundColor: colors.accent }}
              />
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-0.5 opacity-20"
                style={{ backgroundColor: colors.accent }}
              />
            </>
          )}
          {template === "romantic" && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]"
              style={{ backgroundColor: colors.accent }}
            />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Heart
            size={28}
            style={{ color: colors.accent }}
            className="mx-auto mb-6 opacity-60"
          />

          {/* Names */}
          <h1
            className="text-[42px] sm:text-[56px] md:text-[72px] leading-tight mb-2"
            style={{
              fontFamily: page.fontTitle,
              fontStyle: template === "modern" ? "normal" : "italic",
              fontWeight: template === "modern" ? 600 : 400,
              letterSpacing: template === "modern" ? "-0.02em" : undefined,
            }}
          >
            {page.heroTitle || `${wedding.partner1Name} & ${wedding.partner2Name}`}
          </h1>

          {/* Subtitle / Date */}
          {page.heroSubtitle && (
            <p className="text-[16px] sm:text-[18px] opacity-60 mb-6 tracking-wide">
              {page.heroSubtitle}
            </p>
          )}

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="w-16 h-px opacity-30" style={{ backgroundColor: colors.accent }} />
            <div
              className="w-2 h-2 rounded-full opacity-40"
              style={{ backgroundColor: colors.accent }}
            />
            <div className="w-16 h-px opacity-30" style={{ backgroundColor: colors.accent }} />
          </div>

          {/* Date and venue */}
          <div className="space-y-3">
            <p className="flex items-center justify-center gap-2 text-[15px] opacity-70">
              <Calendar size={16} style={{ color: colors.accent }} />
              <span className="capitalize">{formattedDate}</span>
            </p>
            <p className="flex items-center justify-center gap-2 text-[15px] opacity-70">
              <MapPin size={16} style={{ color: colors.accent }} />
              {wedding.venue}
              {wedding.location ? `, ${wedding.location}` : ""}
            </p>
          </div>

          {/* Countdown */}
          {daysLeft > 0 && (
            <div className="mt-10">
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                style={{ backgroundColor: colors.accent + "12" }}
              >
                <span
                  className="text-[28px] font-semibold"
                  style={{
                    fontFamily: page.fontTitle,
                    color: colors.accent,
                  }}
                >
                  {daysLeft}
                </span>
                <span className="text-[13px] opacity-60">
                  {daysLeft === 1 ? "dia" : "dias"} para el gran dia
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        {hasContent && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
            <ChevronDown size={24} style={{ color: colors.accent }} />
          </div>
        )}
      </section>

      {/* Content Sections */}
      <div className="max-w-[700px] mx-auto px-6 pb-20">
        {/* Story */}
        {page.storyText && (
          <ContentSection
            icon={<Heart size={20} />}
            title="Nuestra historia"
            colors={colors}
            fontTitle={page.fontTitle}
            template={template}
          >
            <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">
              {page.storyText}
            </p>
          </ContentSection>
        )}

        {/* Schedule */}
        {page.scheduleText && (
          <ContentSection
            icon={<Clock size={20} />}
            title="Horarios del dia"
            colors={colors}
            fontTitle={page.fontTitle}
            template={template}
          >
            <div className="space-y-3">
              {page.scheduleText.split("\n").filter(Boolean).map((line, i) => {
                const parts = line.match(/^(\d{1,2}[.:]\d{2})\s*[-—]\s*(.+)$/);
                if (parts) {
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 py-2"
                    >
                      <span
                        className="text-[15px] font-semibold shrink-0 w-14"
                        style={{ color: colors.accent, fontFamily: page.fontTitle }}
                      >
                        {parts[1]}
                      </span>
                      <span className="text-[15px] opacity-75">{parts[2]}</span>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-[15px] opacity-75">
                    {line}
                  </p>
                );
              })}
            </div>
          </ContentSection>
        )}

        {/* Location */}
        {page.locationText && (
          <ContentSection
            icon={<MapPin size={20} />}
            title="Como llegar"
            colors={colors}
            fontTitle={page.fontTitle}
            template={template}
          >
            <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">
              {page.locationText}
            </p>
          </ContentSection>
        )}

        {/* Transport */}
        {page.transportText && (
          <ContentSection
            icon={<Bus size={20} />}
            title="Transporte"
            colors={colors}
            fontTitle={page.fontTitle}
            template={template}
          >
            <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">
              {page.transportText}
            </p>
          </ContentSection>
        )}

        {/* Accommodation */}
        {page.accommodationText && (
          <ContentSection
            icon={<Hotel size={20} />}
            title="Alojamiento"
            colors={colors}
            fontTitle={page.fontTitle}
            template={template}
          >
            <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">
              {page.accommodationText}
            </p>
          </ContentSection>
        )}

        {/* Dress code */}
        {page.dressCode && (
          <ContentSection
            icon={<Shirt size={20} />}
            title="Codigo de vestimenta"
            colors={colors}
            fontTitle={page.fontTitle}
            template={template}
          >
            <p className="text-[17px] font-medium opacity-80" style={{ fontFamily: page.fontTitle }}>
              {page.dressCode}
            </p>
          </ContentSection>
        )}

        {/* Custom sections */}
        {page.customSections?.map(
          (section, i) =>
            section.title && (
              <ContentSection
                key={i}
                title={section.title}
                colors={colors}
                fontTitle={page.fontTitle}
                template={template}
              >
                <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">
                  {section.content}
                </p>
              </ContentSection>
            )
        )}

        {/* RSVP */}
        {page.rsvpEnabled && (
          <section className="mt-20 mb-8">
            <div
              className="rounded-2xl p-8 sm:p-10"
              style={{ backgroundColor: colors.primary + "10" }}
            >
              <RsvpForm slug={slug} page={page} colors={colors} />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-12 pb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px opacity-20" style={{ backgroundColor: colors.accent }} />
            <Heart size={14} style={{ color: colors.accent }} className="opacity-30" />
            <div className="w-12 h-px opacity-20" style={{ backgroundColor: colors.accent }} />
          </div>
          <p className="text-[11px] opacity-30">
            Hecho con amor y{" "}
            <Link href="/" className="hover:opacity-70 transition-opacity underline">
              KissthePlan
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

/* --- Content Section Component --- */
function ContentSection({
  icon,
  title,
  colors,
  fontTitle,
  template,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  colors: Record<string, string>;
  fontTitle: string;
  template: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20 text-center">
      {/* Icon */}
      {icon && (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            backgroundColor: colors.accent + "12",
            color: colors.accent,
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h2
        className="text-[26px] sm:text-[30px] mb-2"
        style={{
          fontFamily: fontTitle,
          fontStyle: template === "modern" ? "normal" : "italic",
          fontWeight: template === "modern" ? 600 : 400,
        }}
      >
        {title}
      </h2>

      {/* Divider */}
      <div className="w-10 h-0.5 mx-auto mt-3 mb-6 rounded-full" style={{ backgroundColor: colors.accent, opacity: 0.3 }} />

      {/* Content */}
      {children}
    </section>
  );
}

/* --- RSVP Form --- */
function RsvpForm({
  slug,
  page,
  colors,
}: {
  slug: string;
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
}) {
  const [guestName, setGuestName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "rejected">(
    "confirmed"
  );
  const [mealChoice, setMealChoice] = useState("");
  const [allergies, setAllergies] = useState("");
  const [transport, setTransport] = useState(false);
  const [transportPickupPoint, setTransportPickupPoint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError("Por favor, introduce tu nombre");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/public/rsvp/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          rsvpStatus,
          mealChoice: mealChoice || undefined,
          allergies: allergies.trim() || undefined,
          transport,
          transportPickupPoint: transportPickupPoint || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Error" }));
        throw new Error(data.message);
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: colors.accent + "20" }}
        >
          <Check size={32} style={{ color: colors.accent }} />
        </div>
        <h2
          className="text-[28px] mb-3"
          style={{ fontFamily: page.fontTitle, fontStyle: "italic" }}
        >
          {rsvpStatus === "confirmed"
            ? "Nos vemos alli!"
            : "Te echaremos de menos"}
        </h2>
        <p className="text-[15px] opacity-60">
          {rsvpStatus === "confirmed"
            ? "Tu confirmacion ha sido registrada. Gracias!"
            : "Lamentamos que no puedas asistir. Gracias por avisarnos."}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Heart
        size={20}
        style={{ color: colors.accent }}
        className="mx-auto mb-4 opacity-50"
      />
      <h2
        className="text-[28px] mb-2"
        style={{ fontFamily: page.fontTitle, fontStyle: "italic" }}
      >
        Confirma tu asistencia
      </h2>
      <p className="text-[14px] opacity-50 mb-8">
        {page.rsvpDeadline
          ? `Antes del ${new Date(page.rsvpDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`
          : "Te esperamos"}
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto space-y-5 text-left"
      >
        {/* Name */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">
            Tu nombre completo
          </label>
          <Input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Nombre y apellidos"
            className="bg-white/80 backdrop-blur"
          />
        </div>

        {/* Attendance */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">
            Asistencia
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRsvpStatus("confirmed")}
              className="py-3.5 rounded-xl border-2 text-[14px] font-medium transition-all"
              style={{
                borderColor:
                  rsvpStatus === "confirmed" ? colors.accent : colors.primary + "30",
                backgroundColor:
                  rsvpStatus === "confirmed" ? colors.accent + "10" : "transparent",
                color: rsvpStatus === "confirmed" ? colors.text : colors.text + "80",
              }}
            >
              Confirmo
            </button>
            <button
              type="button"
              onClick={() => setRsvpStatus("rejected")}
              className="py-3.5 rounded-xl border-2 text-[14px] font-medium transition-all"
              style={{
                borderColor:
                  rsvpStatus === "rejected" ? colors.accent : colors.primary + "30",
                backgroundColor:
                  rsvpStatus === "rejected" ? colors.accent + "10" : "transparent",
                color: rsvpStatus === "rejected" ? colors.text : colors.text + "80",
              }}
            >
              No puedo
            </button>
          </div>
        </div>

        {rsvpStatus === "confirmed" && (
          <>
            {/* Meal */}
            {page.mealOptions.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">
                  Eleccion de plato
                </label>
                <select
                  value={mealChoice}
                  onChange={(e) => setMealChoice(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur border-[1.5px] rounded-xl px-4 py-3 text-[14px] outline-none transition-colors"
                  style={{
                    borderColor: mealChoice ? colors.accent : colors.primary + "30",
                    color: colors.text,
                  }}
                >
                  <option value="">Selecciona una opcion</option>
                  {page.mealOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Allergies */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">
                Alergias o restricciones
              </label>
              <Input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Celiaco, intolerante a la lactosa..."
                className="bg-white/80 backdrop-blur"
              />
            </div>

            {/* Transport */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: transport ? colors.accent : colors.primary + "40",
                    backgroundColor: transport ? colors.accent : "transparent",
                  }}
                >
                  {transport && <Check size={12} className="text-white" />}
                </div>
                <span className="text-[14px]">Necesito transporte</span>
              </label>
              <input
                type="checkbox"
                checked={transport}
                onChange={(e) => setTransport(e.target.checked)}
                className="hidden"
              />
            </div>

            {transport && page.transportOptions.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 opacity-50">
                  Punto de recogida
                </label>
                <select
                  value={transportPickupPoint}
                  onChange={(e) =>
                    setTransportPickupPoint(e.target.value)
                  }
                  className="w-full bg-white/80 backdrop-blur border-[1.5px] rounded-xl px-4 py-3 text-[14px] outline-none transition-colors"
                  style={{
                    borderColor: transportPickupPoint ? colors.accent : colors.primary + "30",
                    color: colors.text,
                  }}
                >
                  <option value="">Selecciona un punto</option>
                  {page.transportOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="text-[13px] text-center" style={{ color: "#c47a7a" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl text-white text-[15px] font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: colors.accent }}
        >
          {submitting ? "Enviando..." : "Enviar confirmacion"}
        </button>
      </form>
    </div>
  );
}
