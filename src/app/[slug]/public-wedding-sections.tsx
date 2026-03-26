import Link from "next/link";
import { Heart, Clock, MapPin, Bus, Hotel, Shirt } from "lucide-react";
import type { PublicWeddingData } from "@/types";
import { ContentSection } from "./content-section";
import { RsvpForm } from "./rsvp-form";

interface PublicWeddingSectionsProps {
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
  template: string;
  slug: string;
}

export function PublicWeddingSections({ page, colors, template, slug }: PublicWeddingSectionsProps) {
  return (
    <div className="max-w-[700px] mx-auto px-6 pb-20">
      {page.storyText && (
        <ContentSection icon={<Heart size={20} />} title="Nuestra historia" colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.storyText}</p>
        </ContentSection>
      )}

      {page.scheduleText && (
        <ContentSection icon={<Clock size={20} />} title="Horarios del dia" colors={colors} fontTitle={page.fontTitle} template={template}>
          <div className="space-y-3">
            {page.scheduleText.split("\n").filter(Boolean).map((line, i) => {
              const parts = line.match(/^(\d{1,2}[.:]\d{2})\s*[-—]\s*(.+)$/);
              if (parts) {
                return (
                  <div key={i} className="flex items-start gap-4 py-2">
                    <span className="text-[15px] font-semibold shrink-0 w-14" style={{ color: colors.accent, fontFamily: page.fontTitle }}>{parts[1]}</span>
                    <span className="text-[15px] opacity-75">{parts[2]}</span>
                  </div>
                );
              }
              return <p key={i} className="text-[15px] opacity-75">{line}</p>;
            })}
          </div>
        </ContentSection>
      )}

      {page.locationText && (
        <ContentSection icon={<MapPin size={20} />} title="Como llegar" colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.locationText}</p>
        </ContentSection>
      )}

      {page.transportText && (
        <ContentSection icon={<Bus size={20} />} title="Transporte" colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.transportText}</p>
        </ContentSection>
      )}

      {page.accommodationText && (
        <ContentSection icon={<Hotel size={20} />} title="Alojamiento" colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.accommodationText}</p>
        </ContentSection>
      )}

      {page.dressCode && (
        <ContentSection icon={<Shirt size={20} />} title="Codigo de vestimenta" colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[17px] font-medium opacity-80" style={{ fontFamily: page.fontTitle }}>{page.dressCode}</p>
        </ContentSection>
      )}

      {page.customSections?.map((section, i) =>
        section.title && (
          <ContentSection key={i} title={section.title} colors={colors} fontTitle={page.fontTitle} template={template}>
            <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{section.content}</p>
          </ContentSection>
        )
      )}

      {page.rsvpEnabled && (
        <section className="mt-20 mb-8">
          <div className="rounded-2xl p-8 sm:p-10" style={{ backgroundColor: colors.primary + "10" }}>
            <RsvpForm slug={slug} page={page} colors={colors} />
          </div>
        </section>
      )}

      <footer className="text-center pt-12 pb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-px opacity-20" style={{ backgroundColor: colors.accent }} />
          <Heart size={14} style={{ color: colors.accent }} className="opacity-30" />
          <div className="w-12 h-px opacity-20" style={{ backgroundColor: colors.accent }} />
        </div>
        <p className="text-[11px] opacity-30">
          Hecho con amor y{" "}
          <Link href="/" className="hover:opacity-70 transition-opacity underline">KissthePlan</Link>
        </p>
      </footer>
    </div>
  );
}
