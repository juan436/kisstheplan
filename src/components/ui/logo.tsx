import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  type?: "full" | "short";
  href?: string;
  className?: string;
  variant?: "beige" | "mocha" | "light";
  centered?: boolean;
}

export function Logo({
  type = "full",
  href = "/",
  className,
  variant = "beige",
  centered = false,
}: LogoProps) {

  const getSrc = () => {
    if (type === "short") return "/logos/logo-short.png";
    if (variant === "mocha") return "/logos/logo-full-mocha.png";
    if (variant === "light") return "/logos/logo-full-greige.png";
    return "/logos/logo-full-greige.png";
  };
  const src = getSrc();

  return (
    <Link
      href={href}
      className={cn("flex items-center no-underline relative", centered && "justify-center", className)}
    >
      <div className={cn(
        "relative flex items-center", 
        type === "full" 
          ? "w-[220px] h-[70px] sm:w-[260px] sm:h-[80px] lg:w-[300px] lg:h-[90px]" 
          : "w-[48px] h-[48px]"
      )}>
        <Image
          src={src}
          alt="Kisstheplan Logo"
          fill
          className={cn(
            "object-contain", 
            type === "full" 
              ? (centered ? "object-center scale-[1.1]" : "object-left scale-[1.8] origin-left")
              : "object-center scale-[2.5]"
          )}
          priority
        />
      </div>
    </Link>
  );
}
