"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, imgSrc: "/icons/Icono planning mocha.png" },
  { id: "invitados", name: "Invitados", icon: Users, imgSrc: "/icons/RSVP v3.png" },
  { id: "presupuesto", name: "Presupuesto", icon: Wallet, imgSrc: "/icons/Proveedores y presupuesto.png" },
  { id: "tareas", name: "Tareas", icon: CheckSquare, imgSrc: "/icons/Icono planning ap sin editar.png" },
  { id: "web", name: "Web", icon: Globe, imgSrc: "/icons/Icono web rsvp.png" },
  { id: "proveedores", name: "Proveedores", icon: Store, imgSrc: "/icons/Proveedores y presupuesto.png" },
  { id: "plano-mesas", name: "Plano mesas", icon: Grid3X3 },
  { id: "calendario", name: "Calendario", icon: Calendar },
  { id: "guion", name: "Guión", icon: FileText },
  { id: "notas", name: "Notas", icon: StickyNote },
];

export function ModuleNav() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <nav className="bg-white border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide">
        {modules.map((mod) => {
          const isActive = currentTab === mod.id;
          const Icon = mod.icon;
          return (
            <Link
              key={mod.id}
              href={`/app?tab=${mod.id}`}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-[13px] font-medium whitespace-nowrap transition-all border-b-2 no-underline",
                isActive
                  ? "text-text border-cta"
                  : "text-brand border-transparent hover:text-accent hover:border-border"
              )}
            >
              {mod.imgSrc ? (
                <Image src={mod.imgSrc} alt={mod.name} width={18} height={18} className={cn(isActive ? "opacity-100" : "opacity-60 grayscale", "object-contain")} />
              ) : (
                <Icon size={16} />
              )}
              {mod.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
