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

const modules = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Invitados", href: "/app/invitados", icon: Users },
  { name: "Presupuesto", href: "/app/presupuesto", icon: Wallet },
  { name: "Tareas", href: "/app/tareas", icon: CheckSquare },
  { name: "Web", href: "/app/web", icon: Globe },
  { name: "Proveedores", href: "/app/proveedores", icon: Store },
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
              <Icon size={16} />
              {mod.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
