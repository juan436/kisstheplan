import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "default" | "light";
  type?: "full" | "short";
  href?: string;
  className?: string;
}

export function Logo({
  variant = "default",
  type = "full",
  href = "/",
  className,
}: LogoProps) {
  // Las imagenes importadas son:
  // /logos/logo-completo.png -> Logo gREIGE sin fondo.png
  // /logos/logo-abreviado.png -> K no background.png

  const src =
    type === "full" ? "/logos/logo-completo.png" : "/logos/logo-abreviado.png";

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 no-underline", className)}
    >
      <Image
        src={src}
        alt="Kisstheplan Logo"
        width={type === "full" ? 400 : 120}
        height={type === "full" ? 150 : 120}
        className={cn(
          "object-contain",
          type === "full" ? "h-20 sm:h-28 w-auto scale-125 origin-left" : "h-14 w-auto scale-[1.8]",
        )}
        priority
      />
    </Link>
  );
}
