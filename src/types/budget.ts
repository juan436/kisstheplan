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
  dueDate?: string | null;
  notes?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
}

export interface BudgetSummary {
  totalEstimated: number;
  totalReal: number;
  totalPaid: number;
  totalPending: number;
}

export interface PaymentSchedule {
  id: string;
  categoryId?: string | null;
  vendorName: string;
  concept: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  notes?: string;
}

export interface LinkedBudgetItem {
  catId: string;
  itemId: string;
  concept: string;
  real: number;
}

export interface VendorBudgetPaymentsResult {
  isLinked: boolean;
  linkedItems: LinkedBudgetItem[];
  payments: ItemPayment[];
}

export interface ItemPayment {
  id: string;
  itemId: string | null;
  categoryId: string | null;
  concept: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  notes?: string | null;
}
