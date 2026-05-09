import Link from "next/link";
import { Heart, Clock, MapPin, Bus, Hotel, Shirt, Images } from "lucide-react";
import { getImgUrl } from "@/lib/img-url";
import type { PublicWeddingData } from "@/types";
import { ContentSection } from "./content-section";
import { RsvpForm } from "./rsvp-form";

interface ScheduleEntry { time: string; title: string }

function parseSchedule(text: string): ScheduleEntry[] {
  return text.split("\n")
    .map((line) => { const m = line.match(/^(\d{1,2}[.:]\d{2})\s*[-—–]+\s*(.+)/); return m ? { time: m[1], title: m[2].trim() } : null; })
    .filter((e): e is ScheduleEntry => e !== null);
}

function ScheduleContent({ text, style, colors, fontTitle, fontBody }: { text: string; style: string; colors: Record<string, string>; fontTitle: string; fontBody: string }) {
  const entries = parseSchedule(text);
  if (!entries.length) return <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{text}</p>;

  // Estilo A — timeline vertical con línea izquierda
  if (style === "A") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {entries.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", maxWidth: "400px" }}>
          <div style={{ width: "80px", textAlign: "right", paddingRight: "12px" }}>
            <span style={{ fontSize: "14px", color: colors.accent, fontFamily: fontTitle, fontStyle: "italic" }}>{e.time}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 && <div style={{ width: "1px", height: "18px", backgroundColor: `${colors.accent}40` }} />}
            <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: colors.accent, flexShrink: 0 }} />
            {i < entries.length - 1 && <div style={{ width: "1px", height: "18px", backgroundColor: `${colors.accent}40` }} />}
          </div>
          <div style={{ paddingLeft: "12px", flex: 1 }}>
            <p style={{ fontSize: "15px", color: colors.text, fontFamily: fontBody }}>{e.title}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Estilo B — centrado, hora + evento apilados
  if (style === "B") return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "20px" }}>
      {entries.map((e, i) => (
        <div key={i}>
          <p style={{ fontSize: "12px", fontFamily: fontTitle, fontStyle: "italic", color: colors.accent, marginBottom: "3px" }}>{e.time}</p>
          <p style={{ fontSize: "15px", color: colors.text, fontFamily: fontBody, fontWeight: 500 }}>{e.title}</p>
        </div>
      ))}
    </div>
  );

  // Estilo C — alternado izquierda/derecha con línea central
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: `${colors.accent}40`, transform: "translateX(-50%)" }} />
      {entries.map((e, i) => (
        <div key={i} style={{ display: "flex", marginBottom: "18px", alignItems: "flex-start" }}>
          <div style={{ width: "calc(50% - 18px)", textAlign: i % 2 === 0 ? "right" : "left", padding: "0 14px", order: i % 2 === 0 ? 0 : 2 }}>
            <p style={{ fontSize: "12px", color: colors.accent, fontFamily: fontTitle, fontStyle: "italic" }}>{e.time}</p>
            <p style={{ fontSize: "14px", color: colors.text, fontFamily: fontBody }}>{e.title}</p>
          </div>
          <div style={{ width: "36px", display: "flex", justifyContent: "center", paddingTop: "4px", position: "relative", zIndex: 1, order: 1 }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: colors.accent, border: `2px solid ${colors.bg || "#FAF7F2"}`, flexShrink: 0 }} />
          </div>
          <div style={{ width: "calc(50% - 18px)", order: i % 2 === 0 ? 2 : 0 }} />
        </div>
      ))}
    </div>
  );
}

interface PublicWeddingSectionsProps {
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
  template: string;
  slug: string;
}

function show(page: PublicWeddingData["page"], key: string) {
  return page.visibleSections?.[key] !== false;
}

export function PublicWeddingSections({ page, colors, template, slug }: PublicWeddingSectionsProps) {
  let idx = 0;

  return (
    <div className="max-w-[700px] mx-auto px-6 pb-20">
      {page.storyText && show(page, "story") && (
        <ContentSection sectionIndex={idx++} icon={<Heart size={20} />} title={page.storyTitle || "Nuestra historia"} colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.storyText}</p>
        </ContentSection>
      )}

      {page.scheduleText && show(page, "schedule") && (
        <ContentSection sectionIndex={idx++} icon={<Clock size={20} />} title={page.scheduleTitle || "Horarios del día"} colors={colors} fontTitle={page.fontTitle} template={template}>
          <ScheduleContent text={page.scheduleText} style={page.scheduleStyle || "B"} colors={colors} fontTitle={page.fontTitle} fontBody={page.fontBody} />
        </ContentSection>
      )}

      {page.locationText && show(page, "location") && (
        <ContentSection sectionIndex={idx++} icon={<MapPin size={20} />} title={page.locationTitle || "Cómo llegar"} colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.locationText}</p>
        </ContentSection>
      )}

      {page.transportText && show(page, "transport") && (
        <ContentSection sectionIndex={idx++} icon={<Bus size={20} />} title={page.transportTitle || "Transporte"} colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.transportText}</p>
        </ContentSection>
      )}

      {page.accommodationText && show(page, "accommodation") && (
        <ContentSection sectionIndex={idx++} icon={<Hotel size={20} />} title={page.accommodationTitle || "Alojamiento"} colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[15px] leading-[1.8] whitespace-pre-line opacity-75">{page.accommodationText}</p>
        </ContentSection>
      )}

      {page.dressCode && show(page, "dressCode") && (
        <ContentSection sectionIndex={idx++} icon={<Shirt size={20} />} title={page.dressCodeTitle || "Código de vestimenta"} colors={colors} fontTitle={page.fontTitle} template={template}>
          <p className="text-[17px] font-medium opacity-80" style={{ fontFamily: page.fontTitle }}>{page.dressCode}</p>
        </ContentSection>
      )}

      {(page.galleryImages || []).length > 0 && show(page, "gallery") && (
        <ContentSection sectionIndex={idx++} icon={<Images size={20} />} title="Galería" colors={colors} fontTitle={page.fontTitle} template={template}>
          <div className="grid grid-cols-3 gap-2">
            {(page.galleryImages || []).map((img, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </ContentSection>
      )}

      {page.customSections?.map((section, i) =>
        section.title && (
          <ContentSection key={i} sectionIndex={idx++} title={section.title} colors={colors} fontTitle={page.fontTitle} template={template}>
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
