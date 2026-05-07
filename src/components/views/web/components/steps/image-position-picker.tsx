"use client";

import { useRef, useState, useCallback } from "react";
import { X, ZoomOut, ZoomIn } from "lucide-react";

interface Props {
  imageUrl: string;
  position: string;
  onChange: (pos: string) => void;
  onRemove: () => void;
}

function parse(pos: string): [number, number, number] {
  const p = pos.split(" ");
  return [parseFloat(p[0] ?? "50"), parseFloat(p[1] ?? "50"), parseFloat(p[2] ?? "1") || 1];
}

export function ImagePositionPicker({ imageUrl, position, onChange, onRemove }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [px, py, zoom] = parse(position);

  const emit = useCallback((x: number, y: number, z: number) => {
    onChange(`${x}% ${y}% ${z}`);
  }, [onChange]);

  const getPos = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, (clientX - rect.left) / rect.width * 100)));
    const y = Math.round(Math.min(100, Math.max(0, (clientY - rect.top) / rect.height * 100)));
    emit(x, y, zoom);
  }, [emit, zoom]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    setDragging(true);
    getPos(e.clientX, e.clientY);
    const move = (ev: MouseEvent) => getPos(ev.clientX, ev.clientY);
    const up = () => {
      setDragging(false);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, [getPos]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const t = e.touches[0];
    getPos(t.clientX, t.clientY);
    const move = (ev: TouchEvent) => getPos(ev.touches[0].clientX, ev.touches[0].clientY);
    const end = () => {
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    };
    document.addEventListener("touchmove", move, { passive: true });
    document.addEventListener("touchend", end);
  }, [getPos]);

  return (
    <div>
      <div ref={containerRef}
        className="relative rounded-lg overflow-hidden h-28 group select-none"
        style={{ cursor: dragging ? "none" : "crosshair" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}
      >
        <img src={imageUrl} alt="Portada" draggable={false}
          className="w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: `${px}% ${py}%`, transform: `scale(${zoom})`, transformOrigin: `${px}% ${py}%` }} />
        <div style={{ position: "absolute", left: `${px}%`, top: `${py}%`, transform: "translate(-50%,-50%)", width: "20px", height: "20px", border: "2.5px solid white", borderRadius: "50%", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.6)", pointerEvents: "none", transition: dragging ? "none" : "left 0.1s, top 0.1s" }} />
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all z-10">
          <X size={12} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2 px-1">
        <button onClick={() => emit(px, py, Math.round(Math.max(0.5, zoom - 0.1) * 10) / 10)}
          className="text-brand hover:text-text transition-colors shrink-0">
          <ZoomOut size={13} />
        </button>
        <input type="range" min={0.5} max={3} step={0.05} value={zoom}
          onChange={(e) => emit(px, py, parseFloat(e.target.value))}
          className="flex-1 h-1 cursor-pointer" style={{ accentColor: "#c7a977" }} />
        <button onClick={() => emit(px, py, Math.round(Math.min(3, zoom + 0.1) * 10) / 10)}
          className="text-brand hover:text-text transition-colors shrink-0">
          <ZoomIn size={13} />
        </button>
      </div>
      <p className="text-[10px] text-brand mt-1 text-center opacity-60">Arrastra para enfocar · Desliza para zoom</p>
    </div>
  );
}
