"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { EmojiObject } from "@/types";

interface Props {
  onConfirm: (obj: EmojiObject) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS: { emoji: string; label: string }[] = [
  // ── Boda y ceremonia ──────────────────────────────────────────────────────────
  { emoji: "💍", label: "Anillo" },
  { emoji: "👰", label: "Novia" },
  { emoji: "🤵", label: "Novio" },
  { emoji: "💒", label: "Iglesia/Civil" },
  { emoji: "🕊️", label: "Paloma" },
  { emoji: "❤️", label: "Corazón" },
  { emoji: "💕", label: "Amor" },
  { emoji: "💌", label: "Invitación" },
  { emoji: "🎀", label: "Lazo" },
  { emoji: "🎁", label: "Regalo" },
  { emoji: "🎊", label: "Celebración" },
  { emoji: "🎉", label: "Fiesta" },
  { emoji: "🥂", label: "Brindis" },
  { emoji: "💐", label: "Ramo novia" },
  { emoji: "🌹", label: "Rosa" },
  { emoji: "🌸", label: "Flor" },
  { emoji: "🌺", label: "Hibisco" },
  { emoji: "🌼", label: "Margarita" },
  { emoji: "🌻", label: "Girasol" },
  { emoji: "🏵️", label: "Guirnalda" },
  { emoji: "💏", label: "Beso novios" },
  { emoji: "👫", label: "Pareja" },
  { emoji: "🤝", label: "Alianza" },
  { emoji: "⛪", label: "Capilla" },
  // ── Catering y bebidas ────────────────────────────────────────────────────────
  { emoji: "🍾", label: "Champán" },
  { emoji: "🍷", label: "Vino" },
  { emoji: "🍸", label: "Cóctel" },
  { emoji: "🥃", label: "Whisky" },
  { emoji: "☕", label: "Café" },
  { emoji: "🍽️", label: "Servicio" },
  { emoji: "🎂", label: "Tarta nupcial" },
  { emoji: "🧁", label: "Cupcake" },
  { emoji: "🍰", label: "Postre" },
  { emoji: "🍬", label: "Candy bar" },
  { emoji: "🍭", label: "Piruleta" },
  { emoji: "🫖", label: "Té" },
  // ── Música y entretenimiento ──────────────────────────────────────────────────
  { emoji: "🎸", label: "Guitarra" },
  { emoji: "🎹", label: "Piano" },
  { emoji: "🎺", label: "Trompeta" },
  { emoji: "🥁", label: "Batería" },
  { emoji: "🎷", label: "Saxofón" },
  { emoji: "🪗", label: "Acordeón" },
  { emoji: "🎻", label: "Violín" },
  { emoji: "🎤", label: "Micrófono" },
  { emoji: "🎧", label: "DJ" },
  { emoji: "🔊", label: "Altavoz" },
  { emoji: "💃", label: "Pista baile" },
  { emoji: "🕺", label: "Bailarín" },
  // ── Fotografía y video ────────────────────────────────────────────────────────
  { emoji: "📷", label: "Cámara" },
  { emoji: "📸", label: "Fotocall" },
  { emoji: "🎥", label: "Vídeo" },
  { emoji: "🎬", label: "Claqueta" },
  // ── Naturaleza y decoración ───────────────────────────────────────────────────
  { emoji: "🌴", label: "Palmera" },
  { emoji: "🌳", label: "Árbol" },
  { emoji: "🌵", label: "Cactus" },
  { emoji: "🌿", label: "Planta" },
  { emoji: "🍃", label: "Hojas" },
  { emoji: "🪴", label: "Maceta" },
  // ── Mobiliario y espacio ──────────────────────────────────────────────────────
  { emoji: "🛋️", label: "Sofá" },
  { emoji: "🪑", label: "Silla" },
  { emoji: "🚪", label: "Entrada" },
  { emoji: "🪞", label: "Espejo" },
  { emoji: "🖼️", label: "Cuadro" },
  { emoji: "🧧", label: "Sobre/Mesa" },
  // ── Luces y ambiente ──────────────────────────────────────────────────────────
  { emoji: "💡", label: "Luz" },
  { emoji: "🕯️", label: "Vela" },
  { emoji: "✨", label: "Brillos" },
  { emoji: "🎆", label: "Fuegos" },
  { emoji: "🏮", label: "Farol" },
  { emoji: "🪔", label: "Lámpara" },
  // ── Servicios y logística ─────────────────────────────────────────────────────
  { emoji: "🚻", label: "Baños" },
  { emoji: "🚑", label: "Emergencias" },
  { emoji: "🚘", label: "Parking" },
  { emoji: "⚡", label: "Electricidad" },
  { emoji: "🔌", label: "Enchufe" },
  { emoji: "🧯", label: "Extintor" },
  // ── Escenario y estructura ────────────────────────────────────────────────────
  { emoji: "🎭", label: "Escenario" },
  { emoji: "🎪", label: "Carpa" },
  { emoji: "⛺", label: "Tienda" },
  { emoji: "🏗️", label: "Estructura" },
];

export function EmojiCreatorModal({ onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<{ emoji: string; label: string } | null>(null);
  const [label, setLabel] = useState("");
  const [width, setWidth] = useState("1.0");
  const [height, setHeight] = useState("1.0");

  const isValid = selected !== null && label.trim().length > 0
    && parseFloat(width) > 0 && parseFloat(height) > 0;

  const handleConfirm = () => {
    if (!isValid || !selected) return;
    onConfirm({
      id: `emoji-${Date.now()}`,
      emoji: selected.emoji,
      label: label.trim(),
      physicalWidth: parseFloat(width),
      physicalHeight: parseFloat(height),
    });
    onClose();
  };

  const handleSelect = (item: { emoji: string; label: string }) => {
    setSelected(item);
    if (!label) setLabel(item.label);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(74,60,50,0.18)] p-6 w-[420px] flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--color-text)] text-sm">Nuevo objeto personalizado</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Emoji picker grid */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--color-text)]/60">Figura / Emoji</label>
          <div className="border border-[var(--color-border)] rounded-xl p-2 max-h-44 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_OPTIONS.map((item) => (
                <button key={item.emoji} type="button" title={item.label}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg text-xl transition-all ${
                    selected?.emoji === item.emoji
                      ? "bg-[var(--color-accent)]/15 ring-2 ring-[var(--color-accent)] scale-110"
                      : "hover:bg-[var(--color-bg-2)]"
                  }`}>
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
          {selected && (
            <p className="text-xs text-[var(--color-text)]/50 text-center">
              Seleccionado: <span className="font-medium text-[var(--color-text)]">{selected.emoji} {selected.label}</span>
            </p>
          )}
        </div>

        {/* Name + dimensions */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--color-text)]/60">Nombre del objeto</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="Ej: Palmera Grande"
            className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-[var(--color-text)]/60">Ancho (m)</label>
            <input type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)}
              className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-[var(--color-text)]/60">Alto (m)</label>
            <input type="number" min="0.1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
              className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
          </div>
        </div>

        <button onClick={handleConfirm} disabled={!isValid}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 disabled:opacity-40 disabled:cursor-not-allowed">
          {selected ? `Añadir ${selected.emoji} al plano` : "Selecciona un emoji primero"}
        </button>
      </div>
    </div>
  );
}
