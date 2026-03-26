import type { Guest } from "@/types";

export function tableSize(capacity: number): number {
  return Math.max(80, 80 + capacity * 8);
}

export function getGuestName(guests: Guest[], guestId?: string): string {
  if (!guestId) return "";
  const g = guests.find((g) => g.id === guestId);
  return g ? g.name : "Invitado";
}
