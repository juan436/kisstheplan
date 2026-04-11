import type { VendorStatus } from "@/types";

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
  totalAmount?: number;
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
  vendorId?: string | null;
  vendorName?: string | null;
}

export interface UpdateItemData {
  concept?: string;
  estimated?: number;
  actual?: number;
  paid?: number;
  dueDate?: string | null;
  notes?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
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
  mealOptions?: string[];
  mealColors?: Record<string, string>;
  allergyOptions?: string[];
  allergyColors?: Record<string, string>;
  transportOptions?: string[];
}
