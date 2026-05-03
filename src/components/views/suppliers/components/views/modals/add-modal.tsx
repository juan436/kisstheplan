/**
 * AddModal
 * Qué hace: modal de alta rápida de proveedor; nombre, categorías (de BD + custom) y estado.
 * Recibe:   onClose, onCreate callback con Vendor creado.
 * Provee:   export { AddModal } — usado por SuppliersView.
 */

import { useState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import { api } from "@/services";
import { Button } from "@/components/ui/button";
import type { Vendor, VendorStatus, ExpenseCategory } from "@/types";
import type { CreateVendorData } from "@/services/api";
import { STATUS_COLOR, STATUS_LABEL } from "../../../constants/suppliers.constants";

interface AddModalProps {
  onClose: () => void;
  onCreate: (v: Vendor) => void;
}

export function AddModal({ onClose, onCreate }: AddModalProps) {
  const [name, setName] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [status, setStatus] = useState<VendorStatus>("considering");
  const [saving, setSaving] = useState(false);
  const [customCat, setCustomCat] = useState("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  useEffect(() => {
    api.getBudgetCategories()
      .then((cats: ExpenseCategory[]) => setDbCategories(cats.map((c) => c.name)))
      .catch(() => {});
  }, []);

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const addCustomCat = () => {
    const trimmed = customCat.trim();
    if (!trimmed) return;
    if (!selectedCats.includes(trimmed)) setSelectedCats((prev) => [...prev, trimmed]);
    setCustomCat("");
  };

  const handleAdd = async () => {
    if (!name.trim() || selectedCats.length === 0) return;
    setSaving(true);
    const vendor = await api.createVendor({ name: name.trim(), categories: selectedCats, status } as CreateVendorData);
    onCreate(vendor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(74,60,50,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-[20px] italic text-text mb-5">Nuevo proveedor</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-brand uppercase tracking-wider block mb-1">Nombre</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Ej: Finca Tagamanent"
              className="w-full bg-bg2 border border-border rounded-lg px-3 py-2.5 text-[14px] text-text outline-none focus:border-cta transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-brand uppercase tracking-wider block mb-2">Categorías</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {dbCategories.map((cat) => (
                <button key={cat} onClick={() => toggleCat(cat)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${selectedCats.includes(cat) ? "bg-accent text-white border-accent" : "bg-bg2 text-text border-border hover:border-accent"}`}>
                  {cat}
                </button>
              ))}
              {selectedCats.filter((c) => !dbCategories.includes(c)).map((cat) => (
                <button key={cat} onClick={() => toggleCat(cat)}
                  className="px-3 py-1 rounded-full text-[12px] font-medium border bg-cta/20 text-text border-cta/50">
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input value={customCat} onChange={(e) => setCustomCat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomCat()}
                placeholder="Añadir categoría personalizada..."
                className="flex-1 bg-bg2 border border-border rounded-lg px-3 py-1.5 text-[12px] text-text outline-none focus:border-cta transition-colors" />
              <button onClick={addCustomCat} disabled={!customCat.trim()}
                className="w-8 h-8 rounded-lg bg-bg2 border border-border flex items-center justify-center text-brand hover:border-accent hover:text-cta transition-all disabled:opacity-40">
                <Plus size={13} />
              </button>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-brand uppercase tracking-wider block mb-2">Estado</label>
            <div className="flex gap-3">
              {(["confirmed", "considering"] as VendorStatus[]).map((s) => (
                <button key={s} onClick={() => setStatus(s)} className="flex items-center gap-2 text-[13px] font-medium text-text">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: status === s ? STATUS_COLOR[s] : "#D4C9B8", backgroundColor: status === s ? STATUS_COLOR[s] : "transparent" }}>
                    {status === s && <Check size={11} className="text-white" />}
                  </div>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button variant="cta" onClick={handleAdd} disabled={saving || !name.trim() || selectedCats.length === 0} className="flex-1">
            {saving ? "Añadiendo..." : "AÑADIR"}
          </Button>
        </div>
      </div>
    </div>
  );
}
