import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  type?: "full" | "short";
  href?: string;
  className?: string;
  variant?: "beige" | "mocha" | "light";
}

export function Logo({
  type = "full",
  href = "/",
  className,
  variant = "beige",
}: LogoProps) {
  // Las imagenes importadas son:
  // /logos/logo-completo.png -> Logo gREIGE sin fondo.png
  // /logos/logo-abreviado.png -> K no background.png

  const getSrc = () => {
    if (type === "short") return "/logos/logo-abreviado.png";
    if (variant === "mocha") return "/logos/logo-mocha-sin-fondo.png";
    return "/logos/logo-completo.png";
  };
  const src = getSrc();

  return (
    <Link
      href={href}
      className={cn("flex items-center no-underline relative", className)}
    >
      <div className={cn("relative flex items-center", type === "full" ? "w-[260px] h-[86px] sm:w-[320px] sm:h-[106px] lg:w-[360px] lg:h-[120px] xl:w-[400px] xl:h-[135px]" : "w-[48px] h-[48px]")}>
        <Image
          src={src}
          alt="Kisstheplan Logo"
          fill
          className={cn("object-contain object-left", type === "full" && "scale-[1.3] md:scale-[1.5] xl:scale-[1.6] origin-left")}
          priority
        />
      </div>
    </Link>
  );
}
