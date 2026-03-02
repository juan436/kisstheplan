"use client";

import { cn } from "@/lib/utils";

interface CountdownRingProps {
  days: number;
  totalDays?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function CountdownRing({
  days,
  totalDays = 365,
  size = "lg",
  className,
}: CountdownRingProps) {
  const dimensions = size === "lg" ? 180 : 100;
  const strokeWidth = size === "lg" ? 8 : 5;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, 1 - days / totalDays));
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={dimensions} height={dimensions} className="-rotate-90">
        {/* Track */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--color-cta)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-display font-bold text-text leading-none",
            size === "lg" ? "text-[42px]" : "text-[22px]"
          )}
        >
          {days}
        </span>
        <span
          className={cn(
            "text-brand uppercase tracking-[1px] font-semibold",
            size === "lg" ? "text-[11px] mt-1" : "text-[8px]"
          )}
        >
          días
        </span>
      </div>
    </div>
  );
}
