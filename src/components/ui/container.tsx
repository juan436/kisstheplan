import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-[1200px] mx-auto px-6", className)}
      {...props}
    />
  );
}
