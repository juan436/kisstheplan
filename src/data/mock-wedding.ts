import type { Wedding, User } from "@/types";

export const mockUser: User = {
  id: "u1",
  email: "lucia@example.com",
  name: "Lucía García",
};

export const mockWedding: Wedding = {
  id: "w1",
  partner1Name: "Lucía",
  partner1Last: "García",
  partner1Role: "Novia",
  partner2Name: "Pablo",
  partner2Last: "Martínez",
  partner2Role: "Novio",
  date: "2026-09-12",
  venue: "Finca Tagamanent",
  location: "Barcelona",
  estimatedGuests: 300,
  estimatedBudget: 60000,
  currency: "EUR",
  timezone: "Europe/Madrid",
  slug: "lucia-y-pablo",
};
