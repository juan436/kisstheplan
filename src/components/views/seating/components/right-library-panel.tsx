"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { DecorationType, DecorationObject, EmojiObject } from "@/types";
import { EmojiCreatorModal } from "./emoji-creator-modal";

interface LibraryItem {
  emoji: string;
  label: string;
  isTable?: "round" | "rectangular";
  decoType?: DecorationType;
  physicalWidth?: number;
  physicalHeight?: number;
}

const CATEGORIES: { id: string; label: string; items: LibraryItem[] }[] = [
  {
    id: "tables", label: "Mesas",
    items: [
      { emoji: "⭕", label: "Redonda", isTable: "round" },
      { emoji: "▬", label: "Rectangular", isTable: "rectangular" },
    ],
  },
  {
    id: "large", label: "Mobiliario",
    items: [
      { emoji: "💃", label: "Pista", decoType: "dancefloor", physicalWidth: 5, physicalHeight: 5 },
      { emoji: "🎭", label: "Escenario", physicalWidth: 8, physicalHeight: 4 },
      { emoji: "👠", label: "Pasarela", physicalWidth: 6, physicalHeight: 1.5 },
    ],
  },
  {
    id: "services", label: "Servicios",
    items: [
      { emoji: "🍹", label: "Barra", decoType: "bar", physicalWidth: 3, physicalHeight: 1.5 },
      { emoji: "📸", label: "Photocall", decoType: "photobooth", physicalWidth: 2.5, physicalHeight: 2 },
      { emoji: "☕", label: "Café", physicalWidth: 1.5, physicalHeight: 1 },
    ],
  },
  {
    id: "decor", label: "Decoración",
    items: [
      { emoji: "🌿", label: "Planta", physicalWidth: 0.6, physicalHeight: 0.6 },
      { emoji: "🌳", label: "Árbol", decoType: "tree", physicalWidth: 1.5, physicalHeight: 1.5 },
      { emoji: "💡", label: "Luces", physicalWidth: 0.3, physicalHeight: 0.3 },
      { emoji: "🟫", label: "Alfombra", physicalWidth: 3, physicalHeight: 1.5 },
    ],
  },
  {
    id: "tech", label: "Técnica",
    items: [
      { emoji: "🔊", label: "Altavoz", decoType: "speaker", physicalWidth: 0.5, physicalHeight: 0.5 },
      { emoji: "🚻", label: "Baños", physicalWidth: 2, physicalHeight: 2 },
      { emoji: "🚪", label: "Salida", physicalWidth: 1, physicalHeight: 0.2 },
      { emoji: "🔌", label: "Corriente", physicalWidth: 0.2, physicalHeight: 0.2 },
    ],
  },
];

interface Props {
  mode: "layout" | "seating";
  customEmojis: EmojiObject[];
  onAddTable: (shape: "round" | "rectangular") => void;
  onAddDecoration: (type: DecorationType, extra?: Partial<DecorationObject>) => void;
  onAddCustomEmoji: (obj: EmojiObject) => void;
  onDeleteCustomEmoji: (id: string) => void;
}

const CAT_LABEL = "text-[10px] uppercase tracking-wider text-[var(--color-text)]/40 px-0.5 mb-1 mt-0.5";
const ITEM_BTN = "flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-2)] transition-colors cursor-pointer";

export function RightLibraryPanel({ mode, customEmojis, onAddTable, onAddDecoration, onAddCustomEmoji, onDeleteCustomEmoji }: Props) {
  const [showCreator, setShowCreator] = useState(false);

  const handleItem = (item: LibraryItem) => {
    if (item.isTable) { onAddTable(item.isTable); return; }
    const type: DecorationType = item.decoType ?? "custom_emoji";
    onAddDecoration(type, { customEmoji: item.emoji, label: item.label, physicalWidth: item.physicalWidth, physicalHeight: item.physicalHeight });
  };

  if (mode === "seating") {
    return (
      <div className="flex flex-col items-center justify-center p-3 border-l border-[var(--color-border)] bg-white flex-shrink-0 text-center" style={{ width: 220 }}>
        <p className="text-[11px] text-[var(--color-text)]/40 leading-relaxed">Haz clic en una mesa para gestionar los asientos</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 p-2.5 border-l border-[var(--color-border)] bg-white flex-shrink-0 overflow-y-auto" style={{ width: 220 }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <p className={CAT_LABEL}>{cat.label}</p>
            <div className="grid grid-cols-3 gap-1">
              {cat.items.map((item) => (
                <button key={item.label} onClick={() => handleItem(item)} className={ITEM_BTN}>
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <span className="text-[10px] text-[var(--color-text)]/60 leading-tight text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="w-full h-px bg-[#E5DFD7] my-0.5" />

        {/* Mis Objetos */}
        <div>
          <p className={CAT_LABEL}>Mis Objetos</p>
          <div className="grid grid-cols-3 gap-1">
            {customEmojis.map((obj) => (
              <div key={obj.id} className="relative group">
                <button onClick={() => onAddDecoration("custom_emoji", { customEmoji: obj.emoji, label: obj.label, physicalWidth: obj.physicalWidth, physicalHeight: obj.physicalHeight })}
                  className={ITEM_BTN + " w-full"}>
                  <span className="text-xl leading-none">{obj.emoji}</span>
                  <span className="text-[10px] text-[var(--color-text)]/60 leading-tight text-center truncate w-full">{obj.label}</span>
                </button>
                <button onClick={() => onDeleteCustomEmoji(obj.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={8} />
                </button>
              </div>
            ))}
            <button onClick={() => setShowCreator(true)}
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text)]/40 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors">
              <Plus size={18} />
              <span className="text-[10px] leading-tight">Crear</span>
            </button>
          </div>
        </div>
      </div>

      {showCreator && (
        <EmojiCreatorModal onConfirm={onAddCustomEmoji} onClose={() => setShowCreator(false)} />
      )}
    </>
  );
}
