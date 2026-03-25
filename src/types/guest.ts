export type RsvpStatus = "confirmed" | "pending" | "rejected";
export type DishChoice = "Carne" | "Pescado" | "Vegetariano" | "Infantil" | "";
export type GuestRole = "groom" | "bride" | "family_groom" | "family_bride" | "child" | "baby" | "";

export interface Guest {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  groupId?: string;
  listName?: string;
  rsvp: RsvpStatus;
  dish: DishChoice;
  allergies: string;
  transport: boolean;
  plusOne: boolean;
  role: GuestRole;
  notes?: string;
}

export interface GuestGroup {
  id: string;
  name: string;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
}
