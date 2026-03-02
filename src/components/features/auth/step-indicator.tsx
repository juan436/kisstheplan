import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-semibold transition-all",
                  isDone && "bg-cta text-white",
                  isActive && "border-2 border-cta text-cta bg-transparent",
                  !isDone && !isActive && "border-2 border-border text-brand bg-transparent"
                )}
              >
                {isDone ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.5px] mt-2 whitespace-nowrap",
                  isDone || isActive ? "text-cta" : "text-brand"
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-[60px] h-0.5 mx-3 mt-[-18px]",
                  i < current ? "bg-cta" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
