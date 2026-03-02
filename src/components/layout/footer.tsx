import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="bg-accent py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo variant="light" />

          <nav className="flex items-center gap-6">
            <a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors no-underline">
              Términos
            </a>
            <a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors no-underline">
              Privacidad
            </a>
            <a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors no-underline">
              Contacto
            </a>
          </nav>

          <p className="text-[12px] text-white/50">
            © 2026 KissthePlan. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
