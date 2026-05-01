"use client";

import type { ReactNode } from "react";
import type { DecorationType } from "@/types";
import {
  IconRoundTable, IconRectTable, IconSerpentineTable,
  IconChair, IconBench,
  IconArch, IconRunner, IconDanceFloor, IconStage, IconDjBooth, IconPhotocall, IconPiano,
  IconBar, IconCandyBar, IconGiftTable, IconCoatCheck, IconBathroom, IconEntrance,
  IconSofa, IconFlowers, IconTree, IconCandelabra, IconCarpet,
  IconSpeaker, IconScreen, IconOutlet,
} from "./library-icons";

export interface LibraryItem {
  label: string;
  icon: ReactNode;
  isTable?: "round" | "rectangular" | "serpentine";
  decoType?: DecorationType;
  objectType?: string;
  physicalWidth?: number;
  physicalHeight?: number;
  keywords?: string[];
}

export const ICON_SIZE = 26;

export const CATEGORIES: { id: string; label: string; items: LibraryItem[] }[] = [
  {
    id: "tables", label: "Mesas",
    items: [
      { label: "Redonda",     icon: <IconRoundTable size={ICON_SIZE} />,      isTable: "round" },
      { label: "Rectangular", icon: <IconRectTable size={ICON_SIZE} />,       isTable: "rectangular" },
      { label: "Serpentina",  icon: <IconSerpentineTable size={ICON_SIZE} />, isTable: "serpentine" },
    ],
  },
  {
    id: "seating", label: "Asientos",
    items: [
      { label: "Silla", icon: <IconChair size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "chair", physicalWidth: 0.5, physicalHeight: 0.5 },
      { label: "Banco", icon: <IconBench size={ICON_SIZE} />, decoType: "custom_emoji", objectType: "bench", physicalWidth: 2,   physicalHeight: 0.5, keywords: ["pew"] },
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
      { label: "Photocall", icon: <IconPhotocall size={ICON_SIZE} />,  decoType: "custom_emoji", objectType: "photocall",  physicalWidth: 2.5, physicalHeight: 2,   keywords: ["fotos", "photo booth"] },
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
