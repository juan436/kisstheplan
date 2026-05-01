"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import type { DecorationType, DecorationObject, EmojiObject } from "@/types";
import { EmojiCreatorModal } from "../modals/emoji-creator-modal";
import { DecoIconPreview } from "./seating-decoration-icons";
import { CATEGORIES, type LibraryItem } from "./library-items";

interface Props {
  mode: "layout" | "seating";
  customEmojis: EmojiObject[];
  onAddTable: (shape: "round" | "rectangular" | "serpentine") => void;
  onAddDecoration: (type: DecorationType, extra?: Partial<DecorationObject>) => void;
  onAddCustomEmoji: (obj: EmojiObject) => void;
  onDeleteCustomEmoji: (id: string) => void;
}

const ITEM_BTN = "flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-2)] transition-colors cursor-pointer text-[var(--color-accent)]";
const CAT_LABEL = "text-[10px] uppercase tracking-wider text-[var(--color-text)]/40 px-0.5 mb-1 mt-0.5";

export function RightLibraryPanel({ mode, customEmojis, onAddTable, onAddDecoration, onAddCustomEmoji, onDeleteCustomEmoji }: Props) {
  const [showCreator, setShowCreator] = useState(false);
  const [query, setQuery] = useState("");

  const handleItem = (item: LibraryItem) => {
    if (item.isTable) { onAddTable(item.isTable); return; }
    const type: DecorationType = item.decoType ?? "custom_emoji";
    onAddDecoration(type, { objectType: item.objectType, label: item.label, physicalWidth: item.physicalWidth, physicalHeight: item.physicalHeight });
  };

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.label.toLowerCase().includes(q) ||
        cat.label.toLowerCase().includes(q) ||
        (item.keywords ?? []).some((k) => k.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [query]);

  if (mode === "seating") {
    return (
      <div className="flex flex-col items-center justify-center p-3 border-l border-[var(--color-border)] bg-white flex-shrink-0 text-center" style={{ width: 220 }}>
        <p className="text-[11px] text-[var(--color-text)]/40 leading-relaxed">Haz clic en una mesa para gestionar los asientos</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-l border-[var(--color-border)] bg-white flex-shrink-0" style={{ width: 220 }}>
        <div className="px-2 pt-2.5 pb-1 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            <Search size={12} className="text-[var(--color-text)]/35 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar objeto..."
              className="flex-1 bg-transparent text-[11px] text-[var(--color-text)] placeholder:text-[var(--color-text)]/30 outline-none min-w-0"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2.5 pb-2.5 overflow-y-auto flex-1">
          {filteredCategories.length === 0 && (
            <p className="text-[11px] text-[var(--color-text)]/35 text-center py-6">Sin resultados</p>
          )}
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              <p className={CAT_LABEL}>{cat.label}</p>
              <div className="grid grid-cols-3 gap-1">
                {cat.items.map((item) => (
                  <button key={item.label} onClick={() => handleItem(item)} className={ITEM_BTN}>
                    {item.icon}
                    <span className="text-[10px] text-[var(--color-text)]/60 leading-tight text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="w-full h-px bg-[#E5DFD7] my-0.5" />
          <div>
            <p className={CAT_LABEL}>Mis Objetos</p>
            <div className="grid grid-cols-3 gap-1">
              {customEmojis.map((obj) => (
                <div key={obj.id} className="relative group">
                  <button onClick={() => onAddDecoration("custom_emoji", { objectType: obj.objectType, customEmoji: obj.emoji, label: obj.label, physicalWidth: obj.physicalWidth, physicalHeight: obj.physicalHeight })}
                    className={ITEM_BTN + " w-full"}>
                    {obj.objectType
                      ? <DecoIconPreview objectType={obj.objectType} size={22} />
                      : <span className="text-xl leading-none">{obj.emoji}</span>}
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
      </div>
      {showCreator && (
        <EmojiCreatorModal onConfirm={onAddCustomEmoji} onClose={() => setShowCreator(false)} />
      )}
    </>
  );
}
