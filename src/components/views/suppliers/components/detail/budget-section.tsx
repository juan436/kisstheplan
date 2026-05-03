/**
 * DetailBudgetSection
 * QuÃ© hace: secciÃ³n de presupuesto vinculada al proveedor.
 * Recibe:   vendor.
 * Provee:   export { DetailBudgetSection }.
 */
"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { api } from "@/services";
import { useVendorBudget } from "../../hooks/use-vendor-budget";
import { CategoryBlock } from "../budget/category-block";
import { PaymentModal } from "../budget/payment-modal";
import { AllPaymentsModal } from "../budget/all-payments-modal";
import type { Vendor } from "@/types";

interface DetailBudgetSectionProps {
  vendor: Vendor;
}

export function DetailBudgetSection({ vendor }: DetailBudgetSectionProps) {
  const { categories, loading, refresh, addItem, linkItem, editState } = useVendorBudget(
    vendor.id,
    vendor.name,
    vendor.categories,
  );
  const [vendors, setVendors]       = useState<Vendor[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [allPaymentsOpen, setAllPaymentsOpen] = useState(false);

  useEffect(() => {
    api.getVendors().then((data) => setVendors(data as Vendor[])).catch(() => {});
  }, []);
  const selectedCat = categories.find((c) => c.id === selectedCatId) ?? null;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-start gap-4 mb-3">
        <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest">Presupuesto</h3>
        {!loading && categories.length > 0 && (
          <button
            onClick={() => setAllPaymentsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cta/10 hover:bg-cta/20 border border-cta/30 hover:border-cta/60 text-cta text-[11px] font-semibold uppercase tracking-wider transition-all group"
          >
            <CalendarDays size={12} className="transition-transform group-hover:scale-110" />
            Pagos
          </button>
        )}
      </div>

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] gap-2 px-4 mb-2">
          <div />
          {["Estimado", "Real", "Diferencia", "Pagado", "Pendiente"].map((label) => (
            <div key={label} className="flex justify-center">
              <span className="px-2 py-0.5 rounded-full bg-[#e8e0d8] text-[#866857] text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-[13px] text-brand text-center py-4">Cargando...</p>}

      {!loading && categories.length === 0 && (
        <p className="text-[13px] text-brand text-center py-4">Sin categorÃ­as de presupuesto vinculadas</p>
      )}

      {!loading && categories.map((cat) => (
        <CategoryBlock
          key={cat.id}
          category={cat}
          currentVendorId={vendor.id}
          vendors={vendors}
          editState={editState}
          onLinkVendor={linkItem}
          onAddItem={addItem}
          onOpenPayments={setSelectedCatId}
        />
      ))}

      {selectedCat && (
        <PaymentModal
          open={true}
          onClose={() => setSelectedCatId(null)}
          category={selectedCat}
          currentVendorId={vendor.id}
          onRefresh={refresh}
        />
      )}

      {allPaymentsOpen && (
        <AllPaymentsModal
          open={true}
          onClose={() => setAllPaymentsOpen(false)}
          categories={categories}
          currentVendorId={vendor.id}
          vendorName={vendor.name}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}



