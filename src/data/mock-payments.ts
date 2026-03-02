import type { PaymentSchedule } from "@/types";

export const mockPayments: PaymentSchedule[] = [
  { id: "p1", vendorName: "Finca Tagamanent", concept: "2º pago finca", amount: 2500, dueDate: "2026-03-01", paid: false },
  { id: "p2", vendorName: "Catering Deluxe", concept: "Adelanto catering", amount: 5000, dueDate: "2026-03-15", paid: false },
  { id: "p3", vendorName: "Foto Moments", concept: "50% fotógrafo", amount: 1250, dueDate: "2026-04-01", paid: false },
  { id: "p4", vendorName: "Sound & Music", concept: "Señal grupo", amount: 700, dueDate: "2026-04-15", paid: false },
  { id: "p5", vendorName: "Flora Bella", concept: "Anticipo flores", amount: 900, dueDate: "2026-05-01", paid: false },
];
