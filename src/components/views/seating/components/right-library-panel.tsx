"use client";

import { useState } from "react";
import { Circle, Square, Plus, Trash2 } from "lucide-react";
import type { DecorationType, DecorationObject, EmojiObject } from "@/types";
import { DECORATION_META } from "../constants/seating.constants";
import { EmojiCreatorModal } from "./emoji-creator-modal";

const btn = "flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-colors text-xs w-full";
const btnOff = `${btn} border-[var(--color-border)] bg-white text-[var(--color-text)]/70 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]`;

interface Props {
  mode: "layout" | "seating";
  customEmojis: EmojiObject[];
  onAddTable: (shape: "round" | "rectangular") => void;
  onAddDecoration: (type: DecorationType, extra?: Partial<DecorationObject>) => void;
  onAddCustomEmoji: (obj: EmojiObject) => void;
  onDeleteCustomEmoji: (id: string) => void;
}

const SECTION = "text-[10px] uppercase tracking-wider text-[var(--color-text)]/40 mb-1.5 px-0.5";

export function RightLibraryPanel({ mode, customEmojis, onAddTable, onAddDecoration, onAddCustomEmoji, onDeleteCustomEmoji }: Props) {
  const [showEmojiCreator, setShowEmojiCreator] = useState(false);

  if (mode === "seating") {
    return (
      <div className="flex flex-col items-center justify-center p-3 border-l border-[var(--color-border)] bg-white flex-shrink-0 text-center" style={{ width: 200 }}>
        <p className="text-[11px] text-[var(--color-text)]/40 leading-relaxed">Haz clic en una mesa para gestionar los asientos</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 p-3 border-l border-[var(--color-border)] bg-white flex-shrink-0 overflow-y-auto" style={{ width: 200 }}>
        {/* Tables */}
        <div>
          <p className={SECTION}>Mesas</p>
          <div className="flex flex-col gap-1.5">
            <button onClick={() => onAddTable("round")} className={btnOff}>
              <Circle size={13} /> Mesa redonda
            </button>
            <button onClick={() => onAddTable("rectangular")} className={btnOff}>
              <Square size={13} /> Mesa rectangular
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-[var(--color-border)]" />

        {/* Predefined decorations */}
        <div>
          <p className={SECTION}>Decoración</p>
          <div className="flex flex-col gap-1">
            {(Object.keys(DECORATION_META) as DecorationType[]).map((type) => {
              const m = DECORATION_META[type];
              return (
                <button key={type} onClick={() => onAddDecoration(type)}
                  className={btnOff}>
                  <span className="text-base leading-none">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-[var(--color-border)]" />

        {/* Custom emoji objects */}
        <div>
          <p className={SECTION}>Mis objetos</p>
          <div className="flex flex-col gap-1">
            {customEmojis.map((obj) => (
              <div key={obj.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => onAddDecoration("custom_emoji", { customEmoji: obj.emoji, label: obj.label, physicalWidth: obj.physicalWidth, physicalHeight: obj.physicalHeight })}
                  className={`${btnOff} flex-1`}>
                  <span className="text-base leading-none">{obj.emoji}</span>
                  <span className="truncate">{obj.label}</span>
                </button>
                <button onClick={() => onDeleteCustomEmoji(obj.id)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--color-danger)]/60 hover:text-[var(--color-danger)] transition-all flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button onClick={() => setShowEmojiCreator(true)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text)]/50 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors w-full">
              <Plus size={12} /> Crear objeto
            </button>
          </div>
        </div>
      </div>

      {showEmojiCreator && (
        <EmojiCreatorModal
          onConfirm={onAddCustomEmoji}
          onClose={() => setShowEmojiCreator(false)}
        />
      )}
    </>
  );
}
