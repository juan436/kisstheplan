"use client";

/**
 * GuestsToolbar
 * Qué hace: barra de acciones de invitados; búsqueda, filtros RSVP/grupo, alta rápida, columnas, import/export excel.
 * Recibe:   props de useGuests (búsqueda, filtros, refs, handlers).
 * Provee:   export { GuestsToolbar }.
 */

import { useRef } from "react";
import { UserPlus, Upload, Download, Search, X, Users, SlidersHorizontal, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GuestGroup } from "@/types";
import { RSVP_FILTERS, ALL_COLS, type ColKey } from "../constants/guests.constants";

interface GuestsToolbarProps {
  groups: GuestGroup[];
  setShowAddModal: (v: boolean) => void;
  setShowGroupsModal: (v: boolean) => void;
  setShowConfigModal: (v: boolean) => void;
  searchQuery: string; setSearchQuery: (v: string) => void;
  rsvpFilter: string; setRsvpFilter: (v: string) => void;
  groupFilter: string; setGroupFilter: (v: string) => void;
  showColMenu: boolean; setShowColMenu: (v: boolean) => void;
  show: (col: ColKey) => boolean; toggleCol: (col: ColKey) => void;
  colMenuRef: React.RefObject<HTMLDivElement | null>;
  showQuickAdd: boolean; setShowQuickAdd: (v: boolean) => void;
  quickName: string; setQuickName: (v: string) => void;
  quickGroupId: string; setQuickGroupId: (v: string) => void;
  quickSaving: boolean; handleQuickAdd: () => void;
  quickAddRef: React.RefObject<HTMLDivElement | null>;
  excelInputRef: React.RefObject<HTMLInputElement | null>;
  importingExcel: boolean; importError: string; setImportError: (v: string) => void;
  handleExcelFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportExcel: () => void;
}

export function GuestsToolbar({ groups, setShowAddModal, setShowGroupsModal, setShowConfigModal, searchQuery, setSearchQuery, rsvpFilter, setRsvpFilter, groupFilter, setGroupFilter, showColMenu, setShowColMenu, show, toggleCol, colMenuRef, showQuickAdd, setShowQuickAdd, quickName, setQuickName, quickGroupId, setQuickGroupId, quickSaving, handleQuickAdd, quickAddRef, excelInputRef, importingExcel, importError, setImportError, handleExcelFile, onExportExcel }: GuestsToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative" ref={quickAddRef}>
            <Button variant="cta" size="sm" className="gap-2" onClick={() => setShowQuickAdd(!showQuickAdd)}>
              <UserPlus size={14} />Añadir invitado
            </Button>
            {showQuickAdd && (
              <div className="absolute left-0 top-10 z-30 bg-white border border-border rounded-xl shadow-dropdown p-4 w-72 max-w-[calc(100vw-2rem)] animate-fade-in">
                <p className="text-[12px] font-semibold text-text/50 uppercase tracking-wider mb-3">Alta rápida</p>
                <input autoFocus placeholder="Nombre del invitado" value={quickName} onChange={(e) => setQuickName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleQuickAdd(); }}
                  className="w-full bg-[#f2efe9] border-none rounded-xl px-4 py-2.5 text-[13px] text-text placeholder:text-text/30 outline-none focus:ring-2 focus:ring-cta/30 mb-2" />
                {groups.length > 0 && (
                  <select value={quickGroupId} onChange={(e) => setQuickGroupId(e.target.value)}
                    className="w-full bg-[#f2efe9] border-none rounded-xl px-4 py-2.5 text-[13px] text-text outline-none mb-3">
                    <option value="">Sin grupo</option>
                    {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text/30">Enter para guardar</span>
                  <button onClick={handleQuickAdd} disabled={!quickName.trim() || quickSaving}
                    className="px-4 py-1.5 bg-[#CBA978] hover:bg-[#b08f5d] disabled:opacity-40 text-white text-[12px] font-bold rounded-lg transition-colors">
                    {quickSaving ? "..." : "Guardar"}
                  </button>
                </div>
                <div className="border-t border-border mt-3 pt-3">
                  <button onClick={() => { setShowQuickAdd(false); setShowAddModal(true); }} className="text-[12px] text-cta hover:underline font-medium">
                    Formulario completo →
                  </button>
                </div>
              </div>
            )}
          </div>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowGroupsModal(true)}>
            <Users size={14} />Grupos
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowConfigModal(true)}>
            <SlidersHorizontal size={14} />Platos/Restricciones
          </Button>
          <input ref={excelInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelFile} />
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => excelInputRef.current?.click()} disabled={importingExcel}>
            <Upload size={14} />{importingExcel ? "Importando..." : "Importar excel"}
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={onExportExcel}>
            <Download size={14} />Exportar excel
          </Button>
        </div>
      </div>

      {importError && (
        <div className="mb-3 flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
          <span className="text-[12px] text-danger">{importError}</span>
          <button onClick={() => setImportError("")} className="ml-auto text-brand hover:text-danger"><X size={13} /></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
          <input type="text" placeholder="Buscar invitado..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border rounded-lg pl-9 pr-8 py-2 text-[13px] text-text placeholder:text-brand outline-none focus:border-cta transition-colors" />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-brand hover:text-text"><X size={14} /></button>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {RSVP_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setRsvpFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${rsvpFilter === f.value ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>
              {f.label}
            </button>
          ))}
          {groups.length > 0 && (
            <>
              <span className="text-border mx-1">|</span>
              <button onClick={() => setGroupFilter("")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${!groupFilter ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>Todos</button>
              {groups.map((g) => (
                <button key={g.id} onClick={() => setGroupFilter(g.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${groupFilter === g.id ? "bg-accent text-white" : "bg-bg2 text-text hover:bg-bg3"}`}>
                  {g.name}
                </button>
              ))}
            </>
          )}
        </div>
        <div className="relative" ref={colMenuRef}>
          <button onClick={() => setShowColMenu(!showColMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-text hover:bg-bg2 transition-colors">
            <Columns size={14} />Columnas
          </button>
          {showColMenu && (
            <div className="absolute right-0 top-9 bg-white border border-border rounded-xl shadow-dropdown p-3 z-20 min-w-[160px] space-y-1 animate-fade-in">
              {ALL_COLS.map((col) => (
                <label key={col.key} className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-bg2 text-[13px]">
                  <input type="checkbox" checked={show(col.key)} onChange={() => toggleCol(col.key)} className="w-3.5 h-3.5 accent-cta" />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
