"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard, imgSrc: "/icons/Icono planning mocha.png" },
  { name: "Invitados", href: "/app/invitados", icon: Users, imgSrc: "/icons/RSVP v3.png" },
  { name: "Presupuesto", href: "/app/presupuesto", icon: Wallet, imgSrc: "/icons/Proveedores y presupuesto.png" },
  { name: "Tareas", href: "/app/tareas", icon: CheckSquare, imgSrc: "/icons/Icono planning ap sin editar.png" },
  { name: "Web", href: "/app/web", icon: Globe, imgSrc: "/icons/Icono web rsvp.png" },
  { name: "Proveedores", href: "/app/proveedores", icon: Store, imgSrc: "/icons/Proveedores y presupuesto.png" },
  { name: "Plano mesas", href: "/app/plano-mesas", icon: Grid3X3 },
  { name: "Calendario", href: "/app/calendario", icon: Calendar },
  { name: "Guión", href: "/app/guion", icon: FileText },
  { name: "Notas", href: "/app/notas", icon: StickyNote },
];

export function ModuleNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide">
        {modules.map((mod) => {
          const isActive = pathname === mod.href;
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
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
