import type { ReactNode } from "react";
import { TEMPLATE_STYLES } from "@/components/views/web/components/template-styles";

interface ContentSectionProps {
  icon?: ReactNode;
  title: string;
  colors: Record<string, string>;
  fontTitle: string;
  template: string;
  sectionIndex?: number;
  children: ReactNode;
}

export function ContentSection({ icon, title, colors, fontTitle, template, sectionIndex = 0, children }: ContentSectionProps) {
  const tpl = TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.elegante;
  const bg  = tpl.sectionBgFull?.(colors.primary, colors.accent, sectionIndex) ?? tpl.sectionBg(colors.primary, sectionIndex);

  return (
    <section style={{ marginTop: "60px", textAlign: tpl.sectionTitleAlign, padding: "48px 0", backgroundColor: bg || "transparent" }}>
      {icon && (
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", backgroundColor: `${colors.accent}14`, color: colors.accent }}>
          {icon}
        </div>
      )}
      {tpl.sectionBadge && (
        <span style={{ display: "block", fontSize: "9px", letterSpacing: "0.35em", opacity: 0.18, marginBottom: "8px", color: colors.text }}>
          {String(sectionIndex + 1).padStart(2, "0")}
        </span>
      )}
      {tpl.sectionAccent?.(colors.accent, colors.primary)}
      <h2 style={{ fontFamily: fontTitle, color: colors.text, fontSize: "clamp(20px, 3vw, 28px)", marginBottom: "6px", ...tpl.h2ExtraStyle }}>
        {title}
      </h2>
      {tpl.divider(colors.accent)}
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}
