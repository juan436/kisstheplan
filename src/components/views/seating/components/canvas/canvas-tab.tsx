"use client";

import type { SeatingPlan, Guest } from "@/types";
import { api } from "@/services";
import { WORLD_W, WORLD_H, DEFAULT_SCALE } from "../../constants/seating.constants";
import { useCanvasTab } from "../../hooks/use-canvas-tab";
import { CanvasSvg } from "./canvas-svg";
import { CanvasTabPanels } from "./canvas-tab-panels";
import { CanvasTabLegends } from "./canvas-tab-legends";
import { LeftToolPanel } from "../panels/left-tool-panel";
import { RightLibraryPanel } from "../library/right-library-panel";
import { RulerCorner, RulerTop, RulerLeft, RULER_SIZE } from "./canvas-rulers";

interface CanvasTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  mode: "layout" | "seating";
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  onUpdateTablePos: (tableId: string, posX: number, posY: number) => void;
  onUpdateTableSize: (tableId: string, d?: number, w?: number, h?: number) => void;
  onRotateTable: (tableId: string) => void;
  onAddTable: (shape: "round" | "rectangular" | "serpentine") => void;
  onDeleteTable: (tableId: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

export function CanvasTab({ plan, guests, mode, allergyColors, mealColors, onUpdateTablePos, onUpdateTableSize, onRotateTable, onAddTable, onDeleteTable, onAssignSeat }: CanvasTabProps) {
  const c = useCanvasTab({ plan, mode, onUpdateTablePos, onDeleteTable });
  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const { uploadImage } = await import("@/lib/upload");
    try { c.setBgImage(await uploadImage(file)); } catch { alert("Error al subir la imagen."); }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex rounded-xl border border-[var(--color-border)] overflow-hidden" style={{ height: "78vh", maxHeight: "78vh" }}>
        <LeftToolPanel
          mode={mode} snapEnabled={c.snapEnabled} zoningMode={c.zones.zoningMode}
          hasZones={c.zones.zones.length > 0} rulersEnabled={c.rulersEnabled}
          hasGuides={c.guides.guides.length > 0} panMode={c.panMode}
          resizeMode={c.resizeMode} deleteMode={c.deleteMode} previewEnabled={c.previewEnabled}
          hideNames={c.hideNames} showLegend={c.showLegend} showTableLegend={c.showTableLegend}
          bgImage={c.bgImage} fileInputRef={c.fileInputRef}
          onBgUpload={handleBgUpload} onClearBg={() => c.setBgImage(null)}
          onToggleSnap={() => c.setSnapEnabled((v) => !v)}
          onToggleZone={c.zones.toggleZoningMode} onClearZones={c.zones.clearZones}
          onToggleRulers={() => c.setRulersEnabled((v) => !v)}
          onClearGuides={c.guides.clearGuides} onTogglePan={c.togglePanMode}
          onToggleResize={() => { c.setResizeMode((v) => !v); c.setDeleteMode(false); c.setTableResizePanel(null); c.decos.closeDecoPanel(); }}
          onToggleDelete={() => { c.setDeleteMode((v) => !v); c.setResizeMode(false); c.setTableResizePanel(null); c.decos.closeDecoPanel(); }}
          onTogglePreview={() => { c.setPreviewEnabled((v) => !v); c.setPinnedTableId(null); }}
          onToggleHideNames={() => c.setHideNames((v) => !v)}
          onToggleLegend={() => c.setShowLegend((v) => { if (!v) c.setLegendPos({ x: 8, y: 8 }); return !v; })}
          onToggleTableLegend={() => c.setShowTableLegend((v) => !v)}
          onCenter={c.handleCenter}
        />

        <div className="flex-1 overflow-hidden" style={{ position: "relative", background: "#EDE4D9" }}>
          <div ref={c.canvasRef} className="absolute inset-0 overflow-hidden select-none"
            style={{ background: "#EDE4D9", cursor: c.cursor }}
            draggable={false} onDragStart={(e) => e.preventDefault()} onMouseDown={c.onPanMouseDown}>

            <div style={{ position: "absolute", width: WORLD_W, height: WORLD_H, transformOrigin: "0 0",
              transform: `translate(${c.offsetX + c.panOffset.x}px,${c.offsetY + c.panOffset.y}px) scale(${c.zoom})`,
              transition: c.transitioning ? "transform 0.35s cubic-bezier(0.4,0,0.2,1)" : undefined }}>
              <CanvasSvg
                plan={plan} guests={guests} scale={plan.scaleFactor ?? DEFAULT_SCALE} mode={mode}
                bgImage={c.bgImage} seatingTable={c.seatingTable} snapEnabled={c.snapEnabled}
                zones={c.zones.zones} zonePoints={c.zones.zonePoints} guides={c.guides.guides}
                zoningActive={c.isZoning} resizeMode={c.resizeMode} showLabels={c.showLabels}
                showName={c.showName} deleteMode={c.deleteMode} hideObjectLabels={c.hideNames}
                decorations={c.decos.decorations} selectedDecoId={c.decos.selectedDecoId} calibPoints={[]}
                allergyColors={allergyColors} mealColors={mealColors} hoveredTableId={c.hoveredTableId}
                onTableMouseDown={c.handleTableMouseDown} onTableClick={c.handleTableClick}
                onDecoMouseDown={c.handleDecoMouseDown}
                onDecoClick={(id, cx, cy) => {
                  if (c.deleteMode) { c.decos.handleDeleteDeco(id); return; }
                  if (mode === "seating") {
                    const d = c.decos.decorations.find((d) => d.id === id);
                    if (d?.objectType === "chair") { c.setChairSeatId((p) => p === id ? null : id); c.setSeatingTable(null); }
                    return;
                  }
                  if (!c.resizeMode) return;
                  const rect = c.canvasRef.current?.getBoundingClientRect();
                  if (rect) c.decos.handleDecoClick(id, cx, cy, rect, mode, c.zones.zoningMode, c.panMode);
                }}
                onSvgClick={c.handleSvgClick}
                onGuideMouseDown={(e, id) => { e.stopPropagation(); c.guides.startDrag(id, c.toWorld); }}
                onGuideDoubleClick={c.guides.removeGuide}
                onTableRotate={onRotateTable} onTableHover={c.handleTableHover} onTableHoverEnd={c.handleTableHoverEnd}
              />
            </div>

            <CanvasTabPanels
              mode={mode} plan={plan} guests={guests} allergyColors={allergyColors} mealColors={mealColors}
              activeTable={c.activeTable} seatingTable={c.seatingTable} chairSeatId={c.chairSeatId}
              tableResizePanel={c.tableResizePanel} previewEnabled={c.previewEnabled}
              previewTable={c.previewTable} pinnedTableId={c.pinnedTableId}
              resizeMode={c.resizeMode} canvasDims={c.canvasDims} isZoning={c.isZoning}
              zoom={c.zoom} fitZoom={c.fitZoom} decos={c.decos} zones={c.zones}
              onAssignSeat={onAssignSeat} onUpdateTableSize={onUpdateTableSize} onRotateTable={onRotateTable}
              setSeatingTable={c.setSeatingTable} setChairSeatId={c.setChairSeatId}
              setTableResizePanel={c.setTableResizePanel} setPinnedTableId={c.setPinnedTableId}
              setHoveredTableId={c.setHoveredTableId} setZoom={c.setZoom} handleCenter={c.handleCenter}
            />

            <CanvasTabLegends
              showLegend={c.showLegend} showTableLegend={c.showTableLegend}
              legendPos={c.legendPos} setLegendPos={c.setLegendPos}
              setShowTableLegend={c.setShowTableLegend}
              plan={plan} guests={guests} allergyColors={allergyColors} mealColors={mealColors}
              centerOnTable={c.centerOnTable}
            />
          </div>

          {c.rulersEnabled && (
            <>
              <RulerCorner />
              <RulerTop zoom={c.zoom} panOffset={c.panOffset} offsetX={c.offsetX - RULER_SIZE} canvasW={c.canvasDims.w}
                onMouseDown={(wx) => c.guides.addAndDrag("vertical", wx, c.toWorld)} />
              <RulerLeft zoom={c.zoom} panOffset={c.panOffset} offsetY={c.offsetY} canvasH={c.canvasDims.h}
                onMouseDown={(wy) => c.guides.addAndDrag("horizontal", wy, c.toWorld)} />
            </>
          )}
        </div>

        <RightLibraryPanel
          mode={mode} customEmojis={c.customEmojis} onAddTable={onAddTable}
          onAddDecoration={c.decos.handleAddDecoration}
          onAddCustomEmoji={(obj) => {
            const next = [...c.customEmojis, obj];
            c.setCustomEmojis(next);
            if (plan.id) api.updateSeatingPlan(plan.id, { customEmojis: next });
            c.decos.handleAddDecoration("custom_emoji", { objectType: obj.objectType, customEmoji: obj.emoji, label: obj.label, physicalWidth: obj.physicalWidth, physicalHeight: obj.physicalHeight });
          }}
          onDeleteCustomEmoji={(id) => {
            const next = c.customEmojis.filter((e) => e.id !== id);
            c.setCustomEmojis(next);
            if (plan.id) api.updateSeatingPlan(plan.id, { customEmojis: next });
          }}
        />
      </div>
    </div>
  );
}
