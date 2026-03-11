"use client";

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
import Image from "next/image";

const modules = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invitados", name: "Invitados", icon: Users },
  { id: "presupuesto", name: "Presupuesto", icon: Wallet },
  { id: "tareas", name: "Tareas", icon: CheckSquare },
  { id: "web", name: "Web", icon: Globe },
  { id: "proveedores", name: "Proveedores", icon: Store },
  { id: "plano-mesas", name: "Plano mesas", icon: Grid3X3 },
  { id: "calendario", name: "Calendario", icon: Calendar },
  { id: "guion", name: "Guión", icon: FileText },
  { id: "notas", name: "Notas", icon: StickyNote },
];

export function ModuleNav({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
}) {
  return (
    <nav className="bg-white border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide">
        {modules.map((mod) => {
          const isActive = activeTab === mod.id;
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => onTabChange(mod.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-[13px] font-medium whitespace-nowrap transition-all border-b-2 outline-none cursor-pointer",
                isActive
                  ? "text-text border-cta"
                  : "text-brand border-transparent hover:text-accent hover:border-border"
              )}
            >
              <Icon size={16} />
              {mod.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
