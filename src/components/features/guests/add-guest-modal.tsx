"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CreateGuestData } from "@/services/api";

interface AddGuestModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateGuestData) => Promise<void>;
}

const MEAL_OPTIONS = ["", "Carne", "Pescado", "Vegetariano", "Infantil"];
const RSVP_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "rejected", label: "Rechazado" },
] as const;
const ROLE_OPTIONS = [
  { value: "", label: "Sin asignar" },
  { value: "groom", label: "Novio" },
  { value: "bride", label: "Novia" },
  { value: "family_groom", label: "Familia del novio" },
  { value: "family_bride", label: "Familia de la novia" },
  { value: "child", label: "Niño/a" },
  { value: "baby", label: "Bebé" },
] as const;

export function AddGuestModal({ open, onClose, onAdd }: AddGuestModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mealChoice, setMealChoice] = useState("");
  const [allergies, setAllergies] = useState("");
  const [transport, setTransport] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "pending" | "rejected">("pending");
  const [role, setRole] = useState("");
  const [listName, setListName] = useState("A");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMealChoice("");
    setAllergies("");
    setTransport(false);
    setRsvpStatus("pending");
    setRole("");
    setListName("A");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onAdd({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        mealChoice: mealChoice || undefined,
        allergies: allergies.trim() || undefined,
        transport,
        rsvpStatus,
        role: (role || undefined) as CreateGuestData["role"],
        listName,
      });
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <h2 className="font-display text-[22px] text-text mb-5">Añadir invitado</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
              error={!!error && !firstName.trim()}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellidos"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ejemplo.com"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="meal">Plato</Label>
            <select
              id="meal"
              value={mealChoice}
              onChange={(e) => setMealChoice(e.target.value)}
              className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none transition-all duration-200 focus:border-cta focus:bg-white"
            >
              {MEAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt || "Sin seleccionar"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rsvp">RSVP</Label>
            <select
              id="rsvp"
              value={rsvpStatus}
              onChange={(e) => setRsvpStatus(e.target.value as "confirmed" | "pending" | "rejected")}
              className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none transition-all duration-200 focus:border-cta focus:bg-white"
            >
              {RSVP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none transition-all duration-200 focus:border-cta focus:bg-white"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="allergies">Alergias / Restricciones</Label>
          <Input
            id="allergies"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Ej: celiaco, intolerante a la lactosa..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="list">Lista</Label>
            <select
              id="list"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full bg-bg2 border-[1.5px] border-border rounded-md px-4 py-[13px] text-[14px] font-body text-text outline-none transition-all duration-200 focus:border-cta focus:bg-white"
            >
              <option value="A">Lista A</option>
              <option value="B">Lista B</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={transport}
                onChange={(e) => setTransport(e.target.checked)}
                className="w-4 h-4 rounded border-border text-cta focus:ring-cta accent-cta"
              />
              <span className="text-[13px] text-text">Necesita transporte</span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-[13px] text-danger">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="cta" disabled={saving}>
            {saving ? "Guardando..." : "Añadir invitado"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
