"use client";

import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import type { EmojiObject } from "@/types";
import { DecoIconPreview } from "../library/seating-decoration-icons";

interface GalleryItem { objectType: string; label: string; w: number; h: number; keywords?: string[]; }
interface GalleryCategory { id: string; label: string; items: GalleryItem[]; }

// Objects already available in the default library panel — excluded here to avoid duplication
// (chair, bench, arch, runner, dancefloor, stage, djbooth, piano, photocall,
//  bar, candybar, gifttable, coatcheck, bathroom, entrance,
//  flowers, tree, sofa, candelabra, carpet, speaker, screen, outlet)

const GALLERY: GalleryCategory[] = [
  { id: "ceremonial", label: "Ceremonial", items: [
    { objectType: "kuppah",          label: "Chuppah",       w: 4,   h: 4,   keywords: ["juppa", "dosel", "judia"] },
    { objectType: "atril",           label: "Atril",         w: 0.6, h: 0.5, keywords: ["podium", "lectern"] },
    { objectType: "mesa_firma",      label: "Mesa firmas",   w: 1.5, h: 0.6, keywords: ["libro", "firmas"] },
    { objectType: "altar_ceremonia", label: "Altar",         w: 2,   h: 1.5, keywords: ["mesa altar"] },
    { objectType: "velas_altar",     label: "Velas",         w: 2,   h: 0.3, keywords: ["candelabro altar"] },
  ]},
  { id: "asientos", label: "Asientos extra", items: [
    { objectType: "silla_terraza", label: "Silla terraza", w: 0.6, h: 0.6, keywords: ["exterior"] },
    { objectType: "tumbona",       label: "Tumbona",       w: 1.8, h: 0.7, keywords: ["piscina", "playa"] },
    { objectType: "cama_balinesa", label: "Cama balinesa", w: 2,   h: 1.2, keywords: ["chill", "lounge"] },
    { objectType: "hamaca",        label: "Hamaca",        w: 2,   h: 0.8 },
    { objectType: "pouf",          label: "Pouf",          w: 0.7, h: 0.7, keywords: ["puf", "cojin"] },
    { objectType: "taburete",      label: "Taburete",      w: 0.5, h: 0.5, keywords: ["barra"] },
    { objectType: "sillon",        label: "Sillón",        w: 0.9, h: 0.9, keywords: ["armchair"] },
    { objectType: "otomana",       label: "Otomana",       w: 1,   h: 0.6, keywords: ["reposapiés"] },
  ]},
  { id: "mesas", label: "Mesas extra", items: [
    { objectType: "mesa_novios",  label: "Mesa novios",  w: 4,   h: 1.2, keywords: ["presidencia", "head table"] },
    { objectType: "mesa_oval",    label: "Mesa oval",    w: 2.5, h: 1.5, keywords: ["ovalada"] },
    { objectType: "mesa_cock",    label: "Mesa cóctel",  w: 0.7, h: 0.7, keywords: ["alta", "cocktail"] },
    { objectType: "mesa_buffet",  label: "Mesa buffet",  w: 3,   h: 1,   keywords: ["bufete"] },
    { objectType: "mesa_vienesa", label: "Mesa vienesa", w: 2,   h: 2,   keywords: ["redonda buffet"] },
    { objectType: "mesa_quesos",  label: "Mesa quesos",  w: 2.5, h: 1.5, keywords: ["tabla charcuteria"] },
    { objectType: "mesa_baja",    label: "Mesa baja",    w: 0.8, h: 0.5, keywords: ["auxiliar", "centro"] },
  ]},
  { id: "estructuras", label: "Estructuras", items: [
    { objectType: "toldo",     label: "Toldo",      w: 5, h: 4, keywords: ["velarium"] },
    { objectType: "carpa",     label: "Carpa",      w: 8, h: 8, keywords: ["tienda", "marquesina"] },
    { objectType: "carpa_hex", label: "Carpa hex.", w: 7, h: 7, keywords: ["hexagonal"] },
    { objectType: "pergola",   label: "Pérgola",    w: 5, h: 4 },
    { objectType: "tipi",      label: "Tipi",       w: 4, h: 4, keywords: ["yurta"] },
    { objectType: "glorieta",  label: "Glorieta",   w: 4, h: 4, keywords: ["cenador", "gazebo"] },
    { objectType: "parasol",   label: "Parasol",    w: 2, h: 2, keywords: ["sombrilla"] },
    { objectType: "biombo",    label: "Biombo",     w: 3, h: 0.1, keywords: ["separador", "divisor"] },
    { objectType: "tarima",    label: "Tarima",     w: 3, h: 2,   keywords: ["plataforma", "riser"] },
  ]},
  { id: "catering", label: "Catering extra", items: [
    { objectType: "fuente_chocolate", label: "Fuente choco.", w: 0.6, h: 0.6, keywords: ["chocolate"] },
    { objectType: "barra_movil",      label: "Barra móvil",  w: 1.5, h: 0.8, keywords: ["carrito bar"] },
    { objectType: "parrilla",         label: "Parrilla",     w: 1.5, h: 0.8, keywords: ["bbq", "grill", "barbacoa"] },
    { objectType: "fogon",            label: "Fogón",        w: 1.5, h: 0.8, keywords: ["cocina", "plancha"] },
    { objectType: "mostrador",        label: "Mostrador",    w: 3,   h: 1,   keywords: ["recepcion"] },
    { objectType: "carrito",          label: "Carrito",      w: 1,   h: 0.6, keywords: ["trolley"] },
    { objectType: "nevera",           label: "Nevera",       w: 0.6, h: 0.6, keywords: ["fridge"] },
    { objectType: "urna_regalos",     label: "Urna regalos", w: 0.5, h: 0.5, keywords: ["caja regalo"] },
  ]},
  { id: "piscina", label: "Piscina / Terraza", items: [
    { objectType: "piscina",   label: "Piscina",   w: 8,   h: 5,   keywords: ["pool", "pileta"] },
    { objectType: "lago",      label: "Lago",      w: 6,   h: 4,   keywords: ["estanque grande"] },
    { objectType: "palmera",   label: "Palmera",   w: 1.5, h: 1.5 },
    { objectType: "parrilla",  label: "Parrilla",  w: 1.5, h: 0.8, keywords: ["bbq"] },
  ]},
  { id: "decor_extra", label: "Decoración extra", items: [
    { objectType: "fuente",       label: "Fuente",      w: 1.5, h: 1.5, keywords: ["fountain"] },
    { objectType: "brasero",      label: "Brasero",     w: 0.8, h: 0.8, keywords: ["chimenea"] },
    { objectType: "jardinera",    label: "Jardinera",   w: 2,   h: 0.5, keywords: ["maceta larga"] },
    { objectType: "columna",      label: "Columna",     w: 0.4, h: 0.4 },
    { objectType: "seto",         label: "Seto",        w: 3,   h: 1,   keywords: ["arbusto lineal"] },
    { objectType: "farola",       label: "Farola",      w: 0.3, h: 0.3, keywords: ["lampara exterior"] },
    { objectType: "arco_globos",  label: "Arco globos", w: 3,   h: 3,   keywords: ["balloon arch"] },
    { objectType: "espejo_grande",label: "Espejo",      w: 0.8, h: 1.2, keywords: ["mirror"] },
    { objectType: "maceta_grande",label: "Macetón",     w: 1,   h: 0.8, keywords: ["planter"] },
    { objectType: "pino",         label: "Pino",        w: 1.5, h: 1.5, keywords: ["árbol pino"] },
    { objectType: "arbusto",      label: "Arbusto",     w: 1.5, h: 1.5, keywords: ["bush"] },
  ]},
  { id: "evento", label: "Evento / Espacio", items: [
    { objectType: "seating_chart", label: "Mapa mesas",  w: 0.8, h: 1.2, keywords: ["plano invitados", "seating chart"] },
    { objectType: "zona_kids",     label: "Zona niños",  w: 4,   h: 3,   keywords: ["kids area", "infantil"] },
    { objectType: "area_lounge",   label: "Área lounge", w: 5,   h: 4,   keywords: ["chill out"] },
    { objectType: "inflable",      label: "Inflable",    w: 4,   h: 3,   keywords: ["castillo", "tobogan"] },
    { objectType: "cabina_foto",   label: "Cabina foto", w: 1.5, h: 1.5, keywords: ["photobooth"] },
    { objectType: "proyector",     label: "Proyector",   w: 0.4, h: 0.3, keywords: ["beamer"] },
    { objectType: "generador",     label: "Generador",   w: 1.2, h: 0.6, keywords: ["luz electricidad"] },
  ]},
];

interface Props { onConfirm: (obj: EmojiObject) => void; onClose: () => void; }

export function EmojiCreatorModal({ onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [label, setLabel] = useState("");
  const [width, setWidth] = useState("1.0");
  const [height, setHeight] = useState("1.0");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GALLERY;
    return GALLERY.map((cat) => ({
      ...cat,
      items: cat.items.filter((it) =>
        it.label.toLowerCase().includes(q) ||
        cat.label.toLowerCase().includes(q) ||
        (it.keywords ?? []).some((k) => k.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [query]);

  const handleSelect = (item: GalleryItem) => {
    setSelected(item);
    if (!label || label === selected?.label) setLabel(item.label);
    setWidth(String(item.w));
    setHeight(String(item.h));
  };

  const isValid = selected !== null && label.trim().length > 0
    && parseFloat(width) > 0 && parseFloat(height) > 0;

  const handleConfirm = () => {
    if (!isValid || !selected) return;
    onConfirm({ id: `obj-${Date.now()}`, objectType: selected.objectType, label: label.trim(), physicalWidth: parseFloat(width), physicalHeight: parseFloat(height) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(74,60,50,0.18)] flex flex-col gap-0 w-[500px] max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-[var(--color-text)] text-sm">Añadir objeto al plano</h3>
          <button onClick={onClose} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors"><X size={16} /></button>
        </div>

        {/* Search */}
        <div className="px-5 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            <Search size={12} className="text-[var(--color-text)]/35 flex-shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar objeto..."
              className="flex-1 bg-transparent text-[11px] text-[var(--color-text)] placeholder:text-[var(--color-text)]/30 outline-none" />
          </div>
        </div>

        {/* Gallery grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-3">
          {filtered.length === 0 && <p className="text-xs text-[var(--color-text)]/35 text-center py-8">Sin resultados</p>}
          {filtered.map((cat) => (
            <div key={cat.id} className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text)]/40 mb-1.5">{cat.label}</p>
              <div className="grid grid-cols-6 gap-1">
                {cat.items.map((item) => (
                  <button key={item.objectType} type="button" title={item.label} onClick={() => handleSelect(item)}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition-all ${
                      selected?.objectType === item.objectType
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-2)]"
                    } text-[var(--color-accent)]`}>
                    <DecoIconPreview objectType={item.objectType} size={26} />
                    <span className="text-[9px] text-[var(--color-text)]/55 leading-tight text-center truncate w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Name + dimensions */}
        <div className="px-5 pb-5 pt-3 border-t border-[var(--color-border)] flex flex-col gap-3">
          {selected && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text)]/60 bg-[var(--color-bg-2)] rounded-lg px-3 py-2">
              <DecoIconPreview objectType={selected.objectType} size={20} />
              <span>Seleccionado: <span className="font-medium text-[var(--color-text)]">{selected.label}</span></span>
            </div>
          )}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-[var(--color-text)]/60">Nombre</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nombre del objeto"
                className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label className="text-xs text-[var(--color-text)]/60">Ancho (m)</label>
              <input type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)}
                className="border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <label className="text-xs text-[var(--color-text)]/60">Alto (m)</label>
              <input type="number" min="0.1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
                className="border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--color-accent)]" />
            </div>
          </div>
          <button onClick={handleConfirm} disabled={!isValid}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 disabled:opacity-40 disabled:cursor-not-allowed">
            {selected ? `Añadir "${label || selected.label}" al plano` : "Selecciona un objeto primero"}
          </button>
        </div>
      </div>
    </div>
  );
}
