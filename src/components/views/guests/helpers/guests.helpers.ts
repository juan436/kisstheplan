import type { UpdateGuestData } from "@/services/api";
import type { RsvpStatus, GuestRole } from "@/types";

/**
 * Convierte un nombre de campo de celda inline + valor string
 * al objeto UpdateGuestData que espera la API.
 * Centraliza el mapeo en un único lugar (SRP).
 */
export function buildGuestUpdate(field: string, value: string): UpdateGuestData {
  const u: UpdateGuestData = {};
  if      (field === "firstName")  u.firstName  = value;
  else if (field === "lastName")   u.lastName   = value;
  else if (field === "email")      u.email      = value;
  else if (field === "dish")       u.mealChoice = value;
  else if (field === "allergies")  u.allergies  = value;
  else if (field === "address")    (u as Record<string, unknown>).address = value;
  else if (field === "rsvp")       u.rsvpStatus = value as RsvpStatus;
  else if (field === "transport")  u.transport  = value === "true";
  else if (field === "role")       u.role       = value as GuestRole;
  else if (field === "list")       u.listName   = value;
  return u;
}
