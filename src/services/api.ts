import type {
  Wedding,
  User,
  Guest,
  GuestGroup,
  GuestStats,
  ExpenseCategory,
  BudgetSummary,
  Task,
  PaymentSchedule,
  WebPageConfig,
  PublicWeddingData,
  RsvpSubmission,
} from "@/types";

export interface CreateGuestData {
  firstName: string;
  lastName: string;
  email?: string;
  mealChoice?: string;
  allergies?: string;
  transport?: boolean;
  transportPickupPoint?: string;
  listName?: string;
  groupId?: string;
  rsvpStatus?: "confirmed" | "pending" | "rejected";
  role?: "groom" | "bride" | "family_groom" | "family_bride" | "child" | "baby" | "";
}

export type UpdateGuestData = Partial<CreateGuestData>;

export interface CreateCategoryData {
  name: string;
}

export interface CreateItemData {
  concept: string;
  estimated?: number;
  actual?: number;
}

export interface UpdateItemData {
  concept?: string;
  estimated?: number;
  actual?: number;
  paid?: number;
}

export interface CreatePaymentData {
  vendorName?: string;
  concept?: string;
  categoryId?: string;
  vendorId?: string;
  amount: number;
  dueDate: string;
  notes?: string;
}

export interface UpdateWeddingData {
  slug?: string;
  partner1Name?: string;
  partner1Last?: string;
  partner1Role?: string;
  partner2Name?: string;
  partner2Last?: string;
  partner2Role?: string;
  date?: string;
  venue?: string;
  location?: string;
  estimatedGuests?: number;
  estimatedBudget?: number;
  currency?: string;
  timezone?: string;
  photoUrl?: string;
}

export interface ApiService {
  // Read
  getUser(): Promise<User>;
  getWedding(): Promise<Wedding>;
  updateWedding(id: string, data: UpdateWeddingData): Promise<Wedding>;
  getGuests(filters?: Record<string, string>): Promise<Guest[]>;
  getGuestStats(): Promise<GuestStats>;
  getBudgetCategories(): Promise<ExpenseCategory[]>;
  getBudgetSummary(): Promise<BudgetSummary>;
  getUpcomingTasks(): Promise<Task[]>;
  getUpcomingPayments(): Promise<PaymentSchedule[]>;

  // Guest CRUD
  createGuest(data: CreateGuestData): Promise<Guest>;
  updateGuest(id: string, data: UpdateGuestData): Promise<Guest>;
  deleteGuest(id: string): Promise<void>;

  // Guest Groups
  getGuestGroups(): Promise<GuestGroup[]>;
  createGuestGroup(name: string): Promise<GuestGroup>;
  updateGuestGroup(id: string, name: string): Promise<GuestGroup>;
  deleteGuestGroup(id: string): Promise<void>;

  // Budget CRUD
  createCategory(data: CreateCategoryData): Promise<ExpenseCategory>;
  updateCategory(id: string, data: { name: string }): Promise<ExpenseCategory>;
  deleteCategory(id: string): Promise<void>;
  createItem(categoryId: string, data: CreateItemData): Promise<ExpenseCategory>;
  updateItem(categoryId: string, itemId: string, data: UpdateItemData): Promise<ExpenseCategory>;
  deleteItem(categoryId: string, itemId: string): Promise<void>;
  getPayments(): Promise<PaymentSchedule[]>;
  createPayment(data: CreatePaymentData): Promise<PaymentSchedule>;
  updatePayment(id: string, data: Partial<CreatePaymentData> & { paid?: boolean; paidAt?: string | null }): Promise<PaymentSchedule>;
  deletePayment(id: string): Promise<void>;

  // Web Page
  getWebPage(): Promise<WebPageConfig | null>;
  createWebPage(data: Partial<WebPageConfig>): Promise<WebPageConfig>;
  updateWebPage(data: Partial<WebPageConfig>): Promise<WebPageConfig>;
  publishWebPage(): Promise<WebPageConfig>;
  unpublishWebPage(): Promise<WebPageConfig>;
  getPublicWedding(slug: string): Promise<PublicWeddingData>;
  submitRsvp(slug: string, data: RsvpSubmission): Promise<{ success: boolean; message: string }>;
}
