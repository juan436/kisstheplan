"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { ALL_FONTS_URL } from "../constants/web.constants";

interface FontSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

export function FontSelect({ value, onChange, options }: FontSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ALL_FONTS_URL) return;
    const id = "ktp-fonts-preview";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = ALL_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-bg2 border-[1.5px] border-border rounded-md px-3 py-2.5 text-[13px] text-text outline-none hover:border-brand focus:border-cta transition-colors"
      >
        <span style={{ fontFamily: value }}>{value}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform text-brand ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-border rounded-xl shadow-dropdown">
          {options.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { onChange(f); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-[13px] hover:bg-bg2 transition-colors ${value === f ? "bg-cta/10 text-cta font-semibold" : "text-text"}`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
