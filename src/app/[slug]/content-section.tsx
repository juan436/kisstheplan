import type { ReactNode } from "react";

interface ContentSectionProps {
  icon?: ReactNode;
  title: string;
  colors: Record<string, string>;
  fontTitle: string;
  template: string;
  children: ReactNode;
}

export function ContentSection({ icon, title, colors, fontTitle, template, children }: ContentSectionProps) {
  return (
    <section className="mt-20 text-center">
      {icon && (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: colors.accent + "12", color: colors.accent }}
        >
          {icon}
        </div>
      )}
      <h2
        className="text-[26px] sm:text-[30px] mb-2"
        style={{
          fontFamily: fontTitle,
          fontStyle: template === "modern" ? "normal" : "italic",
          fontWeight: template === "modern" ? 600 : 400,
        }}
      >
        {title}
      </h2>
      <div className="w-10 h-0.5 mx-auto mt-3 mb-6 rounded-full" style={{ backgroundColor: colors.accent, opacity: 0.3 }} />
      {children}
    </section>
  );
}
