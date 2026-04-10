import { useState } from "react";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Vendor } from "@/types";
import { STATUS_COLOR, STATUS_LABEL } from "../constants/suppliers.constants";

interface VendorCardProps {
  vendor: Vendor;
  onOpen: (v: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorCard({ vendor, onOpen, onDelete }: VendorCardProps) {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const total = vendor.payments.reduce((s, p) => s + p.amount, 0);
  const paid = vendor.payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const next = vendor.payments
    .filter((p) => !p.paid && p.dueDate)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))[0];

  return (
    <div className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-elevated bg-white relative"
      style={{ boxShadow: "0 4px 16px rgba(74,60,50,0.08)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
      onClick={() => onOpen(vendor)}>
      <div className="h-2" style={{ backgroundColor: STATUS_COLOR[vendor.status] }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-semibold text-text text-[14px] leading-tight">{vendor.name}</p>
            <p className="text-[11px] text-brand mt-0.5">{vendor.categories.join(", ")}</p>
          </div>
          <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${STATUS_COLOR[vendor.status]}30`, color: vendor.status === "confirmed" ? "#8c6b30" : "#7a6a5a" }}>
            {STATUS_LABEL[vendor.status]}
          </span>
        </div>
        {total > 0 && (
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between text-[12px]"><span className="text-brand">Total</span><span className="font-semibold text-text">{formatCurrency(total)}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-brand">Pagado</span><span className="text-[#4A773C] font-medium">{formatCurrency(paid)}</span></div>
            {next && <div className="flex justify-between text-[12px]"><span className="text-brand">Próximo pago</span><span className="text-text">{formatCurrency(next.amount)}</span></div>}
          </div>
        )}
      </div>
      {(hovered || vendor.status === "considering") && (
        <div className="absolute bottom-3 right-3" onClick={(e) => e.stopPropagation()}>
          {confirming ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(vendor.id)} className="text-[11px] bg-danger text-white px-2 py-0.5 rounded-md hover:bg-danger/80">Eliminar</button>
              <button onClick={() => setConfirming(false)} className="text-[11px] text-brand hover:text-text px-1">No</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="w-7 h-7 rounded-full bg-bg2 flex items-center justify-center text-brand hover:text-danger hover:bg-danger/10 transition-all">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
