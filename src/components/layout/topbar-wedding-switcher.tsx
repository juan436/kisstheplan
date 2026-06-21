"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { WeddingOption } from "@/types/user";

interface Props {
  weddingName: string;
  activeWeddingId?: string;
  available: WeddingOption[];
  onSwitch: (weddingId: string) => Promise<void>;
}

export function WeddingSwitcher({ weddingName, activeWeddingId, available, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  async function handleSwitch(weddingId: string) {
    if (weddingId === activeWeddingId || switching) return;
    setSwitching(true);
    setOpen(false);
    try {
      await onSwitch(weddingId);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-white font-body font-semibold text-[14px] hover:opacity-80 transition-opacity"
      >
        <span>{switching ? "Cambiando…" : weddingName}</span>
        <ChevronDown size={13} className="opacity-60" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 min-w-[210px] bg-white border border-border rounded-[12px] shadow-dropdown overflow-hidden animate-fade-in z-50">
          {available.map(w => (
            <button
              key={w.weddingId}
              onClick={() => handleSwitch(w.weddingId)}
              disabled={switching}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-bg2 transition-colors disabled:opacity-50"
            >
              <div>
                <div className="text-[13px] font-medium text-text">{w.weddingName}</div>
                <div className="text-[11px] text-text/50 mt-0.5">
                  {w.role === 'owner' ? 'Dueño' : 'Colaborador'}
                </div>
              </div>
              {w.weddingId === activeWeddingId && (
                <Check size={14} className="text-accent shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
