"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[#6b5549] text-[13px] font-semibold pl-1 uppercase tracking-wider">
        {label}
      </Label>
      {children}
    </div>
  );
}
