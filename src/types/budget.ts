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
