import { Check, Paperclip, Trash2 } from "lucide-react";
import type { Vendor } from "@/types";
import { STATUS_COLOR } from "../constants/suppliers.constants";

interface DetailStaffProps {
  vendor: Vendor;
  confirmDelete: boolean;
  setConfirmDelete: (v: boolean) => void;
  onSave: (data: Record<string, unknown>) => void;
  onFieldBlur: (field: string, value: string | boolean | number) => void;
  onDelete: (id: string) => void;
}

export function DetailStaff({ vendor, confirmDelete, setConfirmDelete, onSave, onFieldBlur, onDelete }: DetailStaffProps) {
  return (
    <>
      <div className="bg-white rounded-xl p-5 mb-5 shadow-card space-y-4">
        <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Gestión técnica</h3>

        {/* Contract */}
        <div className="flex items-center gap-3">
          <button onClick={() => onSave({ contractUrl: vendor.contractUrl ? "" : "pending" })}
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
            style={{ borderColor: vendor.contractUrl ? "#4A773C" : "#D4C9B8", backgroundColor: vendor.contractUrl ? "#4A773C" : "transparent" }}>
            {vendor.contractUrl && <Check size={10} className="text-white" />}
          </button>
          <span className="text-[13px] text-text">Contrato firmado</span>
          <button className="flex items-center gap-1 text-[12px] text-cta hover:underline ml-auto">
            <Paperclip size={12} />
            {vendor.contractUrl ? "Ver contrato" : "Adjuntar"}
          </button>
        </div>

        {/* Staff menu */}
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSave({ needsStaffMenu: !vendor.needsStaffMenu })}
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
              style={{ borderColor: vendor.needsStaffMenu ? STATUS_COLOR.confirmed : "#D4C9B8", backgroundColor: vendor.needsStaffMenu ? STATUS_COLOR.confirmed : "transparent" }}>
              {vendor.needsStaffMenu && <Check size={10} className="text-white" />}
            </button>
            <span className="text-[13px] text-text">Necesita menú staff</span>
          </div>
          {vendor.needsStaffMenu && (
            <div className="mt-3 pl-8 space-y-2">
              <div className="flex items-center gap-3">
                <label className="text-[11px] font-bold text-brand uppercase tracking-wider w-32">¿Cuántas personas?</label>
                <input type="number" defaultValue={vendor.staffCount || ""}
                  onBlur={(e) => onFieldBlur("staffCount", Number(e.target.value))}
                  className="w-16 bg-bg2 border border-border rounded px-2 py-1 text-[13px] text-text outline-none focus:border-cta" />
              </div>
              <div className="flex items-start gap-3">
                <label className="text-[11px] font-bold text-brand uppercase tracking-wider w-32 pt-1">Alergias / Restricciones</label>
                <input defaultValue={vendor.staffAllergies || ""}
                  onBlur={(e) => onFieldBlur("staffAllergies", e.target.value)}
                  placeholder="Ej: Gluten (2), Lactosa (1)..."
                  className="flex-1 bg-bg2 border border-border rounded px-2 py-1 text-[13px] text-text outline-none focus:border-cta" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl p-5 mb-5 shadow-card">
        <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Notas</h3>
        <textarea defaultValue={vendor.notes || ""} onBlur={(e) => onFieldBlur("notes", e.target.value)}
          placeholder="Área para escribir anotaciones..." rows={5}
          className="w-full bg-bg2 rounded-lg px-3 py-2.5 text-[13px] text-text placeholder:text-brand outline-none focus:ring-1 focus:ring-cta/40 resize-none transition-all" />
      </div>

      {/* Danger zone */}
      <div className="pb-8">
        {confirmDelete ? (
          <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
            <span className="text-[13px] text-text flex-1">¿Eliminar este proveedor?</span>
            <button onClick={() => onDelete(vendor.id)} className="text-[12px] bg-danger text-white px-3 py-1 rounded-lg">Eliminar</button>
            <button onClick={() => setConfirmDelete(false)} className="text-[12px] text-brand hover:text-text">Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 text-[12px] text-brand hover:text-danger transition-colors">
            <Trash2 size={13} />
            Eliminar proveedor
          </button>
        )}
      </div>
    </>
  );
}
