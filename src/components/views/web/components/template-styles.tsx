export type HeroShape = "arch" | "fullbleed" | "boxed" | "default";

export type TemplateStyle = {
  heroAlign: "center" | "left";
  heroShape: HeroShape;
  heroGradient: (bg: string, primary: string) => string;
  titleItalic: boolean;
  titleSize: string;
  heroPadScale: number;
  sectionPadScale: number;
  sectionTitleAlign: "center" | "left";
  divider: (accent: string) => React.ReactNode;
  sectionBg: (primary: string, index: number) => string | undefined;
  sectionBgFull?: (primary: string, accent: string, index: number) => string;
  borderStyle: string;
  sectionRadius: string;
  buttonRadius: string;
  floralDecor: boolean;
  sectionBadge?: boolean;
  sectionAccent?: (accent: string, primary: string) => React.ReactNode;
  h2ExtraStyle?: React.CSSProperties;
  heroFade?: boolean;
  heroBotanical?: boolean;
  heroGlassCard?: boolean;
  heroDoubleBorder?: boolean;
};

export const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  elegante: {
    heroAlign: "center", heroShape: "arch",
    heroGradient: (bg, primary) => `linear-gradient(180deg, ${primary}20 0%, ${bg} 70%)`,
    titleItalic: true, titleSize: "52px",
    heroPadScale: 1.35, sectionPadScale: 1.3,
    sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px", justifyContent: "center" }}>
        <div style={{ width: "56px", height: "1px", background: `linear-gradient(to right, transparent, ${accent}90)` }} />
        <span style={{ color: accent, fontSize: "13px", letterSpacing: "10px", lineHeight: 1 }}>◇ ✦ ◇</span>
        <div style={{ width: "56px", height: "1px", background: `linear-gradient(to left, transparent, ${accent}90)` }} />
      </div>
    ),
    sectionBg: () => undefined, borderStyle: "1px solid",
    sectionRadius: "0", buttonRadius: "999px", floralDecor: false,
    heroFade: true, heroDoubleBorder: true,
    h2ExtraStyle: { letterSpacing: "0.04em" },
    sectionAccent: (accent) => (
      <p style={{ color: accent, fontSize: "8px", letterSpacing: "10px", opacity: 0.45, marginBottom: "14px", textAlign: "center" }}>· · ·</p>
    ),
  },

  inmersivo: {
    heroAlign: "center", heroShape: "fullbleed",
    heroGradient: (bg, primary) => `linear-gradient(160deg, ${primary}55 0%, ${bg} 100%)`,
    titleItalic: false, titleSize: "54px",
    heroPadScale: 1.2, sectionPadScale: 1.1,
    sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ margin: "0 auto 22px", width: "80px", height: "2px", background: `linear-gradient(to right, transparent, ${accent}, transparent)`, borderRadius: "2px" }} />
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}18` : undefined,
    borderStyle: "none", sectionRadius: "0", buttonRadius: "8px", floralDecor: false,
    heroGlassCard: true, sectionBadge: true,
    h2ExtraStyle: { letterSpacing: "0.08em", textTransform: "uppercase" as const },
  },

  minimalista: {
    heroAlign: "center", heroShape: "boxed",
    heroGradient: (_bg, primary) => `linear-gradient(180deg, ${primary}10 0%, #fff 100%)`,
    titleItalic: false, titleSize: "44px",
    heroPadScale: 1.25, sectionPadScale: 1.2,
    sectionTitleAlign: "center",
    divider: (_accent) => <div style={{ marginBottom: "22px" }} />,
    sectionBg: () => undefined, borderStyle: "none",
    sectionRadius: "0", buttonRadius: "6px", floralDecor: false,
    sectionBadge: true,
    h2ExtraStyle: { letterSpacing: "0.15em", textTransform: "uppercase" as const, fontStyle: "normal" as const },
    sectionAccent: (_accent, primary) => (
      <div style={{ width: "36px", height: "1px", backgroundColor: `${primary}40`, margin: "0 auto 14px" }} />
    ),
  },

  floral: {
    heroAlign: "center", heroShape: "arch",
    heroGradient: (bg, primary) => `radial-gradient(ellipse at top, ${primary}35 0%, ${bg} 65%)`,
    titleItalic: true, titleSize: "52px",
    heroPadScale: 1.35, sectionPadScale: 1.3,
    sectionTitleAlign: "center",
    divider: (accent) => (
      <div style={{ textAlign: "center", marginBottom: "20px", lineHeight: 1 }}>
        <span style={{ color: accent, fontSize: "11px", letterSpacing: "5px", opacity: 0.6 }}>❧</span>
        <span style={{ color: accent, fontSize: "22px", margin: "0 10px", opacity: 0.85 }}>✿</span>
        <span style={{ color: accent, fontSize: "11px", letterSpacing: "5px", opacity: 0.6 }}>❧</span>
      </div>
    ),
    sectionBg: (primary, i) => i % 2 !== 0 ? `${primary}18` : undefined,
    sectionBgFull: (primary, accent, i) =>
      i % 2 !== 0
        ? `radial-gradient(circle at 92% 8%, ${accent}18 0%, transparent 45%), ${primary}18`
        : `radial-gradient(circle at 8% 92%, ${accent}12 0%, transparent 40%)`,
    borderStyle: "1px dashed", sectionRadius: "0", buttonRadius: "999px", floralDecor: true,
    heroBotanical: true,
    sectionAccent: (accent) => (
      <div style={{ textAlign: "center", fontSize: "11px", opacity: 0.5, color: accent, marginBottom: "12px", letterSpacing: "6px" }}>✿ · ✿</div>
    ),
  },

  // Aliases retrocompatibilidad
  classic:  { heroAlign: "center", heroShape: "default", heroGradient: (bg, p) => `linear-gradient(180deg, ${p}22 0%, ${bg} 60%)`, titleItalic: true, titleSize: "52px", heroPadScale: 1, sectionPadScale: 1, sectionTitleAlign: "center", divider: (a) => <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}><div style={{ flex: 1, height: "1px", backgroundColor: `${a}50` }} /><span style={{ color: a, fontSize: "18px" }}>✦</span><div style={{ flex: 1, height: "1px", backgroundColor: `${a}50` }} /></div>, sectionBg: (p, i) => i % 2 !== 0 ? `${p}18` : undefined, borderStyle: "1px solid", sectionRadius: "0", buttonRadius: "999px", floralDecor: false },
  modern:   { heroAlign: "left",   heroShape: "default", heroGradient: (bg, p) => `linear-gradient(135deg, ${bg} 0%, ${p}15 100%)`, titleItalic: false, titleSize: "48px", heroPadScale: 1, sectionPadScale: 1, sectionTitleAlign: "left", divider: (a) => <div style={{ width: "40px", height: "3px", backgroundColor: a, marginBottom: "16px", borderRadius: "2px" }} />, sectionBg: () => undefined, borderStyle: "1px solid", sectionRadius: "0", buttonRadius: "6px", floralDecor: false },
  romantic: { heroAlign: "center", heroShape: "default", heroGradient: (bg, p) => `radial-gradient(ellipse at top, ${p}40 0%, ${bg} 65%)`, titleItalic: true, titleSize: "54px", heroPadScale: 1, sectionPadScale: 1, sectionTitleAlign: "center", divider: (a) => <div style={{ textAlign: "center", fontSize: "22px", color: a, marginBottom: "12px", letterSpacing: "8px" }}>❧ ❧ ❧</div>, sectionBg: (p, i) => i % 2 !== 0 ? `${p}20` : undefined, borderStyle: "1px dashed", sectionRadius: "0", buttonRadius: "999px", floralDecor: false },
  rustic:   { heroAlign: "left",   heroShape: "default", heroGradient: (_bg, p) => `linear-gradient(160deg, ${p}55 0%, ${p}22 100%)`, titleItalic: false, titleSize: "44px", heroPadScale: 1, sectionPadScale: 1, sectionTitleAlign: "left", divider: (a) => <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}><span style={{ color: a, fontSize: "16px" }}>◆</span><div style={{ flex: 1, height: "1px", backgroundColor: `${a}60` }} /></div>, sectionBg: (p, i) => i % 2 !== 0 ? `${p}25` : `${p}08`, borderStyle: "2px solid", sectionRadius: "0", buttonRadius: "4px", floralDecor: false },
};
