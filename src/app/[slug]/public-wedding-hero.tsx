import { ChevronDown } from "lucide-react";
import { getImgUrl } from "@/lib/img-url";
import type { PublicWeddingData } from "@/types";
import { TEMPLATE_STYLES } from "@/components/views/web/components/template-styles";

function parseHeroPos(pos?: string) {
  const p = (pos || "50% 50%").split(" ");
  return { imgPos: `${p[0] || "50%"} ${p[1] || "50%"}`, imgZoom: parseFloat(p[2] ?? "1") || 1 };
}

interface Props {
  wedding: PublicWeddingData["wedding"];
  page: PublicWeddingData["page"];
  colors: Record<string, string>;
  template: string;
  daysLeft: number;
  formattedDate: string;
  hasContent: boolean;
}

export function PublicWeddingHero({ wedding, page, colors, template, daysLeft, formattedDate, hasContent }: Props) {
  const tpl     = TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.elegante;
  const heroImg = page.heroImage ? getImgUrl(page.heroImage) : null;
  const { imgPos, imgZoom } = parseHeroPos(page.heroImagePosition);
  const imgStyle = { objectFit: "cover" as const, objectPosition: imgPos, transform: `scale(${imgZoom})`, transformOrigin: imgPos };
  const isFullbleed = tpl.heroShape === "fullbleed";
  const isArch      = tpl.heroShape === "arch";
  const isBoxed     = tpl.heroShape === "boxed";
  const titleColor  = isFullbleed && heroImg ? "#fff" : colors.text;
  const subColor    = isFullbleed && heroImg ? "rgba(255,255,255,0.8)" : `${colors.text}aa`;
  const accentLine  = isFullbleed && heroImg ? "#ffffff99" : colors.accent;

  const daysNode = daysLeft > 0 && (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "24px", padding: "10px 24px", borderRadius: "999px", backgroundColor: isFullbleed && heroImg ? "rgba(255,255,255,0.15)" : `${colors.accent}14` }}>
      <span style={{ fontFamily: page.fontTitle, color: isFullbleed && heroImg ? "#fff" : colors.accent, fontSize: "26px", fontWeight: 600 }}>{daysLeft}</span>
      <span style={{ color: subColor, fontSize: "13px" }}>días para el gran día</span>
    </div>
  );

  const titleBlock = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "600px", margin: "0 auto" }}>
      {tpl.divider(accentLine)}
      <h1 style={{ fontFamily: page.fontTitle, color: titleColor, fontSize: "clamp(36px, 7vw, 68px)", fontStyle: tpl.titleItalic ? "italic" : "normal", lineHeight: 1.15, marginBottom: "14px" }}>
        {page.heroTitle || `${wedding.partner1Name} & ${wedding.partner2Name}`}
      </h1>
      {tpl.divider(accentLine)}
      <p style={{ color: subColor, fontSize: "15px", letterSpacing: "0.06em", marginBottom: "6px" }}>{page.heroSubtitle || formattedDate}</p>
      <p style={{ color: subColor, fontSize: "13px", opacity: 0.7 }}>{wedding.venue}{wedding.location ? `, ${wedding.location}` : ""}</p>
      {daysNode}
    </div>
  );

  if (isFullbleed) {
    return (
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 32px", backgroundImage: heroImg ? undefined : tpl.heroGradient(colors.bg, colors.primary), backgroundColor: heroImg ? undefined : colors.bg }}>
        {heroImg && <img src={heroImg} alt="" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", pointerEvents: "none", ...imgStyle }} />}
        {heroImg && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)" }} />}
        <div style={{ position: "relative", zIndex: 1 }}>
          {tpl.heroGlassCard && heroImg
            ? <div style={{ padding: "36px 52px", borderRadius: "16px", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", alignItems: "center" }}>{titleBlock}</div>
            : titleBlock}
        </div>
        {hasContent && <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", opacity: 0.35 }}><ChevronDown size={24} color={heroImg ? "#fff" : colors.accent} /></div>}
      </section>
    );
  }

  const W  = isArch ? "clamp(200px, 24vw, 300px)" : isBoxed ? "clamp(260px, 50vw, 420px)" : undefined;
  const H  = isArch ? "clamp(250px, 30vw, 400px)" : isBoxed ? "clamp(180px, 22vw, 280px)" : undefined;
  const BR = isArch ? ("50% 50% 0 0 / 35% 35% 0 0" as const) : isBoxed ? "16px" : undefined;

  return (
    <section style={{ position: "relative", textAlign: "center", padding: "80px 32px 60px", backgroundImage: tpl.heroGradient(colors.bg, colors.primary), backgroundColor: colors.bg, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {tpl.heroBotanical && (<>
        <div style={{ position: "absolute", top: "16px", left: "24px", fontSize: "28px", opacity: 0.22, transform: "rotate(-25deg)", pointerEvents: "none" }}>✿</div>
        <div style={{ position: "absolute", top: "20px", right: "24px", fontSize: "22px", opacity: 0.18, transform: "rotate(18deg)", pointerEvents: "none" }}>❧</div>
        <div style={{ position: "absolute", bottom: "20px", left: "24px", fontSize: "18px", opacity: 0.16, pointerEvents: "none" }}>✿</div>
        <div style={{ position: "absolute", bottom: "20px", right: "24px", fontSize: "22px", opacity: 0.2, pointerEvents: "none" }}>❧</div>
      </>)}
      {heroImg && (
        <div style={{ margin: "0 auto 36px" }}>
          <div style={{ padding: tpl.heroDoubleBorder && isArch ? "8px" : undefined, border: tpl.heroDoubleBorder && isArch ? `1px solid ${colors.accent}25` : undefined, borderRadius: BR, margin: "0 auto" }}>
            <div style={{ width: W, height: H, borderRadius: BR, overflow: "hidden", boxShadow: isBoxed ? "0 12px 48px rgba(0,0,0,0.12)" : undefined, border: isArch ? `1px solid ${colors.primary}40` : undefined, margin: "0 auto" }}>
              <img src={heroImg} alt="Portada" style={{ width: "100%", height: "100%", ...imgStyle }} />
            </div>
          </div>
        </div>
      )}
      {tpl.floralDecor && !heroImg && <div style={{ fontSize: "28px", marginBottom: "12px", opacity: 0.4, letterSpacing: "12px" }}>🌿 ✿ 🌿</div>}
      {titleBlock}
      {tpl.heroFade && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "90px", background: `linear-gradient(to bottom, transparent, ${colors.bg})`, pointerEvents: "none" }} />}
      {hasContent && !tpl.heroFade && <div style={{ marginTop: "36px", opacity: 0.3 }}><ChevronDown size={24} color={colors.accent} /></div>}
    </section>
  );
}
