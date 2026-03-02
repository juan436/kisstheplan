import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text placeholder:text-brand outline-none transition-all duration-200",
        "focus:border-cta focus:bg-white",
        error && "border-danger",
        className
      )}
      {...props}
    />
  );
}
