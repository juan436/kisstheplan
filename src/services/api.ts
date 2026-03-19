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
  Vendor,
  VendorPayment,
  VendorActivity,
  VendorStatus,
  WebPageConfig,
  PublicWeddingData,
  RsvpSubmission,
  ScriptEntry,
  ScriptArea,
  SeatingPlan,
} from "@/types";

export interface CreateVendorData {
  name: string;
  categories: string[];
  status: VendorStatus;
  contactName?: string;
  email?: string;
  phone?: string;
  web?: string;
  social?: string;
  notes?: string;
}

export type UpdateVendorData = Partial<CreateVendorData> & {
  contractUrl?: string;
  needsStaffMenu?: boolean;
  staffCount?: number;
  staffAllergies?: string;
};

export interface CreateVendorPaymentData {
  amount: number;
  dueDate?: string | null;
  notes?: string;
}

export interface CreateVendorActivityData {
  type: "note" | "file";
  content: string;
  fileUrl?: string;
  fileName?: string;
}

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
  dueDate?: string | null;
  notes?: string | null;
}

export interface CreateTaskData {
  title: string;
  category?: string;
  stage?: string;
  dueDate?: string;
  notes?: string;
}

export interface UpdateTaskData {
  title?: string;
  status?: "done" | "pending" | "in-progress";
  dueDate?: string;
  notes?: string;
  category?: string;
  stage?: string;
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
  uploadPhoto(file: File): Promise<{ url: string }>;

  // Guest import
  importGuestsExcel(file: File): Promise<{ imported: number; guests: Guest[] }>;

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

  // Task CRUD
  getTasks(filters?: Record<string, string>): Promise<Task[]>;
  createTask(data: CreateTaskData): Promise<Task>;
  updateTask(id: string, data: UpdateTaskData): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  getTaskProgress(): Promise<{ total: number; completed: number; percentage: number }>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  createVendor(data: CreateVendorData): Promise<Vendor>;
  updateVendor(id: string, data: UpdateVendorData): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;
  addVendorPayment(vendorId: string, data: CreateVendorPaymentData): Promise<Vendor>;
  updateVendorPayment(vendorId: string, paymentId: string, data: Partial<CreateVendorPaymentData> & { paid?: boolean }): Promise<Vendor>;
  deleteVendorPayment(vendorId: string, paymentId: string): Promise<Vendor>;
  addVendorActivity(vendorId: string, data: CreateVendorActivityData): Promise<Vendor>;

  // Script (Guión del Día)
  getScriptEntries(): Promise<ScriptEntry[]>;
  createScriptEntry(data: Partial<ScriptEntry>): Promise<ScriptEntry>;
  updateScriptEntry(id: string, data: Partial<ScriptEntry>): Promise<ScriptEntry>;
  deleteScriptEntry(id: string): Promise<void>;
  reorderScriptEntries(ids: string[]): Promise<ScriptEntry[]>;
  getScriptAreas(): Promise<ScriptArea[]>;
  createScriptArea(data: { name: string; imageUrl?: string }): Promise<ScriptArea>;
  updateScriptArea(id: string, data: { name?: string; imageUrl?: string }): Promise<ScriptArea>;
  deleteScriptArea(id: string): Promise<void>;

  // Seating Plans
  getSeatingPlans(): Promise<SeatingPlan[]>;
  createSeatingPlan(name: string): Promise<SeatingPlan>;
  updateSeatingPlan(planId: string, name: string): Promise<SeatingPlan>;
  deleteSeatingPlan(planId: string): Promise<void>;
  addSeatingTable(planId: string, data: { name: string; shape: "round" | "rectangular"; capacity: number; posX: number; posY: number }): Promise<SeatingPlan>;
  updateSeatingTable(planId: string, tableId: string, data: Partial<{ name: string; shape: "round" | "rectangular"; capacity: number; posX: number; posY: number }>): Promise<SeatingPlan>;
  deleteSeatingTable(planId: string, tableId: string): Promise<SeatingPlan>;
  assignSeat(planId: string, tableId: string, seatNumber: number, guestId?: string): Promise<SeatingPlan>;

  // Web Page
  getWebPage(): Promise<WebPageConfig | null>;
  createWebPage(data: Partial<WebPageConfig>): Promise<WebPageConfig>;
  updateWebPage(data: Partial<WebPageConfig>): Promise<WebPageConfig>;
  publishWebPage(): Promise<WebPageConfig>;
  unpublishWebPage(): Promise<WebPageConfig>;
  getPublicWedding(slug: string): Promise<PublicWeddingData>;
  submitRsvp(slug: string, data: RsvpSubmission): Promise<{ success: boolean; message: string }>;
}
