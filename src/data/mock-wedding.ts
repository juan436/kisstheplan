import type { Wedding, User } from "@/types";

export const mockUser: User = {
  id: "u1",
  email: "lucia@example.com",
  name: "Lucía García",
};

export const mockWedding: Wedding = {
  id: "w1",
  partner1Name: "Lucía",
  partner2Name: "Pablo",
  date: "2026-09-12",
  venue: "Finca Tagamanent",
  location: "Barcelona",
  estimatedGuests: 300,
  estimatedBudget: 60000,
  slug: "lucia-y-pablo",
};
