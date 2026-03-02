import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("bg-white border border-border", {
  variants: {
    variant: {
      default: "rounded-xl shadow-card",
      elevated: "rounded-2xl shadow-elevated",
    },
    padding: {
      default: "p-6",
      compact: "p-4",
      none: "p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}
