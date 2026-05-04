/**
 * useVendorDetail
 *
 * Qué hace: Hook personalizado para gestionar el estado de detalle, chat y actualizaciones de un proveedor.
 * Recibe:   initialVendor, onUpdate (callback).
 * Provee:   Estado del proveedor, controles de chat, referencias de scroll y manejadores de guardado/blur.
 */
"use client";

import { useState, useRef, useCallback } from "react";
import { api } from "@/services";
import type { Vendor } from "@/types";

export function useVendorDetail(
  initialVendor: Vendor,
  onUpdate: (v: Vendor) => void,
) {
  const [vendor, setVendor] = useState(initialVendor);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
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
    confirmDelete, setConfirmDelete,
    activityEndRef,
    save, handleFieldBlur, handleSendChat,
  };
}
