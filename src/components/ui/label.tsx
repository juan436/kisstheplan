import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-[11.5px] font-bold text-accent uppercase tracking-[1px] mb-2",
        className
      )}
      {...props}
    />
  );
}
