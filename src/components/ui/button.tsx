"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        cta: "bg-cta text-white rounded-pill uppercase tracking-[2px] shadow-cta hover:brightness-110 hover:-translate-y-0.5",
        primary: "bg-accent text-white rounded-pill uppercase tracking-[2px] hover:brightness-110 hover:-translate-y-0.5",
        secondary: "bg-transparent text-accent border-[1.5px] border-border rounded-pill hover:bg-bg2",
        ghost: "bg-transparent text-accent hover:bg-bg2 rounded-md",
        outline: "bg-transparent text-cta border-2 border-cta rounded-pill hover:bg-cta hover:text-white",
      },
      size: {
        sm: "text-[12px] px-4 py-2",
        default: "text-[13px] px-6 py-3",
        lg: "text-[14px] px-8 py-4",
        full: "text-[13px] px-6 py-3 w-full",
      },
    },
    defaultVariants: {
      variant: "cta",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
