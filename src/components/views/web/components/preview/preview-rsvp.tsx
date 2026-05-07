import type { WebPageConfig } from "@/types";
import type { TemplateStyle } from "../template-styles";
import type { Palette } from "./live-preview-sections";

interface PreviewRsvpProps {
  draft: Partial<WebPageConfig>;
  tpl: TemplateStyle;
  palette: Palette;
  fontTitle: string;
  mobile: boolean;
  px: string;
}

export function PreviewRsvp({ draft, tpl, palette, fontTitle, mobile, px }: PreviewRsvpProps) {
  if (draft.rsvpEnabled === false) return null;
  return (
    <div style={{ padding: `${mobile ? "40px" : "56px"} ${px}`, textAlign: "center", borderTop: `${tpl.borderStyle} ${palette.primary}35`, backgroundColor: `${palette.primary}28` }}>
      <h2 style={{ fontFamily: fontTitle, color: palette.text, fontSize: mobile ? "26px" : "32px", fontStyle: tpl.titleItalic ? "italic" : "normal", marginBottom: "8px" }}>¿Vendrás?</h2>
      {draft.rsvpDeadline && (
        <p style={{ color: palette.text, opacity: 0.55, fontSize: "13px", marginBottom: "24px" }}>
          Confirma antes del {new Date(draft.rsvpDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button style={{ padding: "12px 28px", borderRadius: tpl.buttonRadius, backgroundColor: palette.accent, color: "#fff", fontSize: "14px", fontWeight: 600, border: "none", cursor: "default" }}>Confirmar asistencia</button>
        <button style={{ padding: "12px 28px", borderRadius: tpl.buttonRadius, backgroundColor: "transparent", color: palette.text, fontSize: "14px", fontWeight: 500, border: `1px solid ${palette.primary}80`, cursor: "default" }}>No podré ir</button>
      </div>
    </div>
  );
}
