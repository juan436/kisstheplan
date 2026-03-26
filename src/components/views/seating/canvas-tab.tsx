"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { api } from "@/services";
import { uploadImage } from "@/lib/upload";
import type { SeatingPlan, TableSeat, Guest } from "@/types";
import { WORLD_W, WORLD_H } from "./seating-constants";
import { getGuestName } from "./seating-helpers";
import { CanvasTableRenderer } from "./canvas-table-renderer";
import { CanvasToolbar } from "./canvas-toolbar";

interface CanvasTabProps {
  plan: SeatingPlan;
  guests: Guest[];
  mode: "layout" | "seating";
  onUpdateTablePos: (tableId: string, posX: number, posY: number) => void;
  onAddTable: (shape: "round" | "rectangular", name?: string, capacity?: number) => void;
  onDeleteTable: (tableId: string) => void;
  onAssignSeat: (tableId: string, seatNumber: number, guestId?: string) => void;
}

export function CanvasTab({ plan, guests, mode, onUpdateTablePos, onAddTable, onDeleteTable, onAssignSeat }: CanvasTabProps) {
  const [fitZoom, setFitZoom] = useState(0.7);
  const [zoom, setZoom] = useState(0.7);
  const [dragging, setDragging] = useState<{ tableId: string; startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null);
  const [seatingTable, setSeatingTable] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>("/images/venue-floor.svg");
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (plan?.backgroundImageUrl) setBgImage(plan.backgroundImageUrl);
  }, [plan?.id, plan?.backgroundImageUrl]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { offsetWidth: w, offsetHeight: h } = canvasRef.current;
    const fz = Math.min(w / WORLD_W, h / WORLD_H);
    setFitZoom(fz);
    setZoom(fz);
  }, []);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setBgImage(url);
      if (plan.id) await api.updateSeatingPlan(plan.id, { backgroundImageUrl: url });
    } catch {
      alert("Error al subir la imagen. Por favor, intenta de nuevo.");
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, table: TableSeat) => {
    if (mode !== "layout") return;
    e.preventDefault();
    setDragging({ tableId: table.id, startMouseX: e.clientX, startMouseY: e.clientY, startPosX: table.posX, startPosY: table.posY });
  }, [mode]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startMouseX) / zoom;
      const dy = (e.clientY - dragging.startMouseY) / zoom;
      const el = document.getElementById(`table-${dragging.tableId}`);
      if (el) { el.style.left = `${Math.max(0, dragging.startPosX + dx)}px`; el.style.top = `${Math.max(0, dragging.startPosY + dy)}px`; }
    };
    const handleMouseUp = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startMouseX) / zoom;
      const dy = (e.clientY - dragging.startMouseY) / zoom;
      onUpdateTablePos(dragging.tableId, Math.max(0, dragging.startPosX + dx), Math.max(0, dragging.startPosY + dy));
      setDragging(null);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, [dragging, zoom, onUpdateTablePos]);

  const activeSeatingTable = seatingTable ? plan.tables.find((t) => t.id === seatingTable) : null;
  const canvasW = canvasRef.current?.offsetWidth ?? WORLD_W;

  return (
    <div className="flex flex-col gap-3">
      <div ref={canvasRef} className="relative overflow-hidden rounded-xl border border-[var(--color-border)]" style={{ height: 560, background: "#EDE4D9" }}>
        <div style={{ position: "absolute", width: WORLD_W, height: WORLD_H, transform: `translate(${Math.max(0, (canvasW - WORLD_W * zoom) / 2)}px, ${Math.max(0, (560 - WORLD_H * zoom) / 2)}px) scale(${zoom})`, transformOrigin: "0 0", ...(bgImage ? { backgroundImage: `url('${bgImage}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : { background: "#EDE4D9" }) }}>
          <CanvasTableRenderer plan={plan} guests={guests} mode={mode} seatingTable={seatingTable} setSeatingTable={setSeatingTable} bgImage={bgImage} onMouseDown={handleMouseDown} onDeleteTable={onDeleteTable} />
        </div>

        <AnimatePresence>
          {mode === "seating" && activeSeatingTable && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute top-3 right-3 bg-white rounded-xl border border-[var(--color-border)] shadow-xl z-10 overflow-hidden" style={{ width: 240, maxHeight: 380, boxShadow: "0 12px 40px rgba(74,60,50,0.14)" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-2)]">
                <span className="font-quicksand font-semibold text-sm text-[var(--color-text)]">{activeSeatingTable.name}</span>
                <button onClick={() => setSeatingTable(null)} className="text-[var(--color-text)]/40 hover:text-[var(--color-text)]"><X size={14} /></button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
                {activeSeatingTable.assignments.map((seat) => (
                  <div key={seat.seatNumber} className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--color-bg-2)] border-b border-[var(--color-border)]/50 last:border-0">
                    <span className="text-xs text-[var(--color-text)]/40 w-5 text-right flex-shrink-0">{seat.seatNumber}.</span>
                    {seat.guestId ? (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span className="text-sm text-[var(--color-text)] truncate flex-1">{getGuestName(guests, seat.guestId)}</span>
                        <button onClick={() => onAssignSeat(activeSeatingTable.id, seat.seatNumber, undefined)} className="text-[var(--color-danger)]/60 hover:text-[var(--color-danger)] flex-shrink-0"><X size={12} /></button>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--color-text)]/30 italic flex-1">Libre</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))} className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/40 transition-colors shadow-sm"><ZoomIn size={13} /></button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.1, fitZoom))} className="w-7 h-7 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/40 transition-colors shadow-sm"><ZoomOut size={13} /></button>
          <span className="text-center text-xs text-[var(--color-text)]/40 bg-white/80 rounded px-1">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      <CanvasToolbar mode={mode} bgImage={bgImage} fileInputRef={fileInputRef} onAddTable={onAddTable} onBgUpload={handleBgUpload} onClearBg={() => setBgImage(null)} />
    </div>
  );
}
