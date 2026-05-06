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
  const heroImg = draft.heroImage ? getImgUrl(draft.heroImage) : null;
  const isFullbleed = tpl.heroShape === "fullbleed";
  const isArch      = tpl.heroShape === "arch";
  const isBoxed     = tpl.heroShape === "boxed";

  const titleColor = isFullbleed && heroImg ? "#fff" : palette.text;
  const subColor   = isFullbleed && heroImg ? "rgba(255,255,255,0.75)" : `${palette.text}99`;

  return (
    <div style={{
      padding: `${py} ${px}`,
      backgroundImage: isFullbleed && heroImg ? `url(${heroImg})` : (isFullbleed ? tpl.heroGradient(palette.bg, palette.primary) : undefined),
      backgroundColor: !isFullbleed ? palette.bg : undefined,
      backgroundSize: "cover", backgroundPosition: "center",
      textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center",
      minHeight: isFullbleed ? (mobile ? "260px" : "360px") : undefined,
      justifyContent: isFullbleed ? "center" : undefined,
      position: "relative",
    }}>
      {isFullbleed && heroImg && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.42)" }} />}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {/* Imagen en arco o boxed */}
        {!isFullbleed && heroImg && (
          <div style={{
            width: isArch ? (mobile ? "160px" : "220px") : (mobile ? "200px" : "280px"),
            height: isArch ? (mobile ? "200px" : "280px") : undefined,
            borderRadius: isArch ? "50% 50% 0 0 / 35% 35% 0 0" : "12px",
            overflow: "hidden",
            margin: "0 auto 24px",
            boxShadow: isBoxed ? "0 8px 32px rgba(0,0,0,0.12)" : undefined,
            border: isArch ? `1px solid ${palette.primary}40` : undefined,
          }}>
            <img src={heroImg} alt="Portada" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        {/* Decoración floral (solo template floral, sin imagen ocupa el lugar) */}
        {tpl.floralDecor && !heroImg && (
          <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.45, letterSpacing: "12px" }}>🌿 ✿ 🌿</div>
        )}

        {tpl.divider(isFullbleed && heroImg ? "#ffffff99" : palette.accent)}
        <h1 {...editable("heroTitle")} style={{
          fontFamily: fontTitle, color: titleColor,
          fontSize: mobile ? "32px" : tpl.titleSize,
          fontStyle: tpl.titleItalic ? "italic" : "normal",
          lineHeight: 1.15, marginBottom: "14px",
        }}>
          {draft.heroTitle || defaultTitle}
        </h1>
        {tpl.divider(isFullbleed && heroImg ? "#ffffff99" : palette.accent)}
        <p {...editable("heroSubtitle")} style={{ color: subColor, fontSize: "14px", letterSpacing: "0.06em" }}>
          {draft.heroSubtitle || defaultDate}
        </p>

        {tpl.floralDecor && (
          <div style={{ fontSize: "18px", marginTop: "16px", opacity: 0.35, letterSpacing: "8px" }}>❀ ✿ ❀</div>
        )}
      </div>
    </div>
  );
}
