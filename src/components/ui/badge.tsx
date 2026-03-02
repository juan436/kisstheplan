import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.5px] px-3 py-1 rounded-pill",
  {
    variants: {
      variant: {
        confirmed: "bg-success/15 text-success",
        rejected: "bg-danger/15 text-danger",
        pending: "bg-cta/15 text-cta",
        default: "bg-bg3 text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
