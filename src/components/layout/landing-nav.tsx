"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Módulos", href: "#modules" },
  { label: "Precio", href: "#pricing" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg/92 backdrop-blur-[10px] border-b border-border/50">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-accent hover:text-cta transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="cta" size="sm">
              Empezar gratis
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border px-6 py-4 animate-fade-in">
          <nav className="flex flex-col gap-3 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-accent py-2 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button variant="secondary" size="full">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="cta" size="full">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
