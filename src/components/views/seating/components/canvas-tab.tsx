"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { uploadImage } from "@/lib/upload";
import type { SeatingPlan, Guest, EmojiObject } from "@/types";
import { api } from "@/services";
import { WORLD_W, WORLD_H, DEFAULT_SCALE } from "../constants/seating.constants";
import { clampPan } from "../helpers/seating.helpers";
import { useCanvasDrag } from "../hooks/use-canvas-drag";
import { useCanvasPan } from "../hooks/use-canvas-pan";
import { useCanvasZoom } from "../hooks/use-canvas-zoom";
import { useCanvasZones } from "../hooks/use-canvas-zones";
import { useCanvasDecorations } from "../hooks/use-canvas-decorations";
import { useCanvasGuides } from "../hooks/use-canvas-guides";
import { CanvasSvg } from "./canvas-svg";
import { LeftToolPanel } from "./left-tool-panel";
import { RightLibraryPanel } from "./right-library-panel";
import { RulerCorner, RulerTop, RulerLeft, RULER_SIZE } from "./canvas-rulers";
import { ZoneCreationOverlay } from "./zone-creation-overlay";
import { DietLegend } from "./diet-legend";
import { TableLegend } from "./table-legend";
import { SeatingPanel } from "./seating-panel";
import { ChairSeatPanel } from "./chair-seat-panel";
import { ZoomControls } from "./zoom-controls";
import { DecorationResizePanel } from "./decoration-resize-panel";
import { TableResizePanel } from "./table-resize-panel";
import { TablePreviewPanel } from "./table-preview-panel";
import { GripVertical } from "lucide-react";

interface CanvasTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  mode: "layout" | "seating";
  allergyColors: Record<string, string>;
  mealColors: Record<string, string>;
  onUpdateTablePos: (tableId: string, posX: number, posY: number) => void;
  onUpdateTableSize: (tableId: string, physicalDiameter?: number, physicalWidth?: number, physicalHeight?: number) => void;
  onRotateTable: (tableId: string) => void;
  onAddTable: (shape: "round" | "rectangular" | "serpentine") => void;
  onDeleteTable: (tableId: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

export function CanvasTab({ plan, guests, mode, allergyColors, mealColors, onUpdateTablePos, onUpdateTableSize, onRotateTable, onAddTable, onDeleteTable, onAssignSeat }: CanvasTabProps) {
  const [zoom, setZoom] = useState(1.0);
  const [fitZoom, setFitZoom] = useState(0.7);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [rulersEnabled, setRulersEnabled] = useState(false);
  const [resizeMode, setResizeMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [seatingTable, setSeatingTable] = useState<string | null>(null);
  const [chairSeatId, setChairSeatId] = useState<string | null>(null);
  const [tableResizePanel, setTableResizePanel] = useState<{ tableId: string; screenX: number; screenY: number } | null>(null);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);
  const [pinnedTableId, setPinnedTableId] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [legendPos, setLegendPos] = useState({ x: 8, y: 8 });
  const [showTableLegend, setShowTableLegend] = useState(false);
  const legendDragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(plan.backgroundImageUrl ?? "/images/finca.png");
  // Init: strip legacy emoji-only objects (no objectType) — they were created before the SVG gallery
  const [customEmojis, setCustomEmojis] = useState<EmojiObject[]>(() =>
    (plan.customEmojis ?? []).filter((e) => !!e.objectType)
  );
  const [canvasDims, setCanvasDims] = useState({ w: WORLD_W, h: 600 });
  const canvasRef  = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always-current clamp function passed to pan/zoom hooks
  const zoomRef      = useRef(zoom);
  const canvasDimsRef = useRef(canvasDims);
  zoomRef.current      = zoom;
  canvasDimsRef.current = canvasDims;
  const clampRef = useRef((pan: { x: number; y: number }) =>
    clampPan(pan, zoomRef.current, canvasDimsRef.current.w, canvasDimsRef.current.h)
  );

  const { panMode, togglePanMode, panOffset, onPanMouseDown, resetPan, isPanning, setPanOffset } = useCanvasPan(clampRef);
  const { transitioning, handleCenter } = useCanvasZoom({ canvasRef, fitZoom, zoom, setZoom, panOffset, setPanOffset, resetPan });
  const zones  = useCanvasZones(plan);
  const decos  = useCanvasDecorations(plan);
  const guides = useCanvasGuides();

  // Track canvas pixel dimensions for rulers
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setCanvasDims({ w: el.offsetWidth, h: el.offsetHeight }));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const offsetX = Math.max(0, (canvasDims.w - WORLD_W * zoom) / 2);
  const offsetY = Math.max(0, (canvasDims.h - WORLD_H * zoom) / 2);

  // Init zoom+pan on mount
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const fz = Math.min(el.offsetWidth / WORLD_W, el.offsetHeight / WORLD_H);
    setFitZoom(fz);
    setZoom(1.0);
    setPanOffset({ x: Math.min(0, (el.offsetWidth - WORLD_W) / 2), y: Math.min(0, (el.offsetHeight - WORLD_H) / 2) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (plan.backgroundImageUrl) setBgImage(plan.backgroundImageUrl);
  }, [plan.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist removal of legacy emoji-only objects to DB (runs once per plan load)
  useEffect(() => {
    const original = plan.customEmojis ?? [];
    const cleaned = original.filter((e) => !!e.objectType);
    if (cleaned.length < original.length && plan.id) {
      setCustomEmojis(cleaned);
      api.updateSeatingPlan(plan.id, { customEmojis: cleaned });
    }
  }, [plan.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // toWorld uses the canvas div's bounding rect — rulers are outside, so no offset correction needed
  const toWorld = useCallback((cx: number, cy: number) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (cx - r.left - offsetX - panOffset.x) / zoom, y: (cy - r.top - offsetY - panOffset.y) / zoom };
  }, [zoom, offsetX, offsetY, panOffset.x, panOffset.y]);

  const { setDragging } = useCanvasDrag({
    zoom, snapEnabled, zones: zones.zones,
    fallbackScale: plan.scaleFactor ?? DEFAULT_SCALE,
    snapToGuides: guides.snapToGuides,
    onUpdateTablePos, onUpdateDecoPos: decos.onUpdateDecoPos,
  });

  const handleTableMouseDown = useCallback((e: React.MouseEvent, tableId: string) => {
    if (mode !== "layout" || zones.zoningMode || panMode || deleteMode) return;
    const t = plan.tables.find((t) => t.id === tableId);
    if (!t) return;
    e.preventDefault();
    setDragging({ kind: "table", id: tableId, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: t.posX, startPosY: t.posY });
  }, [mode, zones.zoningMode, panMode, deleteMode, plan.tables, setDragging]);

  const handleDecoMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (mode !== "layout" || zones.zoningMode || panMode || deleteMode) return;
    const d = decos.decorations.find((d) => d.id === id);
    if (!d) return;
    e.preventDefault();
    decos.closeDecoPanel();
    setDragging({ kind: "deco", id, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: d.posX, startPosY: d.posY });
  }, [mode, zones.zoningMode, panMode, deleteMode, decos, setDragging]);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    decos.closeDecoPanel();
    let pos = toWorld(e.clientX, e.clientY);
    if (e.shiftKey && zones.zonePoints.length > 0) {
      const last = zones.zonePoints[zones.zonePoints.length - 1];
      const dx = Math.abs(pos.x - last.x), dy = Math.abs(pos.y - last.y);
      pos = dx >= dy ? { x: pos.x, y: last.y } : { x: last.x, y: pos.y };
    }
    if (zones.handleZoneClick(pos)) return;
  }, [toWorld, zones, decos]);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setBgImage(await uploadImage(file)); }
    catch { alert("Error al subir la imagen."); }
  };

  const handleTableClick = useCallback((id: string) => {
    if (deleteMode && mode === "layout") { onDeleteTable(id); return; }
    if (previewEnabled && !resizeMode && mode !== "seating") {
      setPinnedTableId((prev) => (prev === id ? null : id));
      return;
    }
    if (resizeMode && mode === "layout") {
      const tbl = plan.tables.find((t) => t.id === id);
      if (tbl) {
        const sx = offsetX + panOffset.x + tbl.posX * zoom;
        const sy = offsetY + panOffset.y + tbl.posY * zoom;
        setTableResizePanel({ tableId: id, screenX: sx, screenY: sy });
      }
      return;
    }
    if (mode === "seating") { setChairSeatId(null); setSeatingTable(id === seatingTable ? null : id); }
  }, [deleteMode, resizeMode, previewEnabled, mode, plan.tables, offsetX, panOffset.x, panOffset.y, zoom, seatingTable, onDeleteTable]);

  const handleTableHover = useCallback((tableId: string) => {
    if (deleteMode || resizeMode || zones.zoningMode) return;
    setHoveredTableId(tableId);
  }, [deleteMode, resizeMode, zones.zoningMode]);

  const handleTableHoverEnd = useCallback(() => {
    if (!pinnedTableId) setHoveredTableId(null);
  }, [pinnedTableId]);

  const centerOnTable = useCallback((tableId: string) => {
    const table = plan.tables.find((t) => t.id === tableId);
    if (!table) return;
    const dims = canvasDimsRef.current;
    const z = zoomRef.current;
    const ox = Math.max(0, (dims.w - WORLD_W * z) / 2);
    const oy = Math.max(0, (dims.h - WORLD_H * z) / 2);
    setPanOffset(clampPan({ x: dims.w / 2 - ox - table.posX * z, y: dims.h / 2 - oy - table.posY * z }, z, dims.w, dims.h));
    setHoveredTableId(tableId);
    setTimeout(() => setHoveredTableId((h) => h === tableId ? null : h), 1400);
  }, [plan.tables, setPanOffset]);

  const handleLegendDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    legendDragRef.current = { startX: e.clientX, startY: e.clientY, originX: legendPos.x, originY: legendPos.y };
    const onMove = (me: MouseEvent) => {
      if (!legendDragRef.current) return;
      setLegendPos({
        x: Math.max(0, legendDragRef.current.originX + me.clientX - legendDragRef.current.startX),
        y: Math.max(0, legendDragRef.current.originY + me.clientY - legendDragRef.current.startY),
      });
    };
    const onUp = () => {
      legendDragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [legendPos]);

  // Pinned table takes priority; otherwise show hovered table dynamically
  const previewTableId = pinnedTableId ?? hoveredTableId;
  const previewTable   = previewEnabled
    ? (previewTableId ? plan.tables.find((t) => t.id === previewTableId) ?? null : null)
    : null;

  const activeTable = seatingTable ? plan.tables.find((t) => t.id === seatingTable) : null;
  const isZoning = zones.zoningMode || !!zones.pendingPoints;
  // LOD: hide table labels when zoom makes them smaller than ~30 px on screen.
  // Formula: physicalDiameter(1.8m) × scale(px/m) × zoom ≥ 30 → zoom ≥ 0.28
  const showLabels = zoom >= 0.28;
  // LOD inner gate: at scale=60px/m, zoom=0.55 → table screen ⌀ ≈ 59px (legible for name text)
  const showName   = zoom >= 0.55;
  const cursor = isZoning ? "crosshair" : panMode ? (isPanning ? "grabbing" : "grab") : deleteMode ? "crosshair" : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* Tri-panel layout: LeftToolPanel | Canvas | RightLibraryPanel */}
      <div className="flex rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ height: "78vh", maxHeight: "78vh" }}>

        <LeftToolPanel
          mode={mode} snapEnabled={snapEnabled} zoningMode={zones.zoningMode}
          hasZones={zones.zones.length > 0} rulersEnabled={rulersEnabled}
          hasGuides={guides.guides.length > 0} panMode={panMode}
          resizeMode={resizeMode} deleteMode={deleteMode} previewEnabled={previewEnabled}
          showLegend={showLegend} showTableLegend={showTableLegend}
          bgImage={bgImage} fileInputRef={fileInputRef}
          onBgUpload={handleBgUpload} onClearBg={() => setBgImage(null)}
          onToggleSnap={() => setSnapEnabled((v) => !v)}
          onToggleZone={zones.toggleZoningMode} onClearZones={zones.clearZones}
          onToggleRulers={() => setRulersEnabled((v) => !v)}
          onClearGuides={guides.clearGuides}
          onTogglePan={togglePanMode}
          onToggleResize={() => { setResizeMode((v) => !v); setDeleteMode(false); setTableResizePanel(null); decos.closeDecoPanel(); }}
          onToggleDelete={() => { setDeleteMode((v) => !v); setResizeMode(false); setTableResizePanel(null); decos.closeDecoPanel(); }}
          onTogglePreview={() => { setPreviewEnabled((v) => !v); setPinnedTableId(null); }}
          onToggleLegend={() => { setShowLegend((v) => { if (!v) setLegendPos({ x: 8, y: 8 }); return !v; }); }}
          onToggleTableLegend={() => setShowTableLegend((v) => !v)}
          onCenter={handleCenter}
        />

        {/*
          Canvas wrapper: position:relative so rulers overlay absolutely.
          Canvas div is absolute inset-0 — never shifts when rulers toggle.
        */}
        <div className="flex-1 overflow-hidden"
          style={{ position: "relative", background: "#EDE4D9" }}>

          {/* Canvas — always fills the full container, rulers overlay on top */}
          <div ref={canvasRef} className="absolute inset-0 overflow-hidden select-none"
            style={{ background: "#EDE4D9", cursor }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={onPanMouseDown}>

            <div style={{
              position: "absolute", width: WORLD_W, height: WORLD_H, transformOrigin: "0 0",
              transform: `translate(${offsetX + panOffset.x}px,${offsetY + panOffset.y}px) scale(${zoom})`,
              transition: transitioning ? "transform 0.35s cubic-bezier(0.4,0,0.2,1)" : undefined,
            }}>
              <CanvasSvg
                plan={plan} guests={guests} scale={plan.scaleFactor ?? DEFAULT_SCALE} mode={mode}
                bgImage={bgImage} seatingTable={seatingTable} snapEnabled={snapEnabled}
                zones={zones.zones} zonePoints={zones.zonePoints} guides={guides.guides}
                zoningActive={isZoning} resizeMode={resizeMode} showLabels={showLabels} showName={showName} deleteMode={deleteMode}
                decorations={decos.decorations} selectedDecoId={decos.selectedDecoId} calibPoints={[]}
                allergyColors={allergyColors}
                mealColors={mealColors}
                hoveredTableId={hoveredTableId}
                onTableMouseDown={handleTableMouseDown}
                onTableClick={handleTableClick}
                onDecoMouseDown={handleDecoMouseDown}
                onDecoClick={(id, cx, cy) => {
                  if (deleteMode) { decos.handleDeleteDeco(id); return; }
                  if (mode === "seating") {
                    const d = decos.decorations.find((d) => d.id === id);
                    if (d?.objectType === "chair") { setChairSeatId((prev) => prev === id ? null : id); setSeatingTable(null); }
                    return;
                  }
                  if (!resizeMode) return;
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) decos.handleDecoClick(id, cx, cy, rect, mode, zones.zoningMode, panMode);
                }}
                onSvgClick={handleSvgClick}
                onGuideMouseDown={(e, id) => { e.stopPropagation(); guides.startDrag(id, toWorld); }}
                onGuideDoubleClick={guides.removeGuide}
                onTableRotate={onRotateTable}
                onTableHover={handleTableHover}
                onTableHoverEnd={handleTableHoverEnd}
              />
            </div>

            <AnimatePresence>
              {mode === "seating" && activeTable && (
                <SeatingPanel table={activeTable} guests={guests}
                  onClose={() => setSeatingTable(null)}
                  onUnassign={(sn) => onAssignSeat(activeTable.id, sn, undefined)} />
              )}
              {mode === "seating" && chairSeatId && (() => {
                const chairDeco = decos.decorations.find((d) => d.id === chairSeatId);
                return chairDeco ? (
                  <ChairSeatPanel deco={chairDeco} guests={guests}
                    onAssign={(gId) => { decos.handleAssignChairGuest(chairSeatId, gId); if (gId) setChairSeatId(null); }}
                    onClose={() => setChairSeatId(null)} />
                ) : null;
              })()}
            </AnimatePresence>

            {mode === "layout" && resizeMode && tableResizePanel && (() => {
              const tbl = plan.tables.find((t) => t.id === tableResizePanel.tableId);
              return tbl ? (
                <TableResizePanel table={tbl}
                  screenX={tableResizePanel.screenX} screenY={tableResizePanel.screenY}
                  canvasH={canvasDims.h}
                  onApply={(id, d, w, h) => { onUpdateTableSize(id, d, w, h); setTableResizePanel(null); }}
                  onRotate={(id) => { onRotateTable(id); }}
                  onClose={() => setTableResizePanel(null)} />
              ) : null;
            })()}

            {mode === "layout" && decos.selectedDecoId && decos.decoPanel && (() => {
              const deco = decos.decorations.find((d) => d.id === decos.selectedDecoId);
              return deco ? (
                <DecorationResizePanel deco={deco}
                  screenX={decos.decoPanel.screenX} screenY={decos.decoPanel.screenY}
                  canvasH={canvasDims.h} onApply={decos.handleDecoApply} onClose={decos.closeDecoPanel} />
              ) : null;
            })()}

            <ZoomControls zoom={zoom} fitZoom={fitZoom} onZoomChange={setZoom} onCenter={handleCenter} />

            {/* Fixed inspection panel — top-right corner, visible when toggle is ON */}
            {previewEnabled && (
              <TablePreviewPanel table={previewTable ?? null} guests={guests} allergyColors={allergyColors} mealColors={mealColors}
                onClose={pinnedTableId ? () => { setPinnedTableId(null); setHoveredTableId(null); } : undefined} />
            )}

            {/* Diet legend — draggable, visible when toggle is ON */}
            {showLegend && (
              <div style={{ position: "absolute", top: legendPos.y, left: legendPos.x, zIndex: 10, pointerEvents: "auto" }}
                onMouseDown={(e) => e.stopPropagation()}>
                {/* Drag handle */}
                <div
                  onMouseDown={handleLegendDragStart}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: 18, cursor: "grab", background: "rgba(255,252,249,0.97)",
                    borderRadius: "10px 10px 0 0", border: "1px solid var(--color-border)",
                    borderBottom: "none", color: "var(--color-text)", opacity: 0.35,
                  }}>
                  <GripVertical size={12} />
                </div>
                <DietLegend plan={plan} guests={guests} allergyColors={allergyColors} mealColors={mealColors} />
              </div>
            )}

            {/* Mesa-Invitados legend — fixed top-right, visible when toggle is ON */}
            {showTableLegend && (
              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10, pointerEvents: "auto" }}
                onMouseDown={(e) => e.stopPropagation()}>
                <TableLegend plan={plan} guests={guests}
                  onCenterTable={centerOnTable}
                  onClose={() => setShowTableLegend(false)} />
              </div>
            )}

            {isZoning && (
              <ZoneCreationOverlay pointCount={zones.zonePoints.length} pendingPoints={zones.pendingPoints}
                onConfirm={zones.confirmZone} onCancel={zones.cancelPendingZone} />
            )}
          </div>

          {/* Rulers — absolutely overlaid after the canvas div (natural z-order: on top).
              RulerTop offset = offsetX - RULER_SIZE because ruler starts at left:RULER_SIZE
              from the canvas origin. RulerLeft offset = offsetY (ruler starts at top:0). */}
          {rulersEnabled && (
            <>
              <RulerCorner />
              <RulerTop zoom={zoom} panOffset={panOffset} offsetX={offsetX - RULER_SIZE} canvasW={canvasDims.w}
                onMouseDown={(wx) => guides.addAndDrag("vertical", wx, toWorld)} />
              <RulerLeft zoom={zoom} panOffset={panOffset} offsetY={offsetY} canvasH={canvasDims.h}
                onMouseDown={(wy) => guides.addAndDrag("horizontal", wy, toWorld)} />
            </>
          )}
        </div>{/* end canvas wrapper */}

        <RightLibraryPanel
          mode={mode}
          customEmojis={customEmojis}
          onAddTable={onAddTable}
          onAddDecoration={decos.handleAddDecoration}
          onAddCustomEmoji={(obj) => {
            const next = [...customEmojis, obj];
            setCustomEmojis(next);
            if (plan.id) api.updateSeatingPlan(plan.id, { customEmojis: next });
            decos.handleAddDecoration("custom_emoji", { objectType: obj.objectType, customEmoji: obj.emoji, label: obj.label, physicalWidth: obj.physicalWidth, physicalHeight: obj.physicalHeight });
          }}
          onDeleteCustomEmoji={(id) => {
            const next = customEmojis.filter((e) => e.id !== id);
            setCustomEmojis(next);
            if (plan.id) api.updateSeatingPlan(plan.id, { customEmojis: next });
          }}
        />
      </div>{/* end tri-panel */}

    </div>
  );
}
