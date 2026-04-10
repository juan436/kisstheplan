export type TemplateStyle = {
  heroAlign: "center" | "left";
  heroGradient: (bg: string, primary: string) => string;
  titleItalic: boolean;
  titleSize: string;
  sectionTitleAlign: "center" | "left";
  divider: (accent: string) => React.ReactNode;
  sectionBg: (primary: string, index: number) => string | undefined;
  borderStyle: string;
  sectionRadius: string;
  buttonRadius: string;
};

export const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  classic: {
    heroAlign: "center",
    heroGradient: (bg, primary) => `linear-gradient(180deg, ${primary}22 0%, ${bg} 60%)`,
    titleItalic: true, titleSize: "52px", sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}50` }} />
        <span style={{ color: accent, fontSize: "18px" }}>✦</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}50` }} />
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}18` : undefined,
    borderStyle: "1px solid", sectionRadius: "0", buttonRadius: "999px",
  },
  modern: {
    heroAlign: "left",
    heroGradient: (bg, primary) => `linear-gradient(135deg, ${bg} 0%, ${primary}15 100%)`,
    titleItalic: false, titleSize: "48px", sectionTitleAlign: "left",
    divider: (accent) => (
      <div style={{ width: "40px", height: "3px", backgroundColor: accent, marginBottom: "16px", borderRadius: "2px" }} />
    ),
    sectionBg: () => undefined, borderStyle: "1px solid", sectionRadius: "0", buttonRadius: "6px",
  },
  romantic: {
    heroAlign: "center",
    heroGradient: (bg, primary) => `radial-gradient(ellipse at top, ${primary}40 0%, ${bg} 65%)`,
    titleItalic: true, titleSize: "54px", sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ textAlign: "center", fontSize: "22px", color: accent, marginBottom: "12px", letterSpacing: "8px" }}>
        ❧ ❧ ❧
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}20` : undefined,
    borderStyle: "1px dashed", sectionRadius: "0", buttonRadius: "999px",
  },
  rustic: {
    heroAlign: "left",
    heroGradient: (_bg, primary) => `linear-gradient(160deg, ${primary}55 0%, ${primary}22 100%)`,
    titleItalic: false, titleSize: "44px", sectionTitleAlign: "left",
    divider: (accent) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <span style={{ color: accent, fontSize: "16px" }}>◆</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}60`, backgroundImage: `repeating-linear-gradient(90deg, ${accent}60 0px, ${accent}60 4px, transparent 4px, transparent 8px)` }} />
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}25` : `${primary}08`,
    borderStyle: "2px solid", sectionRadius: "0", buttonRadius: "4px",
  },
};
