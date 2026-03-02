import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}

export function Progress({ value, max, className }: ProgressProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn("w-full h-2 bg-bg3 rounded-pill overflow-hidden", className)}>
      <div
        className="h-full rounded-pill transition-all duration-500"
        style={{
          width: `${percentage}%`,
          background: "linear-gradient(90deg, var(--color-cta), var(--color-accent))",
        }}
      />
    </div>
  );
}
