"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, ChevronDown, Plus } from "lucide-react";

function toSet(v: string) { return new Set(v ? v.split(", ").filter(Boolean) : []); }
function fromSet(s: Set<string>) { return Array.from(s).join(", "); }

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  const cb = useRef(onClose);
  useEffect(() => { cb.current = onClose; });
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb.current();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [active, ref]);
}

/* ─── Multi-select chips para el flujo RSVP ──────────────────────────────── */
export function RsvpChips({ options, value, onChange, allowCustom = false, accent }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  allowCustom?: boolean;
  accent: string;
}) {
  const [open,    setOpen]    = useState(false);
  const [custom,  setCustom]  = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const close   = useCallback(() => setOpen(false), []);
  useClickOutside(wrapRef, close, open);

  const active = toSet(value);

  const toggle = (item: string) => {
    const next = new Set(active);
    next.has(item) ? next.delete(item) : next.add(item);
    onChange(fromSet(next));
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;
    const next = new Set(active);
    next.add(trimmed);
    onChange(fromSet(next));
    setCustom("");
  };

  const available = options.filter((o) => !active.has(o));

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger */}
      <div onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-white/80 border-[1.5px] rounded-xl min-h-[44px] cursor-pointer select-none transition-colors"
        style={{ borderColor: active.size > 0 ? accent : accent + "40" }}>
        {Array.from(active).map((item) => (
          <span key={item} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-medium text-white"
            style={{ backgroundColor: accent }}>
            {item}
            <button type="button" onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); toggle(item); }}
              className="hover:opacity-70 leading-none">
              <X size={10} />
            </button>
          </span>
        ))}
        {active.size === 0 && <span className="text-[13px] opacity-40">Seleccionar...</span>}
        <ChevronDown size={13} className={`ml-auto opacity-40 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {available.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3">
              {available.map((opt) => (
                <button key={opt} type="button" onMouseDown={(e) => { e.preventDefault(); toggle(opt); }}
                  onMouseEnter={() => setHovered(opt)}
                  onMouseLeave={() => setHovered(null)}
                  className="px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors"
                  style={{
                    borderColor:     hovered === opt ? accent : accent + "30",
                    backgroundColor: hovered === opt ? accent + "18" : "transparent",
                    color:           hovered === opt ? accent : undefined,
                  }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {allowCustom && (
            <div className="flex gap-2 px-3 pb-3 border-t border-border/50 pt-2.5">
              <input value={custom} onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Otra alergia..."
                className="flex-1 bg-white/60 border rounded-lg px-3 py-1.5 text-[13px] outline-none transition-colors"
                style={{ borderColor: focused ? accent : accent + "40" }} />
              <button type="button" onClick={addCustom}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: accent }}>
                <Plus size={13} />Añadir
              </button>
            </div>
          )}
          {available.length === 0 && !allowCustom && (
            <p className="px-3 py-3 text-[13px] opacity-40 italic">Todas las opciones seleccionadas</p>
          )}
        </div>
      )}
    </div>
  );
}
