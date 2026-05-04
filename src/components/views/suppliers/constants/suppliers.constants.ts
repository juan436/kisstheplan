/**
 * Constantes de Proveedores
 *
 * Qué hace: Define categorías, colores de estado, etiquetas y tipos de vista para el módulo de proveedores.
 * Recibe:   N/A
 * Provee:   VENDOR_CATEGORIES, STATUS_COLOR, STATUS_LABEL, View, GridMode.
 */
import type { VendorStatus } from "@/types";

export const VENDOR_CATEGORIES = [
  "Finca", "Catering", "Fotografía", "Vídeo", "Música",
  "Decoración", "Sonido", "Transporte", "Flores", "Belleza", "Papelería",
];

export const STATUS_COLOR: Record<VendorStatus, string> = {
  confirmed: "#CBA978",
  considering: "#D4BFB0",
};

export const STATUS_LABEL: Record<VendorStatus, string> = {
  confirmed: "Confirmado",
  considering: "Considerando",
};

export type View = "grid" | "list" | "detail";
export type GridMode = "category" | "flat";
