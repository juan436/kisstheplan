"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { Button } from "@/components/ui/button";
import { FileText, Plus, List, LayoutGrid } from "lucide-react";
import type { Vendor } from "@/types";
import { type View } from "./suppliers-constants";
import { GridView } from "./grid-view";
import { ListView } from "./list-view";
import { QuickAddModal } from "./quick-add-modal";
import { DetailView } from "./detail-view";

export default function ProveedoresPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [view, setView] = useState<View>("grid");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await api.getVendors();
    setVendors(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDetail = (v: Vendor) => { setSelectedVendor(v); setView("detail"); };

  const handleVendorCreated = async (vendor: Vendor) => {
    await load();
    setShowAddModal(false);
    setSelectedVendor(vendor);
    setView("detail");
  };

  const handleVendorUpdated = async (updated: Vendor) => {
    setSelectedVendor(updated);
    await load();
  };

  const handleDelete = async (id: string) => {
    await api.deleteVendor(id);
    await load();
    if (view === "detail") { setView("grid"); setSelectedVendor(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-brand text-[14px]">Cargando...</div>
      </div>
    );
  }

  if (view === "detail" && selectedVendor) {
    return (
      <DetailView
        vendor={selectedVendor}
        onBack={() => { setView("grid"); setSelectedVendor(null); }}
        onUpdate={handleVendorUpdated}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[26px] italic text-text">Proveedores</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="flex items-center gap-1.5 text-[13px] text-brand hover:text-text transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-accent">
            {view === "grid" ? <List size={14} /> : <LayoutGrid size={14} />}
            {view === "grid" ? "Ver listado" : "Ver mosaico"}
          </button>
          <Button variant="cta" size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Añadir proveedor
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <GridView vendors={vendors} onOpen={openDetail} onDelete={handleDelete} />
      ) : (
        <ListView vendors={vendors} onOpen={openDetail} />
      )}

      {showAddModal && (
        <QuickAddModal onClose={() => setShowAddModal(false)} onCreate={handleVendorCreated} />
      )}
    </div>
  );
}
