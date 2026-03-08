"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "¿Por qué KissthePlan?", href: "#why" },
  { label: "Precios", href: "#pricing" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[90px] bg-[#c8b8a6]">
      <div className="max-w-[1400px] mx-auto px-10 h-full flex items-center justify-between">
        <div className="w-[300px]">
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-16">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[16px] font-body font-medium text-[#4A3C32]/80 hover:text-text transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6 w-[300px] justify-end">
          <Link href="/login" className="text-[15px] font-medium text-[#4A3C32]/80 hover:text-text no-underline">
            Iniciar sesión
          </Link>
          <Link href="/register">
            <button className="bg-[#7C5D4B] text-white px-6 py-2.5 rounded-xl font-medium text-[15px] hover:bg-[#6a4f3f] transition-colors shadow-sm">
              Regístrate
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#4A3C32]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#c8b8a6] border-t border-[#4A3C32]/10 px-6 py-6 animate-fade-in absolute w-full mx-auto top-[90px] shadow-md">
          <nav className="flex flex-col gap-4 mb-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[16px] font-medium text-[#4A3C32] py-2 no-underline border-b border-[#4A3C32]/10"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-4">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <div className="w-full text-center text-[#4A3C32] font-medium py-3 border border-[#4A3C32]/20 rounded-xl hover:bg-[#4A3C32]/5 transition-colors">
                Iniciar sesión
              </div>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <div className="w-full text-center bg-[#7C5D4B] text-white font-medium py-3 rounded-xl hover:bg-[#6a4f3f] transition-colors shadow-sm">
                Regístrate
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
