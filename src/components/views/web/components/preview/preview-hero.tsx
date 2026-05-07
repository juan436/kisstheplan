import type { WebPageConfig } from "@/types";
import type { TemplateStyle } from "../template-styles";
import type { Palette } from "./live-preview-sections";
import { getImgUrl } from "@/lib/img-url";

interface PreviewHeroProps {
  draft: Partial<WebPageConfig>;
  tpl: TemplateStyle;
  palette: Palette;
  fontTitle: string;
  mobile: boolean;
  px: string;
  py: string;
  editable: (field: keyof WebPageConfig) => object;
  defaultTitle: string;
  defaultDate: string;
}

export function PreviewHero({ draft, tpl, palette, fontTitle, mobile, px, py, editable, defaultTitle, defaultDate }: PreviewHeroProps) {
  const heroImg     = draft.heroImage ? getImgUrl(draft.heroImage) : null;
  const isFullbleed = tpl.heroShape === "fullbleed";
  const isArch      = tpl.heroShape === "arch";
  const isBoxed     = tpl.heroShape === "boxed";
  const titleColor  = isFullbleed && heroImg ? "#fff" : palette.text;
  const subColor    = isFullbleed && heroImg ? "rgba(255,255,255,0.75)" : `${palette.text}99`;
  const accentLine  = isFullbleed && heroImg ? "#ffffff99" : palette.accent;

  const rawPos  = draft.heroImagePosition || "50% 50%";
  const posParts = rawPos.split(" ");
  const imgPos  = `${posParts[0] || "50%"} ${posParts[1] || "50%"}`;
  const imgZoom = parseFloat(posParts[2] ?? "1") || 1;
  const imgStyle = { objectFit: "cover" as const, objectPosition: imgPos, transform: `scale(${imgZoom})`, transformOrigin: imgPos };

  return (
    <div style={{
      padding: `${py} ${px}`,
      backgroundImage: isFullbleed && !heroImg ? tpl.heroGradient(palette.bg, palette.primary) : undefined,
      backgroundColor: !isFullbleed ? palette.bg : undefined,
      textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: isFullbleed ? (mobile ? "260px" : "360px") : undefined,
      justifyContent: isFullbleed ? "center" : undefined, position: "relative",
    }}>
      {isFullbleed && heroImg && (
        <img src={heroImg} alt="" draggable={false}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", pointerEvents: "none", ...imgStyle }} />
      )}
      {isFullbleed && heroImg && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.42)" }} />}

      {tpl.heroBotanical && (<>
        <div style={{ position: "absolute", top: "14px", left: "16px", fontSize: "20px", opacity: 0.28, transform: "rotate(-25deg)", pointerEvents: "none" }}>✿</div>
        <div style={{ position: "absolute", top: "18px", right: "16px", fontSize: "15px", opacity: 0.22, transform: "rotate(18deg)", pointerEvents: "none" }}>❧</div>
        <div style={{ position: "absolute", bottom: "14px", left: "18px", fontSize: "13px", opacity: 0.18, pointerEvents: "none" }}>✿</div>
        <div style={{ position: "absolute", bottom: "16px", right: "16px", fontSize: "17px", opacity: 0.25, pointerEvents: "none" }}>❧</div>
      </>)}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {!isFullbleed && heroImg && (
          <div style={{ padding: tpl.heroDoubleBorder && isArch ? "6px" : undefined, border: tpl.heroDoubleBorder && isArch ? `1px solid ${palette.accent}25` : undefined, borderRadius: isArch ? "50% 50% 0 0 / 35% 35% 0 0" : undefined, margin: "0 auto 24px" }}>
            <div style={{ width: isArch ? (mobile ? "160px" : "220px") : (mobile ? "200px" : "280px"), height: isArch ? (mobile ? "200px" : "280px") : undefined, borderRadius: isArch ? "50% 50% 0 0 / 35% 35% 0 0" : "12px", overflow: "hidden", boxShadow: isBoxed ? "0 8px 32px rgba(0,0,0,0.12)" : undefined, border: isArch ? `1px solid ${palette.primary}40` : undefined }}>
              <img src={heroImg} alt="Portada" style={{ width: "100%", height: "100%", ...imgStyle }} />
            </div>
          </div>
        )}
        {tpl.floralDecor && !heroImg && (
          <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.45, letterSpacing: "12px" }}>🌿 ✿ 🌿</div>
        )}

        <div style={tpl.heroGlassCard && isFullbleed && heroImg ? { padding: "28px 36px", borderRadius: "12px", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", alignItems: "center" } : undefined}>
          {tpl.divider(accentLine)}
          <h1 {...editable("heroTitle")} style={{
            fontFamily: fontTitle, color: titleColor,
            fontSize: mobile ? "32px" : tpl.titleSize,
            fontStyle: tpl.titleItalic ? "italic" : "normal",
            lineHeight: 1.15, marginBottom: "14px",
          }}>
            {draft.heroTitle || defaultTitle}
          </h1>
          {tpl.divider(accentLine)}
          <p {...editable("heroSubtitle")} style={{ color: subColor, fontSize: "14px", letterSpacing: "0.06em" }}>
            {draft.heroSubtitle || defaultDate}
          </p>
          {tpl.floralDecor && (
            <div style={{ fontSize: "18px", marginTop: "16px", opacity: 0.35, letterSpacing: "8px" }}>❀ ✿ ❀</div>
          )}
        </div>
      </div>

      {tpl.heroFade && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70px", background: `linear-gradient(to bottom, transparent, ${palette.bg})`, pointerEvents: "none", zIndex: 2 }} />
      )}
    </div>
  );
}
