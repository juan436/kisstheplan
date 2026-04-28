"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CheckSquare,
  Globe,
  Store,
  Grid3X3,
  Calendar,
  FileText,
  StickyNote,
} from "lucide-react";

const modules = [
  { id: "dashboard", name: "Inicio", icon: LayoutDashboard },
  { id: "tareas", name: "Tareas", icon: CheckSquare },
  { id: "notas", name: "Notas", icon: StickyNote },
  { id: "proveedores", name: "Proveedores", icon: Store },
  { id: "presupuesto", name: "Presupuesto", icon: Wallet },
  { id: "invitados", name: "Invitados", icon: Users },
  { id: "web", name: "Web", icon: Globe },
  { id: "plano-mesas", name: "Plano mesas", icon: Grid3X3 },
  { id: "guion", name: "Guión", icon: FileText },
  { id: "calendario", name: "Calendario", icon: Calendar },
];

export function ModuleNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Refs para drag — sin re-renders en cada movimiento
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const didDrag = useRef(false);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateFades();
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el?.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    didDrag.current = false;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = el.scrollLeft;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 4) didDrag.current = true;
    scrollRef.current.scrollLeft = dragScrollLeft.current - delta;
  };

  const onPointerUp = () => setIsDragging(false);

  return (
    <nav className="bg-white border-b border-border relative select-none">
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide",
          isDragging ? "cursor-grabbing" : "cursor-grab lg:cursor-default"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {modules.map((mod) => {
          const isActive = activeTab === mod.id;
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => { if (!didDrag.current) onTabChange(mod.id); }}
              className={cn(
                "flex items-center gap-2 px-3 md:px-4 lg:px-5 py-3 text-[12px] lg:text-[13px] font-medium whitespace-nowrap transition-all border-b-2 outline-none cursor-pointer",
                isActive
                  ? "text-text border-cta"
                  : "text-brand border-transparent hover:text-accent hover:border-border"
              )}
            >
              <Icon size={15} />
              {mod.name}
            </button>
          );
        })}
      </div>

      {/* Fade izquierda — aparece cuando hay scroll previo */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent transition-opacity duration-200",
          showLeft ? "opacity-100" : "opacity-0"
        )}
      />
      {/* Fade derecha — aparece cuando hay más tabs por la derecha */}
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200",
          showRight ? "opacity-100" : "opacity-0"
        )}
      />
    </nav>
  );
}
