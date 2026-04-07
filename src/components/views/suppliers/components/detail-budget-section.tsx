"use client";

import { useState, useEffect } from "react";
import { api } from "@/services";
import { useVendorBudget } from "../hooks/use-vendor-budget";
import { VendorCategoryBlock } from "./vendor-category-block";
import { VendorPaymentModal } from "./vendor-payment-modal";
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

  useEffect(() => {
    api.getVendors().then((data) => setVendors(data as Vendor[])).catch(() => {});
  }, []);
  const selectedCat = categories.find((c) => c.id === selectedCatId) ?? null;

  return (
    <div className="mb-5">
      <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Presupuesto</h3>

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
        <p className="text-[13px] text-brand text-center py-4">Sin categorías de presupuesto vinculadas</p>
      )}

      {!loading && categories.map((cat) => (
        <VendorCategoryBlock
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
        <VendorPaymentModal
          open={true}
          onClose={() => setSelectedCatId(null)}
          category={selectedCat}
          currentVendorId={vendor.id}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
