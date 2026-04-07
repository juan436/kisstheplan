import { Heart, Calendar, MapPin, ChevronDown } from "lucide-react";
import { getImgUrl } from "@/lib/img-url";
import type { PublicWeddingData } from "@/types";

interface PublicWeddingHeroProps {
  wedding: PublicWeddingData["wedding"];
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
  template: string;
  daysLeft: number;
  formattedDate: string;
  hasContent: boolean;
}

export function PublicWeddingHero({ wedding, page, colors, template, daysLeft, formattedDate, hasContent }: PublicWeddingHeroProps) {
  const heroImg = page.heroImage ? getImgUrl(page.heroImage) : null;
  const textColor = heroImg ? "#fff" : colors.text;
  const subOpacity = heroImg ? "rgba(255,255,255,0.75)" : undefined;

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6"
      style={{
        backgroundImage: heroImg
          ? `url(${heroImg})`
          : template === "modern"
            ? `linear-gradient(180deg, ${colors.bg} 0%, ${colors.primary}15 100%)`
            : template === "romantic"
              ? `radial-gradient(ellipse at center, ${colors.accent}08 0%, ${colors.bg} 70%)`
              : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {heroImg && <div className="absolute inset-0 bg-black/45" />}

      {/* Decorative elements (sin imagen) */}
      {!heroImg && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {template === "classic" && (
            <>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-0.5 opacity-20" style={{ backgroundColor: colors.accent }} />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-0.5 opacity-20" style={{ backgroundColor: colors.accent }} />
            </>
          )}
          {template === "romantic" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ backgroundColor: colors.accent }} />
          )}
        </div>
      )}

      <div className="relative z-10">
        <Heart size={28} style={{ color: heroImg ? "rgba(255,255,255,0.7)" : colors.accent }} className="mx-auto mb-6 opacity-60" />

        <h1 className="text-[42px] sm:text-[56px] md:text-[72px] leading-tight mb-2"
          style={{ fontFamily: page.fontTitle, color: textColor, fontStyle: template === "modern" ? "normal" : "italic", fontWeight: template === "modern" ? 600 : 400, letterSpacing: template === "modern" ? "-0.02em" : undefined }}>
          {page.heroTitle || `${wedding.partner1Name} & ${wedding.partner2Name}`}
        </h1>

        {page.heroSubtitle && (
          <p className="text-[16px] sm:text-[18px] mb-6 tracking-wide" style={{ color: subOpacity || textColor, opacity: subOpacity ? 1 : 0.6 }}>{page.heroSubtitle}</p>
        )}

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="w-16 h-px opacity-30" style={{ backgroundColor: heroImg ? "#fff" : colors.accent }} />
          <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: heroImg ? "#fff" : colors.accent }} />
          <div className="w-16 h-px opacity-30" style={{ backgroundColor: heroImg ? "#fff" : colors.accent }} />
        </div>

        <div className="space-y-3">
          <p className="flex items-center justify-center gap-2 text-[15px]" style={{ color: subOpacity || textColor, opacity: subOpacity ? 1 : 0.7 }}>
            <Calendar size={16} style={{ color: heroImg ? "rgba(255,255,255,0.8)" : colors.accent }} />
            <span className="capitalize">{formattedDate}</span>
          </p>
          <p className="flex items-center justify-center gap-2 text-[15px]" style={{ color: subOpacity || textColor, opacity: subOpacity ? 1 : 0.7 }}>
            <MapPin size={16} style={{ color: heroImg ? "rgba(255,255,255,0.8)" : colors.accent }} />
            {wedding.venue}{wedding.location ? `, ${wedding.location}` : ""}
          </p>
        </div>

        {daysLeft > 0 && (
          <div className="mt-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full" style={{ backgroundColor: heroImg ? "rgba(255,255,255,0.15)" : colors.accent + "12" }}>
              <span className="text-[28px] font-semibold" style={{ fontFamily: page.fontTitle, color: heroImg ? "#fff" : colors.accent }}>{daysLeft}</span>
              <span className="text-[13px]" style={{ color: subOpacity || textColor, opacity: subOpacity ? 1 : 0.6 }}>{daysLeft === 1 ? "dia" : "dias"} para el gran dia</span>
            </div>
          </div>
        )}
      </div>

      {hasContent && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown size={24} style={{ color: heroImg ? "#fff" : colors.accent }} />
        </div>
      )}
    </section>
  );
}
