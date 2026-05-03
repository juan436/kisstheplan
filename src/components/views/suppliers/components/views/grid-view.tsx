/**
 * GridView
 * Qué hace: vista de proveedores agrupados por categoría en grid de tarjetas.
 * Recibe:   vendors[], onOpen, onDelete.
 * Provee:   export { GridView }.
 */

import { FileText } from "lucide-react";
import type { Vendor } from "@/types";
import { VendorCard } from "./card";

interface GridViewProps {
  vendors: Vendor[];
  onOpen: (v: Vendor) => void;
  onDelete: (id: string) => void;
}

export function GridView({ vendors, onOpen, onDelete }: GridViewProps) {
  const grouped: Record<string, Vendor[]> = {};
  for (const v of vendors) {
    const cats = v.categories.length > 0 ? v.categories : ["Sin categoría"];
    for (const cat of cats) {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(v);
    }
  }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-bg2 flex items-center justify-center mb-4">
          <FileText size={24} className="text-brand" />
        </div>
        <p className="text-text font-medium text-[15px]">Sin proveedores aún</p>
        <p className="text-brand text-[13px] mt-1">Añade tu primer proveedor para empezar</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([cat, catVendors]) => (
        <div key={cat}>
          <h3 className="text-[13px] font-semibold text-brand uppercase tracking-wider mb-3">{cat}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {catVendors.map((v) => <VendorCard key={v.id} vendor={v} onOpen={onOpen} onDelete={onDelete} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
