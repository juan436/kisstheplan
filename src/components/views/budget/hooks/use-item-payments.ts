"use client";

import { useState, useCallback } from "react";
import { api } from "@/services";
import type { ItemPayment } from "@/types";

export function useItemPayments(catId: string, itemId: string, itemReal: number) {
  const [payments, setPayments]   = useState<ItemPayment[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!catId || !itemId) return;
    setLoading(true);
    try {
      const data = await api.getItemPayments(catId, itemId);
      setPayments(data as ItemPayment[]);
    } finally {
      setLoading(false);
    }
  }, [catId, itemId]);

  const addPayment = async (concept: string, amount: number, dueDate: string, notes?: string) => {
    await api.createItemPayment(catId, itemId, { concept, amount, dueDate, notes });
    await load();
    setShowForm(false);
  };

  const togglePaid = async (payment: ItemPayment) => {
    await api.updateBudgetPayment(payment.id, { paid: !payment.paid });
    await load();
  };

  const deletePayment = async (paymentId: string) => {
    await api.deleteBudgetPayment(paymentId);
    setDeleting(null);
    await load();
  };

  const totalAssigned = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid     = payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const totalPending  = payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);
  const unassigned    = itemReal - totalAssigned;
  const suggestedNext = unassigned > 0 ? unassigned : 0;

  return {
    payments, loading, showForm, setShowForm, deleting, setDeleting,
    load, addPayment, togglePaid, deletePayment,
    totalPaid, totalPending, unassigned, suggestedNext,
  };
}
