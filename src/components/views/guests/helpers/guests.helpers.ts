import type { UpdateGuestData } from "@/services/api";
import type { RsvpStatus, GuestRole, Guest } from "@/types";
import type { ColKey } from "../constants/guests.constants";

const LS_HIDDEN_COLS = "ktp_guests_hidden_cols";

export function loadHiddenCols(defaults: ColKey[]): Set<ColKey> {
  try {
    const stored = localStorage.getItem(LS_HIDDEN_COLS);
    if (stored) return new Set(JSON.parse(stored) as ColKey[]);
  } catch { /* ignore */ }
  return new Set(defaults);
}

export function saveHiddenCols(cols: Set<ColKey>): void {
  try {
    localStorage.setItem(LS_HIDDEN_COLS, JSON.stringify(Array.from(cols)));
  } catch { /* ignore */ }
}

export async function exportGuestsToExcel(guests: Guest[]): Promise<void> {
  const XLSX = await import("xlsx");
  const rows = guests.map((g) => ({
    Nombre: g.name,
    Apellidos: g.lastName || "",
    Email: g.email || "",
    RSVP: g.rsvp,
    Plato: g.dish || "",
    Alergias: g.allergies || "",
    Transporte: g.transport ? "Sí" : "No",
    Lista: g.listName || "A",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invitados");
  XLSX.writeFile(wb, "invitados.xlsx");
}

/**
 * Convierte un nombre de campo de celda inline + valor string
 * al objeto UpdateGuestData que espera la API.
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
