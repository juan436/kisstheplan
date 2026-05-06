import type { WebPageConfig } from "@/types";
import type { Palette } from "./live-preview-sections";

interface Entry { time: string; title: string }

function parseSchedule(text: string): Entry[] {
  return text.split("\n")
    .map((line) => {
      const m = line.match(/^(\d{1,2}:\d{2})\s*[—\-–]+\s*(.+)/);
      return m ? { time: m[1], title: m[2].trim() } : null;
    })
    .filter((e): e is Entry => e !== null);
}

interface ScheduleSectionProps {
  draft: Partial<WebPageConfig>;
  palette: Palette;
  fontTitle: string;
  fontBody: string;
  editable: (field: keyof WebPageConfig) => object;
}

function StyleA({ entries, palette, fontTitle, fontBody }: { entries: Entry[]; palette: Palette; fontTitle: string; fontBody: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
      {entries.map((e, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0", width: "100%", maxWidth: "360px" }}>
          <div style={{ width: "80px", textAlign: "right", paddingRight: "12px" }}>
            <span style={{ fontSize: "12px", color: palette.accent, fontFamily: fontTitle, fontStyle: "italic" }}>{e.time}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {i > 0 && <div style={{ width: "1px", height: "16px", backgroundColor: `${palette.accent}40` }} />}
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: palette.accent, flexShrink: 0 }} />
            {i < entries.length - 1 && <div style={{ width: "1px", height: "16px", backgroundColor: `${palette.accent}40` }} />}
          </div>
          <div style={{ paddingLeft: "12px", flex: 1 }}>
            <p style={{ fontSize: "13px", color: palette.text, fontFamily: fontBody }}>{e.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StyleB({ entries, palette, fontTitle, fontBody }: { entries: Entry[]; palette: Palette; fontTitle: string; fontBody: string }) {
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "18px" }}>
      {entries.map((e, i) => (
        <div key={i}>
          <p style={{ fontSize: "11px", fontFamily: fontTitle, fontStyle: "italic", color: palette.accent, marginBottom: "2px" }}>{e.time}</p>
          <p style={{ fontSize: "14px", color: palette.text, fontFamily: fontBody, fontWeight: 500 }}>{e.title}</p>
        </div>
      ))}
    </div>
  );
}

function StyleC({ entries, palette, fontTitle, fontBody }: { entries: Entry[]; palette: Palette; fontTitle: string; fontBody: string }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", backgroundColor: `${palette.accent}40`, transform: "translateX(-50%)" }} />
      {entries.map((e, i) => (
        <div key={i} style={{ display: "flex", marginBottom: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "calc(50% - 16px)", textAlign: i % 2 === 0 ? "right" : "left", padding: "0 12px", order: i % 2 === 0 ? 0 : 2 }}>
            <p style={{ fontSize: "11px", color: palette.accent, fontFamily: fontTitle, fontStyle: "italic" }}>{e.time}</p>
            <p style={{ fontSize: "13px", color: palette.text, fontFamily: fontBody }}>{e.title}</p>
          </div>
          <div style={{ width: "32px", display: "flex", justifyContent: "center", paddingTop: "4px", position: "relative", zIndex: 1, order: 1 }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: palette.accent, border: `2px solid ${palette.bg}`, flexShrink: 0 }} />
          </div>
          <div style={{ width: "calc(50% - 16px)", order: i % 2 === 0 ? 2 : 0 }} />
        </div>
      ))}
    </div>
  );
}

export function ScheduleSection({ draft, palette, fontTitle, fontBody, editable }: ScheduleSectionProps) {
  const text    = draft.scheduleText || "17:00 — Ceremonia\n18:00 — Cóctel\n20:00 — Cena";
  const style   = draft.scheduleStyle || "B";
  const entries = parseSchedule(text);

  if (!entries.length) {
    return (
      <pre {...editable("scheduleText")} style={{ fontSize: "13px", color: palette.text, opacity: 0.65, fontFamily: fontBody, whiteSpace: "pre-wrap", marginTop: "12px" }}>
        {text}
      </pre>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      {style === "A" && <StyleA entries={entries} palette={palette} fontTitle={fontTitle} fontBody={fontBody} />}
      {style === "B" && <StyleB entries={entries} palette={palette} fontTitle={fontTitle} fontBody={fontBody} />}
      {style === "C" && <StyleC entries={entries} palette={palette} fontTitle={fontTitle} fontBody={fontBody} />}
    </div>
  );
}
