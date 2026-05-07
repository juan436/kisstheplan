"use client";

import { useEffect } from "react";
import type { WebPageConfig } from "@/types";
import { TEMPLATE_STYLES } from "../template-styles";
import { LivePreviewSections, type Palette } from "./live-preview-sections";
import { PreviewHero } from "./preview-hero";
import { ALL_FONTS_URL } from "../../constants/web.constants";

interface LivePreviewProps {
  draft: Partial<WebPageConfig>;
  updateDraft: (u: Partial<WebPageConfig>) => void;
  previewMode: "desktop" | "mobile";
  wedding: { partner1Name?: string; partner2Name?: string; date?: string; venue?: string; slug?: string } | null;
}

export function LivePreview({ draft, updateDraft, previewMode, wedding }: LivePreviewProps) {
  const palette = (draft.colorPalette || { primary: "#C4B7A6", accent: "#c7a977", bg: "#FAF7F2", text: "#4A3C32" }) as Palette;
  const fontTitle = draft.fontTitle || "Playfair Display";
  const fontBody  = draft.fontBody  || "Quicksand";
  const tpl    = TEMPLATE_STYLES[draft.templateId || "elegante"] ?? TEMPLATE_STYLES.elegante;
  const mobile = previewMode === "mobile";
  const px     = mobile ? "24px" : "48px";

  const heroPadScale    = tpl.heroPadScale    ?? 1;
  const sectionPadScale = tpl.sectionPadScale ?? 1;
  const py = `${Math.round((mobile ? 48 : 72) * heroPadScale)}px`;
  const sectionPY = `${Math.round((mobile ? 32 : 48) * sectionPadScale)}px`;

  useEffect(() => {
    if (!ALL_FONTS_URL) return;
    const id = "ktp-preview-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet"; link.href = ALL_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  const editable = (field: keyof WebPageConfig) => ({
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => { updateDraft({ [field]: e.currentTarget.textContent || "" }); },
    className: "outline-none cursor-text hover:opacity-70 transition-opacity",
  });

  const sectionStyle = (index: number): React.CSSProperties => {
    const fullBg = tpl.sectionBgFull?.(palette.primary, palette.accent, index);
    const simpleBg = tpl.sectionBg(palette.primary, index);
    return {
      padding: `${sectionPY} ${px}`,
      borderTop: tpl.borderStyle !== "none" ? `${tpl.borderStyle} ${palette.primary}35` : undefined,
      ...(fullBg ? { background: fullBg } : simpleBg ? { backgroundColor: simpleBg } : {}),
      textAlign: tpl.sectionTitleAlign,
    };
  };

  const h2Style: React.CSSProperties = {
    fontFamily: fontTitle, color: palette.text,
    fontSize: mobile ? "20px" : "24px",
    fontStyle: tpl.titleItalic ? "italic" : "normal", marginBottom: "6px",
    ...tpl.h2ExtraStyle,
  };
  const pStyle: React.CSSProperties = { color: palette.text, opacity: 0.72, fontSize: "14px", lineHeight: 1.9 };

  const defaultTitle = wedding
    ? `${wedding.partner1Name || "Nombre"} & ${wedding.partner2Name || "Nombre"}`
    : "Nombre & Nombre";
  const defaultDate  = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "12 de septiembre de 2026";

  return (
    <div className="rounded-xl overflow-hidden shadow-elevated" style={{ backgroundColor: palette.bg, color: palette.text, fontFamily: fontBody }}>
      <PreviewHero
        draft={draft} tpl={tpl} palette={palette} fontTitle={fontTitle}
        mobile={mobile} px={px} py={py} editable={editable}
        defaultTitle={defaultTitle} defaultDate={defaultDate}
      />
      <LivePreviewSections
        palette={palette} tpl={tpl} fontTitle={fontTitle} fontBody={fontBody}
        mobile={mobile} px={px} draft={draft} editable={editable}
        sectionStyle={sectionStyle} h2Style={h2Style} pStyle={pStyle}
      />
    </div>
  );
}
