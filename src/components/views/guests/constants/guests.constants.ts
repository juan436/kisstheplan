import type { GuestRole } from "@/types";

export const RSVP_FILTERS = [
  { value: "", label: "Todos" },
  { value: "confirmed", label: "Confirmados" },
  { value: "pending",   label: "Pendientes" },
  { value: "rejected",  label: "Rechazados" },
] as const;

export const ROLE_OPTIONS: { value: GuestRole; label: string }[] = [
  { value: "", label: "—" },
  { value: "groom",        label: "Novio" },
  { value: "bride",        label: "Novia" },
  { value: "family_groom", label: "Fam. novio" },
  { value: "family_bride", label: "Fam. novia" },
  { value: "child",        label: "Niño/a" },
  { value: "baby",         label: "Bebé" },
];

export const ROLE_LABELS: Record<string, string> = {
  groom: "Novio", bride: "Novia",
  family_groom: "Fam. novio", family_bride: "Fam. novia",
  child: "Niño/a", baby: "Bebé",
};

export type ColKey = "lastName" | "email" | "role" | "group" | "allergies" | "address" | "transport" | "list" | "invitationSent";

export const ALL_COLS: { key: ColKey; label: string }[] = [
  { key: "lastName",  label: "Apellidos" },
  { key: "email",     label: "Email" },
  { key: "role",      label: "Rol" },
  { key: "group",     label: "Grupo" },
  { key: "allergies", label: "Alergias" },
  { key: "address",   label: "Dirección" },
  { key: "list",      label: "Lista" },
  { key: "transport", label: "Transporte" },
  { key: "invitationSent", label: "Invitación" },
];
