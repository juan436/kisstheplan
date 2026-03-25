import { FileText } from "lucide-react";
import type { Vendor } from "@/types";
import { STATUS_COLOR } from "./suppliers-constants";

interface ListViewProps {
  vendors: Vendor[];
  onOpen: (v: Vendor) => void;
}

export function ListView({ vendors, onOpen }: ListViewProps) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-2 rounded-full"
          style={{ backgroundColor: "#8c6f5f" }}>
          <FileText size={14} />Exportar PDF
        </button>
      </div>
      <div className="bg-white rounded-xl overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Proveedor", "Categoría", "Persona de contacto", "Teléfono", "E-mail", "Menú Staff"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-brand uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => (
              <tr key={v.id} onClick={() => onOpen(v)}
                className={`cursor-pointer hover:bg-bg2 transition-colors ${i !== vendors.length - 1 ? "border-b border-border/50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLOR[v.status] }} />
                    <span className="text-[13px] font-semibold text-text">{v.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-brand">{v.categories.join(", ")}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.contactName || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.phone || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.email || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-text">{v.needsStaffMenu ? `Sí, ${v.staffCount || "?"}` : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {vendors.length === 0 && <div className="text-center py-12 text-brand text-[13px]">Sin proveedores</div>}
      </div>
    </div>
  );
}
