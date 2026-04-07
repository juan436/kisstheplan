export type VendorStatus = "confirmed" | "considering";

export interface VendorPayment {
  id: string;
  amount: number;
  dueDate?: string | null;
  paid: boolean;
  notes?: string;
}

export interface VendorActivity {
  id: string;
  type: "note" | "file";
  content: string;
  fileUrl?: string;
  fileName?: string;
  author: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  categories: string[];
  status: VendorStatus;
  totalAmount?: number;
  contactName?: string;
  email?: string;
  phone?: string;
  web?: string;
  social?: string;
  contractUrl?: string;
  needsStaffMenu?: boolean;
  staffCount?: number;
  staffAllergies?: string;
  notes?: string;
  payments: VendorPayment[];
  activity: VendorActivity[];
}
