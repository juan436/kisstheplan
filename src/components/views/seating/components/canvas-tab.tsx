"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut } from "lucide-react";
import { api } from "@/services";
import { uploadImage } from "@/lib/upload";
import type { SeatingPlan, TableSeat, Guest, DecorationObject, DecorationType } from "@/types";
import { WORLD_W, WORLD_H, CANVAS_H, DEFAULT_SCALE } from "../constants/seating.constants";
import { useCanvasDrag } from "../hooks/use-canvas-drag";
import { CanvasSvg } from "./canvas-svg";
import { CanvasToolbar } from "./canvas-toolbar";
import { CalibrationOverlay } from "./calibration-overlay";
import { DietLegend } from "./diet-legend";
import { SeatingPanel } from "./seating-panel";

interface CanvasTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  mode: "layout" | "seating";
  onUpdateTablePos: (tableId: string, posX: number, posY: number) => void;
  onAddTable: (shape: "round" | "rectangular") => void;
  onDeleteTable: (tableId: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

export function CanvasTab({ plan, guests, mode, onUpdateTablePos, onAddTable, onDeleteTable, onAssignSeat }: CanvasTabProps) {
  const [fitZoom, setFitZoom] = useState(0.7);
  const [zoom, setZoom] = useState(0.7);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [calibPoints, setCalibPoints] = useState<{ x: number; y: number }[]>([]);
  const [scale, setScale] = useState(plan.calibrationScale ?? DEFAULT_SCALE);
  const [seatingTable, setSeatingTable] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>("/images/venue-floor.svg");
  const [decorations, setDecorations] = useState<DecorationObject[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (plan?.backgroundImageUrl) setBgImage(plan.backgroundImageUrl); }, [plan?.id]);
  useEffect(() => { if (plan?.calibrationScale) setScale(plan.calibrationScale); }, [plan?.calibrationScale]);
  useEffect(() => {
    if (!canvasRef.current) return;
    const fz = Math.min(canvasRef.current.offsetWidth / WORLD_W, CANVAS_H / WORLD_H);
    setFitZoom(fz); setZoom(fz);
  }, []);

  const canvasW = canvasRef.current?.offsetWidth ?? WORLD_W;
  const offsetX = Math.max(0, (canvasW - WORLD_W * zoom) / 2);
  const offsetY = Math.max(0, (CANVAS_H - WORLD_H * zoom) / 2);

  const toWorld = useCallback((cx: number, cy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const r = canvasRef.current.getBoundingClientRect();
    return { x: (cx - r.left - offsetX) / zoom, y: (cy - r.top - offsetY) / zoom };
  }, [zoom, offsetX, offsetY]);

  const onUpdateDecoPos = useCallback((id: string, x: number, y: number) => {
    setDecorations((prev) => prev.map((d) => d.id === id ? { ...d, posX: x, posY: y } : d));
  }, []);

  const { setDragging } = useCanvasDrag({ zoom, snapEnabled, onUpdateTablePos, onUpdateDecoPos });

  const handleTableMouseDown = useCallback((e: React.MouseEvent, tableId: string) => {
    if (mode !== "layout" || calibrating) return;
    const t = plan.tables.find((t) => t.id === tableId);
    if (!t) return;
    e.preventDefault();
    setDragging({ kind: "table", id: tableId, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: t.posX, startPosY: t.posY });
  }, [mode, calibrating, plan.tables, setDragging]);

  const handleDecoMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (mode !== "layout" || calibrating) return;
    const d = decorations.find((d) => d.id === id);
    if (!d) return;
    e.preventDefault();
    setDragging({ kind: "deco", id, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: d.posX, startPosY: d.posY });
  }, [mode, calibrating, decorations, setDragging]);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!calibrating) return;
    const pos = toWorld(e.clientX, e.clientY);
    setCalibPoints((prev) => {
      const next = [...prev, pos].slice(0, 2);
      return next;
    });
  }, [calibrating, toWorld]);

  const handleCalibConfirm = async (meters: number) => {
    const [p1, p2] = calibPoints;
    const newScale = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) / meters;
    setScale(newScale);
    setCalibrating(false); setCalibPoints([]);
    if (plan.id) await api.updateSeatingPlan(plan.id, { scaleFactor: newScale });
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setBgImage(url);
      if (plan.id) await api.updateSeatingPlan(plan.id, { backgroundImageUrl: url });
    } catch { alert("Error al subir la imagen."); }
  };

  const handleAddDecoration = (type: DecorationType) => {
    setDecorations((prev) => [...prev, { id: `deco-${Date.now()}`, type, posX: WORLD_W / 2, posY: WORLD_H / 2 }]);
  };

  const activeTable = seatingTable ? plan.tables.find((t) => t.id === seatingTable) : null;

  return (
    <div className="flex flex-col gap-3">
      <div ref={canvasRef} className="relative overflow-hidden rounded-xl border border-[var(--color-border)]"
        style={{ height: CANVAS_H, background: "#EDE4D9", cursor: calibrating ? "crosshair" : undefined }}>
        <div style={{ position: "absolute", width: WORLD_W, height: WORLD_H, transformOrigin: "0 0",
          transform: `translate(${offsetX}px,${offsetY}px) scale(${zoom})` }}>
          <CanvasSvg plan={plan} guests={guests} scale={scale} mode={mode} bgImage={bgImage}
            seatingTable={seatingTable} snapEnabled={snapEnabled} decorations={decorations} calibPoints={calibPoints}
            onTableMouseDown={handleTableMouseDown} onTableClick={(id) => { if (mode === "seating") setSeatingTable(id === seatingTable ? null : id); }}
            onDeleteTable={onDeleteTable} onDecoMouseDown={handleDecoMouseDown} onSvgClick={handleSvgClick} />
        </div>

        <AnimatePresence>
          {mode === "seating" && activeTable && (
            <SeatingPanel table={activeTable} guests={guests}
              onClose={() => setSeatingTable(null)}
              onUnassign={(sn) => onAssignSeat(activeTable.id, sn, undefined)} />
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 hover:text-[var(--color-text)] shadow-sm"><ZoomIn size={13} /></button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, fitZoom))} className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 hover:text-[var(--color-text)] shadow-sm"><ZoomOut size={13} /></button>
          <span className="text-center text-[10px] text-[var(--color-text)]/40 bg-white/80 rounded px-1">{Math.round(zoom * 100)}%</span>
          <span className="text-center text-[10px] text-[var(--color-text)]/40 bg-white/80 rounded px-1">{Math.round(scale)}px/m</span>
        </div>

        {calibrating && (
          <CalibrationOverlay points={calibPoints}
            onConfirm={handleCalibConfirm}
            onCancel={() => { setCalibrating(false); setCalibPoints([]); }} />
        )}
      </div>

      <CanvasToolbar mode={mode} bgImage={bgImage} snapEnabled={snapEnabled} calibrating={calibrating}
        fileInputRef={fileInputRef} onAddTable={onAddTable} onAddDecoration={handleAddDecoration}
        onBgUpload={handleBgUpload} onClearBg={() => setBgImage(null)}
        onToggleSnap={() => setSnapEnabled((v) => !v)}
        onToggleCalibrate={() => { setCalibrating((v) => !v); setCalibPoints([]); }} />

      {mode === "seating" && <DietLegend plan={plan} guests={guests} />}
    </div>
  );
}
