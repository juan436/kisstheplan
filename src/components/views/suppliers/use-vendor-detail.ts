"use client";

import { useState, useRef, useCallback } from "react";
import { api } from "@/services";
import type { Vendor, VendorPayment } from "@/types";
import type { CreateVendorPaymentData } from "@/services/api";

export function useVendorDetail(
  initialVendor: Vendor,
  onUpdate: (v: Vendor) => void,
) {
  const [vendor, setVendor] = useState(initialVendor);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<CreateVendorPaymentData>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const activityEndRef = useRef<HTMLDivElement>(null);

  const save = useCallback(async (data: Parameters<typeof api.updateVendor>[1]) => {
    const updated = await api.updateVendor(vendor.id, data);
    setVendor(updated);
    onUpdate(updated);
  }, [vendor.id, onUpdate]);

  const handleFieldBlur = useCallback((field: string, value: string | boolean | number) => {
    save({ [field]: value });
  }, [save]);

  const handleTogglePaid = useCallback(async (payment: VendorPayment) => {
    const updated = await api.updateVendorPayment(vendor.id, payment.id, { paid: !payment.paid });
    setVendor(updated);
    onUpdate(updated);
  }, [vendor.id, onUpdate]);

  const handleUpdatePaymentDate = useCallback(async (paymentId: string, dueDate: string) => {
    if (!dueDate) return;
    const updated = await api.updateVendorPayment(vendor.id, paymentId, { dueDate });
    setVendor(updated);
    onUpdate(updated);
  }, [vendor.id, onUpdate]);

  const handleUpdatePaymentNotes = useCallback(async (paymentId: string, notes: string) => {
    const updated = await api.updateVendorPayment(vendor.id, paymentId, { notes });
    setVendor(updated);
    onUpdate(updated);
  }, [vendor.id, onUpdate]);

  const handleAddPayment = useCallback(async () => {
    if (!newPayment.amount) return;
    const updated = await api.addVendorPayment(vendor.id, {
      amount: newPayment.amount,
      dueDate: newPayment.dueDate || null,
      notes: newPayment.notes || "",
    });
    setVendor(updated);
    onUpdate(updated);
    setNewPayment({});
    setAddingPayment(false);
  }, [vendor.id, newPayment, onUpdate]);

  const handleDeletePayment = useCallback(async (paymentId: string) => {
    const updated = await api.deleteVendorPayment(vendor.id, paymentId);
    setVendor(updated);
    onUpdate(updated);
  }, [vendor.id, onUpdate]);

  const handleSendChat = useCallback(async () => {
    const text = chatInput.trim();
    if (!text) return;
    setSending(true);
    const updated = await api.addVendorActivity(vendor.id, { type: "note", content: text });
    setVendor(updated);
    onUpdate(updated);
    setChatInput("");
    setSending(false);
    setTimeout(() => activityEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [vendor.id, chatInput, onUpdate]);

  return {
    vendor, chatInput, setChatInput, sending,
    addingPayment, setAddingPayment,
    newPayment, setNewPayment,
    confirmDelete, setConfirmDelete,
    activityEndRef,
    save, handleFieldBlur, handleTogglePaid,
    handleUpdatePaymentDate, handleUpdatePaymentNotes,
    handleAddPayment, handleDeletePayment, handleSendChat,
  };
}
