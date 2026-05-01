"use client";

import { AnimatePresence } from "framer-motion";
import type { SeatingPlan, Guest, TableSeat } from "@/types";
import type { useCanvasDecorations } from "../../hooks/use-canvas-decorations";
import type { useCanvasZones } from "../../hooks/use-canvas-zones";
import { SeatingPanel } from "../panels/seating-panel";
import { ChairSeatPanel } from "../panels/chair-seat-panel";
import { DecorationResizePanel } from "../panels/decoration-resize-panel";
import { TableResizePanel } from "../tables/table-resize-panel";
import { TablePreviewPanel } from "../tables/table-preview-panel";
import { ZoomControls } from "./zoom-controls";
import { ZoneCreationOverlay } from "../overlays/zone-creation-overlay";

interface CanvasTabPanelsProps {
  mode: "layout" | "seating";
  plan: SeatingPlan;
  guests: Guest[];
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  activeTable: TableSeat | null | undefined;
  seatingTable: string | null;
  chairSeatId: string | null;
  tableResizePanel: { tableId: string; screenX: number; screenY: number } | null;
  previewEnabled: boolean;
  previewTable: TableSeat | null;
  pinnedTableId: string | null;
  resizeMode: boolean;
  canvasDims: { w: number; h: number };
  isZoning: boolean;
  zoom: number;
  fitZoom: number;
  decos: ReturnType<typeof useCanvasDecorations>;
  zones: ReturnType<typeof useCanvasZones>;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
  onUpdateTableSize: (tableId: string, d?: number, w?: number, h?: number) => void;
  onRotateTable: (tableId: string) => void;
  setSeatingTable: (id: string | null) => void;
  setChairSeatId: (id: string | null) => void;
  setTableResizePanel: (v: { tableId: string; screenX: number; screenY: number } | null) => void;
  setPinnedTableId: (id: string | null) => void;
  setHoveredTableId: (id: string | null) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  handleCenter: () => void;
}

export function CanvasTabPanels({ mode, plan, guests, allergyColors, mealColors, activeTable, seatingTable, chairSeatId, tableResizePanel, previewEnabled, previewTable, pinnedTableId, resizeMode, canvasDims, isZoning, zoom, fitZoom, decos, zones, onAssignSeat, onUpdateTableSize, onRotateTable, setSeatingTable, setChairSeatId, setTableResizePanel, setPinnedTableId, setHoveredTableId, setZoom, handleCenter }: CanvasTabPanelsProps) {
  const chairDeco = chairSeatId ? decos.decorations.find((d) => d.id === chairSeatId) : null;
  const resizeTable = tableResizePanel ? plan.tables.find((t) => t.id === tableResizePanel.tableId) : null;
  const resizeDeco  = decos.selectedDecoId ? decos.decorations.find((d) => d.id === decos.selectedDecoId) : null;

  return (
    <>
      <AnimatePresence>
        {mode === "seating" && activeTable && (
          <SeatingPanel table={activeTable} guests={guests}
            onClose={() => setSeatingTable(null)}
            onUnassign={(sn) => onAssignSeat(activeTable.id, sn, undefined)} />
        )}
        {mode === "seating" && chairSeatId && chairDeco && (
          <ChairSeatPanel deco={chairDeco} guests={guests}
            onAssign={(gId) => { decos.handleAssignChairGuest(chairSeatId, gId); if (gId) setChairSeatId(null); }}
            onClose={() => setChairSeatId(null)} />
        )}
      </AnimatePresence>

      {mode === "layout" && resizeMode && tableResizePanel && resizeTable && (
        <TableResizePanel table={resizeTable}
          screenX={tableResizePanel.screenX} screenY={tableResizePanel.screenY}
          canvasH={canvasDims.h}
          onApply={(id, d, w, h) => { onUpdateTableSize(id, d, w, h); setTableResizePanel(null); }}
          onRotate={onRotateTable}
          onClose={() => setTableResizePanel(null)} />
      )}

      {mode === "layout" && decos.selectedDecoId && decos.decoPanel && resizeDeco && (
        <DecorationResizePanel deco={resizeDeco}
          screenX={decos.decoPanel.screenX} screenY={decos.decoPanel.screenY}
          canvasH={canvasDims.h} onApply={decos.handleDecoApply} onClose={decos.closeDecoPanel} />
      )}

      <ZoomControls zoom={zoom} fitZoom={fitZoom} onZoomChange={setZoom} onCenter={handleCenter} />

      {previewEnabled && (
        <TablePreviewPanel table={previewTable} guests={guests} allergyColors={allergyColors} mealColors={mealColors}
          onClose={pinnedTableId ? () => { setPinnedTableId(null); setHoveredTableId(null); } : undefined} />
      )}

      {isZoning && (
        <ZoneCreationOverlay pointCount={zones.zonePoints.length} pendingPoints={zones.pendingPoints}
          onConfirm={zones.confirmZone} onCancel={zones.cancelPendingZone} />
      )}
    </>
  );
}
