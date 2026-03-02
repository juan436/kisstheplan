export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Wedding {
  id: string;
  partner1Name: string;
  partner2Name: string;
  date: string;
  venue: string;
  location: string;
  estimatedGuests: number;
  estimatedBudget: number;
  photoUrl?: string;
  slug: string;
}

export type RsvpStatus = "confirmed" | "pending" | "rejected";
export type DishChoice = "Carne" | "Pescado" | "Vegetariano" | "Infantil" | "";
export type GuestRole = "groom" | "bride" | "family_groom" | "family_bride" | "child" | "baby" | "";

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  groupId?: string;
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

export interface ExpenseCategory {
  id: string;
  name: string;
  items: ExpenseItem[];
}

export interface ExpenseItem {
  id: string;
  categoryId: string;
  concept: string;
  estimated: number;
  real: number;
  paid: number;
}

export interface BudgetSummary {
  totalEstimated: number;
  totalReal: number;
  totalPaid: number;
  totalPending: number;
}

export interface PaymentSchedule {
  id: string;
  vendorName: string;
  concept: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export type TaskStatus = "done" | "pending" | "in-progress";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
  category?: string;
}

export interface WebPageConfig {
  id: string;
  templateId: string;
  colorPalette: Record<string, string>;
  fontTitle: string;
  fontBody: string;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  mealOptions: string[];
  transportOptions: string[];
  heroTitle: string;
  heroSubtitle: string;
  storyText: string;
  scheduleText: string;
  locationText: string;
  transportText: string;
  accommodationText: string;
  dressCode: string;
  customSections: Array<{ title: string; content: string }>;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface PublicWeddingData {
  wedding: {
    partner1Name: string;
    partner2Name: string;
    date: string;
    venue: string;
    location: string;
    slug: string;
  };
  page: Omit<WebPageConfig, "id" | "isPublished" | "publishedAt">;
}

export interface RsvpSubmission {
  guestName: string;
  rsvpStatus: "confirmed" | "rejected";
  mealChoice?: string;
  allergies?: string;
  transport?: boolean;
  transportPickupPoint?: string;
}

export interface SeatingPlan {
  id: string;
  tables: TableSeat[];
}

export interface TableSeat {
  id: string;
  name: string;
  shape: "round" | "rectangular";
  capacity: number;
  assignments: SeatAssignment[];
}

export interface SeatAssignment {
  seatNumber: number;
  guestId?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
