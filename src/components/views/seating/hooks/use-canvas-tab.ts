"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SeatingPlan, EmojiObject } from "@/types";
import { api } from "@/services";
import { WORLD_W, WORLD_H, DEFAULT_SCALE } from "../constants/seating.constants";
import { clampPan } from "../helpers/seating.helpers";
import { useCanvasDrag } from "./use-canvas-drag";
import { useCanvasPan } from "./use-canvas-pan";
import { useCanvasZoom } from "./use-canvas-zoom";
import { useCanvasZones } from "./use-canvas-zones";
import { useCanvasDecorations } from "./use-canvas-decorations";
import { useCanvasGuides } from "./use-canvas-guides";

interface UseCanvasTabOptions {
  plan: SeatingPlan;
  mode: "layout" | "seating";
  onUpdateTablePos: (tableId: string, posX: number, posY: number) => void;
  onDeleteTable: (tableId: string) => void;
}

export function useCanvasTab({ plan, mode, onUpdateTablePos, onDeleteTable }: UseCanvasTabOptions) {
  const [zoom, setZoom]         = useState(1.0);
  const [fitZoom, setFitZoom]   = useState(0.7);
  const [snapEnabled, setSnapEnabled]           = useState(false);
  const [rulersEnabled, setRulersEnabled]       = useState(false);
  const [resizeMode, setResizeMode]             = useState(false);
  const [deleteMode, setDeleteMode]             = useState(false);
  const [seatingTable, setSeatingTable]         = useState<string | null>(null);
  const [chairSeatId, setChairSeatId]           = useState<string | null>(null);
  const [tableResizePanel, setTableResizePanel] = useState<{ tableId: string; screenX: number; screenY: number } | null>(null);
  const [previewEnabled, setPreviewEnabled]     = useState(false);
  const [hoveredTableId, setHoveredTableId]     = useState<string | null>(null);
  const [pinnedTableId, setPinnedTableId]       = useState<string | null>(null);
  const [hideNames, setHideNames]               = useState(false);
  const [showLegend, setShowLegend]             = useState(false);
  const [legendPos, setLegendPos]               = useState({ x: 8, y: 8 });
  const [showTableLegend, setShowTableLegend]   = useState(false);
  const [bgImage, setBgImage]                   = useState<string | null>(plan.backgroundImageUrl ?? "/images/finca.png");
  const [customEmojis, setCustomEmojis]         = useState<EmojiObject[]>(() => (plan.customEmojis ?? []).filter((e) => !!e.objectType));
  const [canvasDims, setCanvasDims]             = useState({ w: WORLD_W, h: 600 });

  const canvasRef    = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zoomRef      = useRef(zoom);
  const dimsRef      = useRef(canvasDims);
  zoomRef.current = zoom; dimsRef.current = canvasDims;
  const clampRef = useRef((pan: { x: number; y: number }) => clampPan(pan, zoomRef.current, dimsRef.current.w, dimsRef.current.h));

  const { panMode, togglePanMode, panOffset, onPanMouseDown, resetPan, isPanning, setPanOffset } = useCanvasPan(clampRef);
  const { transitioning, handleCenter } = useCanvasZoom({ canvasRef, fitZoom, zoom, setZoom, panOffset, setPanOffset, resetPan });
  const zones  = useCanvasZones(plan);
  const decos  = useCanvasDecorations(plan);
  const guides = useCanvasGuides();

  useEffect(() => {
    const el = canvasRef.current; if (!el) return;
    const obs = new ResizeObserver(() => setCanvasDims({ w: el.offsetWidth, h: el.offsetHeight }));
    obs.observe(el); return () => obs.disconnect();
  }, []);

  const offsetX = Math.max(0, (canvasDims.w - WORLD_W * zoom) / 2);
  const offsetY = Math.max(0, (canvasDims.h - WORLD_H * zoom) / 2);

  useEffect(() => {
    const el = canvasRef.current; if (!el) return;
    const fz = Math.min(el.offsetWidth / WORLD_W, el.offsetHeight / WORLD_H); setFitZoom(fz); setZoom(1.0);
    setPanOffset({ x: Math.min(0, (el.offsetWidth - WORLD_W) / 2), y: Math.min(0, (el.offsetHeight - WORLD_H) / 2) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (plan.backgroundImageUrl) setBgImage(plan.backgroundImageUrl); }, [plan.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const orig = plan.customEmojis ?? [], clean = orig.filter((e) => !!e.objectType);
    if (clean.length < orig.length && plan.id) { setCustomEmojis(clean); api.updateSeatingPlan(plan.id, { customEmojis: clean }); }
  }, [plan.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const toWorld = useCallback((cx: number, cy: number) => {
    const r = canvasRef.current?.getBoundingClientRect(); if (!r) return { x: 0, y: 0 };
    return { x: (cx - r.left - offsetX - panOffset.x) / zoom, y: (cy - r.top - offsetY - panOffset.y) / zoom };
  }, [zoom, offsetX, offsetY, panOffset.x, panOffset.y]);

  const { setDragging } = useCanvasDrag({ zoom, snapEnabled, zones: zones.zones, fallbackScale: plan.scaleFactor ?? DEFAULT_SCALE, snapToGuides: guides.snapToGuides, containerRef: canvasRef, onUpdateTablePos, onUpdateDecoPos: decos.onUpdateDecoPos });

  const handleTableMouseDown = useCallback((e: React.MouseEvent, tableId: string) => {
    if (mode !== "layout" || zones.zoningMode || panMode || deleteMode) return;
    const t = plan.tables.find((t) => t.id === tableId); if (!t) return;
    e.preventDefault(); setDragging({ kind: "table", id: tableId, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: t.posX, startPosY: t.posY });
  }, [mode, zones.zoningMode, panMode, deleteMode, plan.tables, setDragging]);

  const handleDecoMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (mode !== "layout" || zones.zoningMode || panMode || deleteMode) return;
    const d = decos.decorations.find((d) => d.id === id); if (!d) return;
    e.preventDefault(); decos.closeDecoPanel(); setDragging({ kind: "deco", id, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: d.posX, startPosY: d.posY });
  }, [mode, zones.zoningMode, panMode, deleteMode, decos, setDragging]);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    decos.closeDecoPanel(); let pos = toWorld(e.clientX, e.clientY);
    if (e.shiftKey && zones.zonePoints.length > 0) {
      const last = zones.zonePoints[zones.zonePoints.length - 1];
      const dx = Math.abs(pos.x - last.x), dy = Math.abs(pos.y - last.y);
      pos = dx >= dy ? { x: pos.x, y: last.y } : { x: last.x, y: pos.y };
    }
    zones.handleZoneClick(pos);
  }, [toWorld, zones, decos]);

  const handleTableClick = useCallback((id: string) => {
    if (deleteMode && mode === "layout") { onDeleteTable(id); return; }
    if (previewEnabled && !resizeMode && mode !== "seating") { setPinnedTableId((p) => (p === id ? null : id)); return; }
    if (resizeMode && mode === "layout") {
      const tbl = plan.tables.find((t) => t.id === id);
      if (tbl) setTableResizePanel({ tableId: id, screenX: offsetX + panOffset.x + tbl.posX * zoom, screenY: offsetY + panOffset.y + tbl.posY * zoom });
      return;
    }
    if (mode === "seating") { setChairSeatId(null); setSeatingTable(id === seatingTable ? null : id); }
  }, [deleteMode, resizeMode, previewEnabled, mode, plan.tables, offsetX, panOffset.x, panOffset.y, zoom, seatingTable, onDeleteTable]);

  const handleTableHover    = useCallback((tableId: string) => { if (!deleteMode && !resizeMode && !zones.zoningMode) setHoveredTableId(tableId); }, [deleteMode, resizeMode, zones.zoningMode]);
  const handleTableHoverEnd = useCallback(() => { if (!pinnedTableId) setHoveredTableId(null); }, [pinnedTableId]);

  const centerOnTable = useCallback((tableId: string) => {
    const tbl = plan.tables.find((t) => t.id === tableId); if (!tbl) return;
    const { w, h } = dimsRef.current; const z = zoomRef.current;
    setPanOffset(clampPan({ x: w / 2 - Math.max(0, (w - WORLD_W * z) / 2) - tbl.posX * z, y: h / 2 - Math.max(0, (h - WORLD_H * z) / 2) - tbl.posY * z }, z, w, h));
    setHoveredTableId(tableId); setTimeout(() => setHoveredTableId((hv) => hv === tableId ? null : hv), 1400);
  }, [plan.tables, setPanOffset]);

  const previewTable = previewEnabled ? (plan.tables.find((t) => t.id === (pinnedTableId ?? hoveredTableId)) ?? null) : null;
  const activeTable  = seatingTable ? plan.tables.find((t) => t.id === seatingTable) : null;
  const isZoning     = zones.zoningMode || !!zones.pendingPoints;
  const showLabels   = zoom >= 0.28;
  const showName     = zoom >= 0.55;
  const cursor = isZoning ? "crosshair" : panMode ? (isPanning ? "grabbing" : "grab") : deleteMode ? "crosshair" : undefined;

  return {
    canvasRef, fileInputRef, zoom, setZoom, fitZoom, snapEnabled, setSnapEnabled, rulersEnabled, setRulersEnabled,
    resizeMode, setResizeMode, deleteMode, setDeleteMode, seatingTable, setSeatingTable, chairSeatId, setChairSeatId,
    tableResizePanel, setTableResizePanel, previewEnabled, setPreviewEnabled, hoveredTableId, setHoveredTableId,
    pinnedTableId, setPinnedTableId, hideNames, setHideNames, showLegend, setShowLegend, legendPos, setLegendPos,
    showTableLegend, setShowTableLegend, bgImage, setBgImage, customEmojis, setCustomEmojis, canvasDims,
    panMode, togglePanMode, panOffset, onPanMouseDown, isPanning, transitioning, handleCenter,
    zones, decos, guides, offsetX, offsetY, previewTable, activeTable, isZoning, showLabels, showName, cursor,
    toWorld, handleTableMouseDown, handleDecoMouseDown, handleSvgClick, handleTableClick,
    handleTableHover, handleTableHoverEnd, centerOnTable,
  };
}
