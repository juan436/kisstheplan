import type { WebPageConfig } from "@/types";
import { getImgUrl } from "@/lib/img-url";
import { TEMPLATE_STYLES } from "../web-template-styles";
import { LivePreviewSections, type Palette } from "./live-preview-sections";

interface LivePreviewProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
  previewMode: "desktop" | "mobile";
  wedding: { partner1Name?: string; partner2Name?: string; date?: string; venue?: string; slug?: string } | null;
}

export function LivePreview({ draft, updateDraft, previewMode, wedding }: LivePreviewProps) {
  const palette = (draft.colorPalette || { primary: "#C4B7A6", accent: "#c7a977", bg: "#FAF7F2", text: "#4A3C32" }) as Palette;
  const fontTitle = draft.fontTitle || "Playfair Display";
  const fontBody = draft.fontBody || "Quicksand";
  const tpl = TEMPLATE_STYLES[draft.templateId || "classic"];
  const mobile = previewMode === "mobile";
  const px = mobile ? "24px" : "48px";
  const py = mobile ? "48px" : "72px";

  const editable = (field: keyof WebPageConfig) => ({
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => { updateDraft({ [field]: e.currentTarget.textContent || "" }); },
    className: "outline-none cursor-text hover:opacity-70 transition-opacity",
  });

  const sectionStyle = (index: number): React.CSSProperties => ({
    padding: `${mobile ? "32px" : "48px"} ${px}`,
    borderTop: `${tpl.borderStyle} ${palette.primary}35`,
    backgroundColor: tpl.sectionBg(palette.primary, index) || undefined,
    textAlign: tpl.sectionTitleAlign,
  });

  const h2Style: React.CSSProperties = {
    fontFamily: fontTitle, color: palette.text,
    fontSize: mobile ? "20px" : "24px",
    fontStyle: tpl.titleItalic ? "italic" : "normal", marginBottom: "4px",
  };

  const pStyle: React.CSSProperties = { color: palette.text, opacity: 0.72, fontSize: "14px", lineHeight: 1.9 };

  const defaultTitle = wedding ? `${wedding.partner1Name || "Nombre"} & ${wedding.partner2Name || "Nombre"}` : "Nombre & Nombre";
  const defaultDate = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "12 de septiembre de 2026";

  const heroImg = draft.heroImage ? getImgUrl(draft.heroImage) : null;

  return (
    <div className="rounded-xl overflow-hidden shadow-elevated" style={{ backgroundColor: palette.bg, color: palette.text, fontFamily: fontBody }}>
      {/* Hero */}
      <div style={{
        padding: `${py} ${px}`,
        backgroundImage: heroImg ? `url(${heroImg})` : tpl.heroGradient(palette.bg, palette.primary),
        backgroundSize: "cover",
        backgroundPosition: "center",
        textAlign: tpl.heroAlign,
        display: "flex", flexDirection: "column",
        alignItems: tpl.heroAlign === "center" ? "center" : "flex-start",
        position: "relative",
      }}>
        {heroImg && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.40)" }} />}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: tpl.heroAlign === "center" ? "center" : "flex-start" }}>
          {tpl.divider(heroImg ? "#fff" : palette.accent)}
          <h1 {...editable("heroTitle")} style={{ fontFamily: fontTitle, color: heroImg ? "#fff" : palette.text, fontSize: mobile ? "34px" : tpl.titleSize, fontStyle: tpl.titleItalic ? "italic" : "normal", lineHeight: 1.15, marginBottom: "16px" }}>
            {draft.heroTitle || defaultTitle}
          </h1>
          {tpl.divider(heroImg ? "#fff" : palette.accent)}
          <p {...editable("heroSubtitle")} style={{ color: heroImg ? "rgba(255,255,255,0.8)" : palette.text, opacity: heroImg ? 1 : 0.65, fontSize: "15px", letterSpacing: "0.06em" }}>
            {draft.heroSubtitle || defaultDate}
          </p>
          {wedding?.venue && <p style={{ color: heroImg ? "rgba(255,255,255,0.6)" : palette.text, opacity: heroImg ? 1 : 0.45, fontSize: "13px", marginTop: "6px" }}>{wedding.venue}</p>}
        </div>
      </div>

      <LivePreviewSections
        palette={palette} tpl={tpl} fontTitle={fontTitle} fontBody={fontBody}
        mobile={mobile} px={px} draft={draft} editable={editable}
        sectionStyle={sectionStyle} h2Style={h2Style} pStyle={pStyle}
      />
    </div>
  );
}
