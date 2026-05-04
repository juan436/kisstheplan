/**
 * ProveedoresPage
 *
 * Qué hace: Componente principal del módulo de proveedores que gestiona el listado, filtrado, creación y vista de detalle.
 * Recibe:   No recibe props directas (usa hooks para navegación y estado).
 * Provee:   La interfaz principal con alternancia entre vistas (mosaico, listado) y gestión de proveedores.
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { FileText, Plus, List, LayoutGrid, Grid3X3 } from "lucide-react";
import type { Vendor } from "@/types";
import { type View, type GridMode } from "./constants/suppliers.constants";
import { GridView } from "./components/views/grid-view";
import { FlatGridView } from "./components/views/flat-grid-view";
import { ListView } from "./components/views/list-view";
import { AddModal } from "./components/views/modals/add-modal";
import { DetailView } from "./components/detail/view";

export default function ProveedoresPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [view, setView] = useState<View>("grid");
  const [gridMode, setGridMode] = useState<GridMode>("category");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { pendingVendorId, clearPendingVendorId } = useNavigation();

  const load = useCallback(async () => {
    const data = await api.getVendors();
    setVendors(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (pendingVendorId && vendors.length > 0) {
      const vendor = vendors.find((v) => v.id === pendingVendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setView("detail");
        clearPendingVendorId();
      }
    }
  }, [pendingVendorId, vendors, clearPendingVendorId]);

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-[20px] sm:text-[26px] italic text-text">Proveedores</h1>
        <div className="flex flex-wrap items-center gap-3">
          {view === "grid" && (
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setGridMode("category")}
                className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 transition-colors ${gridMode === "category" ? "bg-accent text-white" : "text-brand hover:text-text"}`}>
                <LayoutGrid size={13} />
                Por categoría
              </button>
              <button
                onClick={() => setGridMode("flat")}
                className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 transition-colors border-l border-border ${gridMode === "flat" ? "bg-accent text-white" : "text-brand hover:text-text"}`}>
                <Grid3X3 size={13} />
                Todos
              </button>
            </div>
          )}
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

      {view === "list" ? (
        <ListView vendors={vendors} onOpen={openDetail} />
      ) : gridMode === "flat" ? (
        <FlatGridView vendors={vendors} onOpen={openDetail} onDelete={handleDelete} />
      ) : (
        <GridView vendors={vendors} onOpen={openDetail} onDelete={handleDelete} />
      )}

      {showAddModal && (
        <AddModal onClose={() => setShowAddModal(false)} onCreate={handleVendorCreated} />
      )}
    </div>
  );
}





