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
  excelInputRef: React.RefObject<HTMLInputElement | null>;
  importingExcel: boolean; importError: string; setImportError: (v: string) => void;
  handleExcelFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportExcel: () => void;
}

export function GuestsToolbar({ groups, setShowAddModal, setShowGroupsModal, setShowConfigModal, searchQuery, setSearchQuery, rsvpFilter, setRsvpFilter, groupFilter, setGroupFilter, showColMenu, setShowColMenu, show, toggleCol, colMenuRef, excelInputRef, importingExcel, importError, setImportError, handleExcelFile, onExportExcel }: GuestsToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="cta" size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
            <UserPlus size={14} />Añadir invitado
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowGroupsModal(true)}>
            <Users size={14} />Grupos
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowConfigModal(true)}>
            <SlidersHorizontal size={14} />Restricciones / Transporte
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
