"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CustomSelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2 relative">
      {label && (
        <Label className="text-[#6b5549] text-[13px] font-semibold pl-1">{label}</Label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-[#f2efe9] rounded-xl px-4 flex items-center justify-between text-text group"
      >
        <span className="flex-1 text-center font-medium pl-6">{value}</span>
        <ChevronDown size={18} className={`text-[#866857] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-20 animate-fade-in">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full px-4 py-3 text-[14px] text-text hover:bg-bg2 transition-colors text-center"
                onClick={() => { onChange(opt); setIsOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
