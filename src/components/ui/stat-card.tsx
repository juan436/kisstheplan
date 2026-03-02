import { cn } from "@/lib/utils";

interface StatCardProps {
  value: number | string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-[28px] font-display font-bold text-text leading-none">
        {value}
      </div>
      <div className="text-[10px] font-semibold text-brand uppercase tracking-[1.5px] mt-1">
        {label}
      </div>
    </div>
  );
}
