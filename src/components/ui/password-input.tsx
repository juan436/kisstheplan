"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function PasswordInput({ className, error, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={cn(
          "w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text placeholder:text-brand outline-none transition-all duration-200 pr-11",
          "focus:border-cta focus:bg-white",
          error && "border-danger",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        tabIndex={-1}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand hover:text-accent transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
