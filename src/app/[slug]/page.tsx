"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import type { PublicWeddingData } from "@/types";
import { PublicWeddingHero } from "./public-wedding-hero";
import { PublicWeddingSections } from "./public-wedding-sections";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function PublicWeddingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<PublicWeddingData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/public/wedding/${slug}`)
      .then((res) => { if (!res.ok) throw new Error("Not found"); return res.json(); })
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

  const weddingDate = new Date(wedding.date);
  const today = new Date();
  const daysLeft = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const formattedDate = weddingDate.toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const hasContent = !!(
    page.storyText || page.scheduleText || page.locationText ||
    page.transportText || page.accommodationText || page.dressCode ||
    (page.customSections && page.customSections.length > 0)
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: page.fontBody }}>
      <PublicWeddingHero
        wedding={wedding} page={page} colors={colors} template={template}
        daysLeft={daysLeft} formattedDate={formattedDate} hasContent={hasContent}
      />
      <PublicWeddingSections page={page} colors={colors} template={template} slug={slug} />
    </div>
  );
}
