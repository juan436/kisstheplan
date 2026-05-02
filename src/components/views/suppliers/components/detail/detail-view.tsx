"use client";

import { Check } from "lucide-react";
import type { Vendor } from "@/types";
import { STATUS_COLOR, STATUS_LABEL } from "../../constants/suppliers.constants";
import { useVendorDetail } from "../../hooks/use-vendor-detail";
import { DetailContact } from "./detail-contact";
import { DetailBudgetSection } from "./detail-budget-section";
import { DetailStaff } from "./detail-staff";
import { DetailActivity } from "./detail-activity";

interface DetailViewProps {
  vendor: Vendor;
  onBack: () => void;
  onUpdate: (v: Vendor) => void;
  onDelete: (id: string) => void;
}

export function DetailView({ vendor: initialVendor, onBack, onUpdate, onDelete }: DetailViewProps) {
  const {
    vendor, chatInput, setChatInput, sending,
    confirmDelete, setConfirmDelete, activityEndRef,
    save, handleFieldBlur, handleSendChat,
  } = useVendorDetail(initialVendor, onUpdate);

  const barColor = STATUS_COLOR[vendor.status];

  return (
    <div className="flex gap-0 h-full" style={{ maxHeight: "calc(100vh - 140px)" }}>
      {/* LEFT COLUMN */}
      <div className="flex-1 overflow-y-auto pr-6 min-w-0">
        {/* Header bar */}
        <div className="rounded-xl mb-6 px-5 py-3 flex items-center justify-between" style={{ backgroundColor: barColor }}>
          <span className="font-bold text-white text-[16px] tracking-wide">{vendor.name}</span>
          <span className="text-white/80 text-[13px] font-medium">{vendor.categories.join(" · ")}</span>
        </div>

        {/* Status toggle */}
        <div className="flex gap-3 mb-6">
          {(["confirmed", "considering"] as const).map((s) => (
            <button key={s} onClick={() => save({ status: s })} className="flex items-center gap-2 text-[13px] font-medium text-text">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ borderColor: vendor.status === s ? STATUS_COLOR[s] : "#D4C9B8", backgroundColor: vendor.status === s ? STATUS_COLOR[s] : "transparent" }}>
                {vendor.status === s && <Check size={11} className="text-white" />}
              </div>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        <DetailContact vendor={vendor} onFieldBlur={handleFieldBlur} />
        <DetailBudgetSection vendor={vendor} />
        <DetailStaff
          vendor={vendor} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete}
          onSave={save} onFieldBlur={handleFieldBlur} onDelete={onDelete}
        />
      </div>

      {/* RIGHT COLUMN */}
      <DetailActivity
        vendor={vendor} chatInput={chatInput} setChatInput={setChatInput}
        sending={sending} activityEndRef={activityEndRef}
        onBack={onBack} onSendChat={handleSendChat} onVendorUpdated={onUpdate}
      />
    </div>
  );
}
