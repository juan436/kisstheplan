import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "default";
  className?: string;
}

export function Avatar({ name, size = "default", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full bg-fill1 border-2 border-white/30 flex items-center justify-center font-body font-semibold text-accent",
        size === "sm" ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-[13px]",
        className
      )}
    >
      {initials}
    </div>
  );
}
