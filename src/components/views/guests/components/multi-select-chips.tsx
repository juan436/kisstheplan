"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";

const pill = { background: "var(--color-accent)", color: "white" };

function toSet(v: string) { return new Set(v ? v.split(", ").filter(Boolean) : []); }
function fromSet(s: Set<string>) { return Array.from(s).join(", "); }

function useDropdownPos(ref: React.RefObject<HTMLElement | null>, open: boolean) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  useEffect(() => {
    if (!open || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
  }, [open, ref]);
  return pos;
}

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

/* ─── Portal dropdown list (scroll + max-height) ─────────────────────────── */
function DropdownList({ pos, options, active, onToggle }: {
  pos: { top: number; left: number; width: number };
  options: string[]; active: Set<string>; onToggle: (opt: string) => void;
}) {
  const available = options.filter((opt) => !active.has(opt));
  return createPortal(
    <div style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="bg-white border border-border rounded-lg shadow-lg overflow-y-auto max-h-56">
      {available.length === 0
        ? <p className="px-3 py-2 text-[13px] text-brand/60 italic">Todas las opciones seleccionadas</p>
        : <div className="flex flex-wrap gap-1.5 p-2.5">
            {available.map((opt) => (
              <button key={opt} type="button" onMouseDown={(e) => { e.preventDefault(); onToggle(opt); }}
                className="px-2.5 py-0.5 rounded-full text-[12px] font-medium border border-border bg-bg2 text-text hover:border-accent hover:bg-accent/10 transition-colors">
                {opt}
              </button>
            ))}
          </div>
      }
    </div>,
    document.body,
  );
}

/* ─── Shared remove button — stops both mousedown AND click propagation ───── */
function RemoveBtn({ onRemove, size = 10 }: { onRemove: () => void; size?: number }) {
  return (
    <button type="button"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onRemove(); }}
      className="hover:opacity-70 leading-none flex-shrink-0">
      <X size={size} />
    </button>
  );
}

/* ─── Form multi-select ───────────────────────────────────────────────────── */
export function MultiSelectChips({ options, selected, onChange }: {
  options: string[]; selected: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pos = useDropdownPos(triggerRef, open);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(triggerRef, close, open);

  const active = toSet(selected);
  const toggle = (item: string) => {
    const next = new Set(active); next.has(item) ? next.delete(item) : next.add(item);
    onChange(fromSet(next));
  };
  const remove = (item: string) => {
    const next = new Set(active); next.delete(item); onChange(fromSet(next));
  };

  return (
    <div ref={triggerRef} className="relative">
      <div onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 bg-[#f2efe9] border-[1.5px] border-border rounded-md min-h-[38px] cursor-pointer select-none">
        {Array.from(active).map((item) => (
          <span key={item} style={pill} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium">
            {item}
            <RemoveBtn onRemove={() => remove(item)} size={10} />
          </span>
        ))}
        {active.size === 0 && <span className="text-[13px] text-brand/60">Seleccionar...</span>}
        <ChevronDown size={13} className={`ml-auto text-brand transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && <DropdownList pos={pos} options={options} active={active} onToggle={toggle} />}
    </div>
  );
}

/* ─── Read-only pill display (table non-editing) ─────────────────────────── */
export function MultiSelectDisplay({ value }: { value: string }) {
  const items = value ? value.split(", ").filter(Boolean) : [];
  if (!items.length) return <span className="text-[13px]">—</span>;
  return (
    <div className="flex flex-wrap gap-1 max-w-[220px]">
      {items.map((item) => (
        <span key={item} style={pill} className="text-[11px] px-1.5 py-0.5 rounded-full font-medium">{item}</span>
      ))}
    </div>
  );
}

/* ─── Table inline multi-select ──────────────────────────────────────────── */
export function TableMultiSelect({ initialValue, options, onSave, onCancel }: {
  initialValue: string; options: string[];
  onSave: (val: string) => void; onCancel: () => void;
}) {
  const [current, setCurrent] = useState(initialValue);
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pos = useDropdownPos(triggerRef, open);

  const currentRef = useRef(current);
  const onSaveRef   = useRef(onSave);
  const onCancelRef = useRef(onCancel);
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);

  const stableSave = useCallback(() => { onSaveRef.current(currentRef.current); }, []);
  useClickOutside(triggerRef, stableSave, true);

  const active = toSet(current);
  const toggle = (item: string) => {
    const next = new Set(active); next.has(item) ? next.delete(item) : next.add(item);
    setCurrent(fromSet(next));
  };
  const remove = (item: string) => {
    const next = new Set(active); next.delete(item); setCurrent(fromSet(next));
  };

  return (
    // max-w-[220px] prevents the column from expanding; tags wrap inside
    <div ref={triggerRef} className="relative max-w-[220px] min-w-[120px]"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancelRef.current();
        else if (e.key === "Enter") { e.preventDefault(); onSaveRef.current(currentRef.current); }
      }}>
      <div onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-1 px-2 py-1 bg-bg2 border border-cta rounded cursor-pointer select-none min-h-[30px]">
        {Array.from(active).map((item) => (
          <span key={item} style={pill} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-medium">
            {item}
            <RemoveBtn onRemove={() => remove(item)} size={9} />
          </span>
        ))}
        {active.size === 0 && <span className="text-[12px] text-brand/60">—</span>}
        <ChevronDown size={12} className={`ml-auto text-brand transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && <DropdownList pos={pos} options={options} active={active} onToggle={toggle} />}
    </div>
  );
}
