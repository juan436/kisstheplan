import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 no-underline", className)}>
      <div className="w-[38px] h-[38px] bg-brand rounded-lg flex items-center justify-center">
        <span className="font-display font-bold text-white text-[18px] leading-none">
          K
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-display font-semibold text-[15px] tracking-[3px] leading-tight",
            isLight ? "text-white" : "text-text"
          )}
        >
          KiSS
        </span>
        <span
          className={cn(
            "font-body font-medium text-[9px] tracking-[4px] uppercase leading-tight",
            isLight ? "text-white/70" : "text-brand"
          )}
        >
          THE PLAN
        </span>
      </div>
    </Link>
  );
}
