"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { User, Heart, Settings, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface TopbarProps {
  weddingName: string;
  userName: string;
  onLogout?: () => void;
}

export function Topbar({ weddingName, userName, onLogout }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-14 bg-accent flex items-center justify-between px-5">
      {/* Left: Logo + wedding name */}
      <div className="flex items-center gap-3">
        <Logo type="short" href="/app/dashboard" />
        <span className="text-white font-body font-semibold text-[14px] hidden sm:block">
          {weddingName}
        </span>
      </div>

      {/* Right: Avatar + menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2"
        >
          <Avatar name={userName} size="sm" />
          <span className="text-white/80 sm:hidden">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white border border-border rounded-[14px] shadow-dropdown overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-[13px] font-semibold text-text">{userName}</div>
            </div>
            <nav className="py-1">
              <DropdownItem href="/app/mi-boda" icon={<Heart size={16} />} label="Mi boda" />
              <DropdownItem href="/app/cuenta" icon={<User size={16} />} label="Mi cuenta" />
              <DropdownItem href="/app/colaboradores" icon={<Settings size={16} />} label="Colaboradores" />
              <DropdownItem href="/app/ayuda" icon={<HelpCircle size={16} />} label="Ayuda" />
            </nav>
            <div className="border-t border-border py-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-danger hover:bg-bg2 transition-colors"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-text hover:bg-bg2 transition-colors no-underline"
    >
      {icon}
      {label}
    </Link>
  );
}
