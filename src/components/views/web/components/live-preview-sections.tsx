import type { WebPageConfig } from "@/types";
import type { TemplateStyle } from "./web-template-styles";
import { getImgUrl } from "@/lib/img-url";

export type Palette = { primary: string; accent: string; bg: string; text: string };

export interface PreviewConfig {
  palette: Palette;
  tpl: TemplateStyle;
  fontTitle: string;
  fontBody: string;
  mobile: boolean;
  px: string;
  draft: Partial<WebPageConfig>;
  editable: (field: keyof WebPageConfig) => object;
  sectionStyle: (i: number) => React.CSSProperties;
  h2Style: React.CSSProperties;
  pStyle: React.CSSProperties;
}

function show(draft: Partial<WebPageConfig>, key: string) {
  return draft.visibleSections?.[key] !== false;
}

export function LivePreviewSections({ palette, tpl, fontTitle, fontBody, mobile, px, draft, editable, sectionStyle, h2Style, pStyle }: PreviewConfig) {
  return (
    <>
      {show(draft, "story") && (
        <div style={sectionStyle(0)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{draft.storyTitle || "Nuestra historia"}</h2>
          <p {...editable("storyText")} style={{ ...pStyle, marginTop: "12px" }}>
            {draft.storyText || <em style={{ opacity: 0.4 }}>Cuéntales cómo os conocisteis... (haz clic para editar)</em>}
          </p>
        </div>
      )}

      {show(draft, "schedule") && (
        <div style={sectionStyle(1)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{draft.scheduleTitle || "Horarios del día"}</h2>
          <pre {...editable("scheduleText")} style={{ ...pStyle, marginTop: "12px", fontFamily: fontBody, whiteSpace: "pre-wrap" }}>
            {draft.scheduleText || "17:00 — Ceremonia\n18:00 — Cóctel\n20:00 — Cena"}
          </pre>
        </div>
      )}

      {show(draft, "location") && (
        <div style={sectionStyle(2)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{draft.locationTitle || "Cómo llegar"}</h2>
          <p {...editable("locationText")} style={{ ...pStyle, marginTop: "12px" }}>
            {draft.locationText || <em style={{ opacity: 0.4 }}>Escribe la dirección y cómo llegar...</em>}
          </p>
        </div>
      )}

      {show(draft, "transport") && (
        <div style={sectionStyle(3)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{draft.transportTitle || "Transporte"}</h2>
          <p {...editable("transportText")} style={{ ...pStyle, marginTop: "12px" }}>
            {draft.transportText || <em style={{ opacity: 0.4 }}>Información sobre el transporte...</em>}
          </p>
          {(draft.transportOptions || []).length > 0 && (
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", alignItems: tpl.heroAlign === "center" ? "center" : "flex-start" }}>
              {(draft.transportOptions || []).map((opt, i) => (
                <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: tpl.buttonRadius, backgroundColor: `${palette.accent}22`, color: palette.text, fontSize: "13px" }}>
                  <span style={{ color: palette.accent }}>◎</span>{opt}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {show(draft, "accommodation") && (
        <div style={sectionStyle(4)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{draft.accommodationTitle || "Alojamiento recomendado"}</h2>
          <p {...editable("accommodationText")} style={{ ...pStyle, marginTop: "12px" }}>
            {draft.accommodationText || <em style={{ opacity: 0.4 }}>Hoteles y opciones cercanas...</em>}
          </p>
        </div>
      )}

      {show(draft, "dressCode") && (
        <div style={{ marginTop: "8px", marginBottom: "8px", marginLeft: px, marginRight: px, padding: "20px 24px", borderRadius: "12px", backgroundColor: `${palette.accent}18`, border: `1px solid ${palette.accent}35`, textAlign: "center" }}>
          <p style={{ color: palette.accent, fontSize: "10px", letterSpacing: "0.18em", fontWeight: 700, marginBottom: "6px" }}>
            {(draft.dressCodeTitle || "CÓDIGO DE VESTIMENTA").toUpperCase()}
          </p>
          <p {...editable("dressCode")} style={{ fontFamily: fontTitle, color: palette.text, fontSize: "17px", fontStyle: tpl.titleItalic ? "italic" : "normal" }}>
            {draft.dressCode || <em style={{ opacity: 0.4 }}>Ej: Elegante, semiformal...</em>}
          </p>
        </div>
      )}

      {show(draft, "gallery") && (draft.galleryImages || []).length > 0 && (
        <div style={sectionStyle(5)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>Galería</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "12px" }}>
            {(draft.galleryImages || []).slice(0, 6).map((img, i) => (
              <div key={i} style={{ aspectRatio: "1", borderRadius: "8px", overflow: "hidden" }}>
                <img src={getImgUrl(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {(draft.customSections || []).map((section, i) => (
        <div key={i} style={sectionStyle(6 + i)}>
          {tpl.divider(palette.accent)}
          <h2 style={h2Style}>{section.title || "Sección personalizada"}</h2>
          <p style={{ ...pStyle, marginTop: "12px" }}>{section.content}</p>
        </div>
      ))}

      {draft.rsvpEnabled !== false && (
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
      )}

      <div style={{ padding: "20px", textAlign: "center", borderTop: `1px solid ${palette.primary}30` }}>
        <p style={{ color: palette.text, opacity: 0.35, fontSize: "11px" }}>Con amor • KissthePlan</p>
      </div>
    </>
  );
}
