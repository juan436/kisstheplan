"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import type { DecorationType, DecorationObject, EmojiObject } from "@/types";
import { EmojiCreatorModal } from "../modals/emoji-creator-modal";
import {
  IconRoundTable, IconRectTable, IconSerpentineTable,
  IconChair, IconBench,
  IconArch, IconRunner, IconDanceFloor, IconStage, IconDjBooth, IconPhotocall, IconPiano,
  IconBar, IconCandyBar, IconGiftTable, IconCoatCheck, IconBathroom, IconEntrance,
  IconSofa, IconFlowers, IconTree, IconCandelabra, IconCarpet,
  IconSpeaker, IconScreen, IconOutlet,
} from "./library-icons";
import { DecoIconPreview } from "./seating-decoration-icons";

interface LibraryItem {
  label: string;
  icon: React.ReactNode;
  isTable?: "round" | "rectangular" | "serpentine";
  decoType?: DecorationType;
  objectType?: string;
  physicalWidth?: number;
  physicalHeight?: number;
  keywords?: string[];
}

const ICON_SIZE = 26;

const CATEGORIES: { id: string; label: string; items: LibraryItem[] }[] = [
  {
    id: "tables", label: "Mesas",
    items: [
      { label: "Redonda",      icon: <IconRoundTable size={ICON_SIZE} />,       isTable: "round" },
      { label: "Rectangular",  icon: <IconRectTable size={ICON_SIZE} />,        isTable: "rectangular" },
      { label: "Serpentina",   icon: <IconSerpentineTable size={ICON_SIZE} />,  isTable: "serpentine" },
    ],
  },
  {
    id: "seating", label: "Asientos",
    items: [
      { label: "Silla",  icon: <IconChair size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "chair", physicalWidth: 0.5, physicalHeight: 0.5 },
      { label: "Banco",  icon: <IconBench size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "bench", physicalWidth: 2,   physicalHeight: 0.5, keywords: ["pew"] },
    ],
  },
  {
    id: "ceremony", label: "Ceremonia",
    items: [
      { label: "Arco",    icon: <IconArch size={ICON_SIZE} />,   decoType: "custom_emoji", objectType: "arch",   physicalWidth: 3,   physicalHeight: 3, keywords: ["altar", "arco floral"] },
      { label: "Pasillo", icon: <IconRunner size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "runner", physicalWidth: 1.2, physicalHeight: 8, keywords: ["alfombra"] },
    ],
  },
  {
    id: "entertainment", label: "Pista y Música",
    items: [
      { label: "Pista",     icon: <IconDanceFloor size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "dancefloor", physicalWidth: 5,   physicalHeight: 5 },
      { label: "Escenario", icon: <IconStage size={ICON_SIZE} />,      decoType: "custom_emoji", objectType: "stage",      physicalWidth: 8,   physicalHeight: 4 },
      { label: "DJ Booth",  icon: <IconDjBooth size={ICON_SIZE} />,    decoType: "custom_emoji", objectType: "djbooth",    physicalWidth: 2,   physicalHeight: 1.5, keywords: ["dj", "musica"] },
      { label: "Piano",     icon: <IconPiano size={ICON_SIZE} />,      decoType: "custom_emoji", objectType: "piano",      physicalWidth: 1.5, physicalHeight: 0.6, keywords: ["instrumento"] },
      { label: "Photocall", icon: <IconPhotocall size={ICON_SIZE} />,  decoType: "custom_emoji", objectType: "photocall",  physicalWidth: 2.5, physicalHeight: 2,  keywords: ["fotos", "photo booth"] },
    ],
  },
  {
    id: "service", label: "Servicio",
    items: [
      { label: "Barra",       icon: <IconBar size={ICON_SIZE} />,       decoType: "custom_emoji", objectType: "bar",       physicalWidth: 4,   physicalHeight: 1.2, keywords: ["bebidas"] },
      { label: "Dulces",      icon: <IconCandyBar size={ICON_SIZE} />,  decoType: "custom_emoji", objectType: "candybar",  physicalWidth: 2.5, physicalHeight: 1,   keywords: ["candy bar", "postre", "tarta"] },
      { label: "Regalos",     icon: <IconGiftTable size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "gifttable", physicalWidth: 2,   physicalHeight: 1,   keywords: ["gifts"] },
      { label: "Guardarropa", icon: <IconCoatCheck size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "coatcheck", physicalWidth: 3,   physicalHeight: 1,   keywords: ["coat check"] },
      { label: "Baños",       icon: <IconBathroom size={ICON_SIZE} />,  decoType: "custom_emoji", objectType: "bathroom",  physicalWidth: 3,   physicalHeight: 2,   keywords: ["wc", "aseos"] },
      { label: "Entrada",     icon: <IconEntrance size={ICON_SIZE} />,  decoType: "custom_emoji", objectType: "entrance",  physicalWidth: 1.5, physicalHeight: 0.2, keywords: ["salida", "puerta", "exit"] },
    ],
  },
  {
    id: "decor", label: "Decoración",
    items: [
      { label: "Flores",     icon: <IconFlowers size={ICON_SIZE} />,    decoType: "custom_emoji", objectType: "flowers",    physicalWidth: 0.5, physicalHeight: 0.5, keywords: ["centro", "jarrón", "bouquet"] },
      { label: "Árbol",      icon: <IconTree size={ICON_SIZE} />,       decoType: "custom_emoji", objectType: "tree",       physicalWidth: 1.5, physicalHeight: 1.5 },
      { label: "Sofá",       icon: <IconSofa size={ICON_SIZE} />,       decoType: "custom_emoji", objectType: "sofa",       physicalWidth: 2,   physicalHeight: 1,   keywords: ["lounge", "chill out"] },
      { label: "Candelabro", icon: <IconCandelabra size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "candelabra", physicalWidth: 0.4, physicalHeight: 0.4, keywords: ["vela", "luz"] },
      { label: "Alfombra",   icon: <IconCarpet size={ICON_SIZE} />,     decoType: "custom_emoji", objectType: "carpet",     physicalWidth: 3,   physicalHeight: 2 },
    ],
  },
  {
    id: "tech", label: "Técnica",
    items: [
      { label: "Altavoz", icon: <IconSpeaker size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "speaker", physicalWidth: 0.5, physicalHeight: 0.5, keywords: ["sonido"] },
      { label: "Pantalla", icon: <IconScreen size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "screen",  physicalWidth: 3,   physicalHeight: 0.2, keywords: ["tv", "proyector"] },
      { label: "Enchufe",  icon: <IconOutlet size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "outlet",  physicalWidth: 0.2, physicalHeight: 0.2, keywords: ["corriente"] },
    ],
  },
];

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
        {/* Search input */}
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

        {/* Scrollable items */}
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

          {/* Mis Objetos */}
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
