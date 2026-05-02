"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AddPaymentFormProps {
  suggestedAmount: number;
  onAdd: (concept: string, amount: number, dueDate: string, notes?: string) => Promise<void>;
  onCancel: () => void;
}

export function AddPaymentForm({ suggestedAmount, onAdd, onCancel }: AddPaymentFormProps) {
  const [concept, setConcept] = useState("");
  const [amount,  setAmount]  = useState(suggestedAmount > 0 ? String(suggestedAmount) : "");
  const [dueDate, setDueDate] = useState("");
  const [notes,   setNotes]   = useState("");
  const [saving,  setSaving]  = useState(false);

  const handleSubmit = async () => {
    if (!concept.trim() || !amount || !dueDate) return;
    setSaving(true);
    try {
      await onAdd(concept.trim(), Number(amount), dueDate, notes.trim() || undefined);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "bg-white border border-border/60 focus:border-cta rounded-lg px-2.5 py-1.5 text-[12px] text-text outline-none w-full transition-colors";

  return (
    <div className="mt-2 p-3 bg-bg rounded-xl border border-cta/30 space-y-2">
      <div className="grid grid-cols-[1fr_80px_110px] gap-2">
        <input autoFocus placeholder="Concepto (ej: Señal)" value={concept} onChange={(e) => setConcept(e.target.value)}
          className={inputCls} />
        <input type="number" placeholder="€" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
          className={inputCls} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
          className={inputCls + " cursor-pointer"} />
      </div>
      <input placeholder="Notas opcionales..." value={notes} onChange={(e) => setNotes(e.target.value)}
        className={inputCls} />
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="cta" size="sm" onClick={handleSubmit} disabled={saving || !concept.trim() || !amount || !dueDate}>
          {saving ? "Añadiendo..." : "Añadir pago"}
        </Button>
      </div>
    </div>
  );
}
