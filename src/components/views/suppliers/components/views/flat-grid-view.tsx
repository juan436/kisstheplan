import { FileText } from "lucide-react";
import type { Vendor } from "@/types";
import { VendorCard } from "./vendor-card";

interface FlatGridViewProps {
  vendors: Vendor[];
  onOpen: (v: Vendor) => void;
  onDelete: (id: string) => void;
}

export function FlatGridView({ vendors, onOpen, onDelete }: FlatGridViewProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {vendors.map((v) => (
        <VendorCard key={v.id} vendor={v} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  );
}
