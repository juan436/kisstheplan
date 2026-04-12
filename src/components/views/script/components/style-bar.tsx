"use client";

import type { ScriptEntry } from "@/types";

const FONT_SIZES = [{ value: "sm", label: "S" }, { value: "base", label: "M" }, { value: "lg", label: "L" }, { value: "xl", label: "XL" }] as const;
const COLORS = ["#4A3C32", "#866857", "#C4B7A6", "#8c6f5f", "#c7a977", "#7db87d", "#c47a7a", "#5b7fa6"];

export function StyleBar({ style, onChange, onClose }: { style: ScriptEntry["style"]; onChange: (s: Partial<ScriptEntry["style"]>) => void; onClose?: () => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1 p-2 rounded-lg" style={{ background: "var(--color-bg-2)" }}>
      <button onClick={() => onChange({ bold: !style.bold })}
        className="w-6 h-6 rounded text-xs font-bold transition-colors"
        style={{ background: style.bold ? "var(--color-fill)" : "transparent", color: style.bold ? "var(--color-accent)" : "var(--color-border)", border: `1px solid ${style.bold ? "var(--color-fill-2)" : "var(--color-border)"}` }}>B</button>
      {FONT_SIZES.map((s) => (
        <button key={s.value} onClick={() => { onChange({ fontSize: s.value }); onClose?.(); }}
          className="w-6 h-6 rounded text-xs font-medium transition-colors"
          style={{ background: style.fontSize === s.value ? "var(--color-fill)" : "transparent", color: style.fontSize === s.value ? "var(--color-accent)" : "var(--color-border)", border: `1px solid ${style.fontSize === s.value ? "var(--color-fill-2)" : "var(--color-border)"}` }}>{s.label}</button>
      ))}
      <span className="text-xs ml-1" style={{ color: "var(--color-border)" }}>Color:</span>
      {COLORS.map((c) => (
        <button key={c} onClick={() => { onChange({ color: c }); onClose?.(); }}
          className="w-4 h-4 rounded-full border-2 transition-transform hover:scale-110"
          style={{ background: c, borderColor: style.color === c ? "var(--color-accent)" : "transparent" }} />
      ))}
    </div>
  );
}
