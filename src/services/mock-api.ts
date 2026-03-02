import type { ApiService } from "./api";
import type { GuestStats, BudgetSummary, Guest, GuestGroup, ExpenseCategory, PaymentSchedule, WebPageConfig, PublicWeddingData } from "@/types";
import { mockUser, mockWedding } from "@/data/mock-wedding";
import { mockGuests as initialGuests } from "@/data/mock-guests";
import { mockBudget as initialBudget } from "@/data/mock-budget";
import { mockTasks } from "@/data/mock-tasks";
import { mockPayments as initialPayments } from "@/data/mock-payments";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mutable copies for CRUD operations in mock mode
let mockGuests = [...initialGuests];
let mockBudget = initialBudget.map((c) => ({ ...c, items: [...c.items] }));
let mockPaymentsList = [...initialPayments];
let nextId = 1000;

let mockGroups: GuestGroup[] = [];
let mockWebPage: WebPageConfig | null = null;

function genId() {
  return String(++nextId);
}

export const mockApi: ApiService = {
  async getUser() {
    await delay(200);
    return mockUser;
  },

  async getWedding() {
    await delay(200);
    return mockWedding;
  },

  async updateWedding(id, data) {
    await delay(200);
    Object.assign(mockWedding, data);
    return mockWedding;
  },

  async getGuests(filters?: Record<string, string>) {
    await delay(200);
    let result = [...mockGuests];
    if (filters?.rsvp) {
      result = result.filter((g) => g.rsvp === filters.rsvp);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q));
    }
    return result;
  },

  async getGuestStats(): Promise<GuestStats> {
    await delay(100);
    const total = mockGuests.length;
    const confirmed = mockGuests.filter((g) => g.rsvp === "confirmed").length;
    const pending = mockGuests.filter((g) => g.rsvp === "pending").length;
    const rejected = mockGuests.filter((g) => g.rsvp === "rejected").length;
    return { total, confirmed, pending, rejected };
  },

  async createGuest(data): Promise<Guest> {
    await delay(200);
    const guest: Guest = {
      id: genId(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email || "",
      rsvp: data.rsvpStatus || "pending",
      dish: (data.mealChoice as Guest["dish"]) || "",
      allergies: data.allergies || "",
      transport: data.transport || false,
      plusOne: false,
      role: data.role || "",
    };
    mockGuests.push(guest);
    return guest;
  },

  async updateGuest(id, data): Promise<Guest> {
    await delay(200);
    const idx = mockGuests.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error("Invitado no encontrado");
    const existing = mockGuests[idx];
    const updated: Guest = {
      ...existing,
      ...(data.firstName !== undefined || data.lastName !== undefined
        ? { name: `${data.firstName ?? existing.name.split(" ")[0]} ${data.lastName ?? existing.name.split(" ").slice(1).join(" ")}`.trim() }
        : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.rsvpStatus !== undefined ? { rsvp: data.rsvpStatus } : {}),
      ...(data.mealChoice !== undefined ? { dish: data.mealChoice as Guest["dish"] } : {}),
      ...(data.allergies !== undefined ? { allergies: data.allergies } : {}),
      ...(data.transport !== undefined ? { transport: data.transport } : {}),
      ...(data.role !== undefined ? { role: data.role as Guest["role"] } : {}),
    };
    mockGuests[idx] = updated;
    return updated;
  },

  async deleteGuest(id) {
    await delay(200);
    mockGuests = mockGuests.filter((g) => g.id !== id);
  },

  // Guest Groups
  async getGuestGroups(): Promise<GuestGroup[]> {
    await delay(200);
    return mockGroups;
  },

  async createGuestGroup(name): Promise<GuestGroup> {
    await delay(200);
    const group: GuestGroup = { id: genId(), name };
    mockGroups.push(group);
    return group;
  },

  async updateGuestGroup(id, name): Promise<GuestGroup> {
    await delay(200);
    const g = mockGroups.find((g) => g.id === id);
    if (!g) throw new Error("Grupo no encontrado");
    g.name = name;
    return g;
  },

  async deleteGuestGroup(id): Promise<void> {
    await delay(200);
    mockGroups = mockGroups.filter((g) => g.id !== id);
    // Unassign guests from this group
    mockGuests.forEach((g) => {
      if (g.groupId === id) g.groupId = undefined;
    });
  },

  async getBudgetCategories() {
    await delay(200);
    return mockBudget;
  },

  async getBudgetSummary(): Promise<BudgetSummary> {
    await delay(200);
    let totalEstimated = 0;
    let totalReal = 0;
    let totalPaid = 0;
    for (const cat of mockBudget) {
      for (const item of cat.items) {
        totalEstimated += item.estimated;
        totalReal += item.real;
        totalPaid += item.paid;
      }
    }
    return {
      totalEstimated,
      totalReal,
      totalPaid,
      totalPending: totalReal - totalPaid,
    };
  },

  async createCategory(data): Promise<ExpenseCategory> {
    await delay(200);
    const cat: ExpenseCategory = { id: genId(), name: data.name, items: [] };
    mockBudget.push(cat);
    return cat;
  },

  async updateCategory(id, data): Promise<ExpenseCategory> {
    await delay(200);
    const cat = mockBudget.find((c) => c.id === id);
    if (!cat) throw new Error("Categoría no encontrada");
    cat.name = data.name;
    return cat;
  },

  async deleteCategory(id) {
    await delay(200);
    mockBudget = mockBudget.filter((c) => c.id !== id);
  },

  async createItem(categoryId, data): Promise<ExpenseCategory> {
    await delay(200);
    const cat = mockBudget.find((c) => c.id === categoryId);
    if (!cat) throw new Error("Categoría no encontrada");
    cat.items.push({
      id: genId(),
      categoryId,
      concept: data.concept,
      estimated: data.estimated || 0,
      real: data.actual || 0,
      paid: 0,
    });
    return cat;
  },

  async updateItem(categoryId, itemId, data): Promise<ExpenseCategory> {
    await delay(200);
    const cat = mockBudget.find((c) => c.id === categoryId);
    if (!cat) throw new Error("Categoría no encontrada");
    const item = cat.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Item no encontrado");
    if (data.concept !== undefined) item.concept = data.concept;
    if (data.estimated !== undefined) item.estimated = data.estimated;
    if (data.actual !== undefined) item.real = data.actual;
    return cat;
  },

  async deleteItem(categoryId, itemId) {
    await delay(200);
    const cat = mockBudget.find((c) => c.id === categoryId);
    if (!cat) throw new Error("Categoría no encontrada");
    cat.items = cat.items.filter((i) => i.id !== itemId);
  },

  async getPayments(): Promise<PaymentSchedule[]> {
    await delay(200);
    return mockPaymentsList;
  },

  async createPayment(data): Promise<PaymentSchedule> {
    await delay(200);
    const payment: PaymentSchedule = {
      id: genId(),
      vendorName: "",
      concept: "",
      amount: data.amount,
      dueDate: data.dueDate,
      paid: false,
    };
    mockPaymentsList.push(payment);
    return payment;
  },

  async updatePayment(id, data): Promise<PaymentSchedule> {
    await delay(200);
    const idx = mockPaymentsList.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Pago no encontrado");
    const existing = mockPaymentsList[idx];
    mockPaymentsList[idx] = {
      ...existing,
      ...(data.vendorName !== undefined ? { vendorName: data.vendorName } : {}),
      ...(data.concept !== undefined ? { concept: data.concept } : {}),
      ...(data.amount !== undefined ? { amount: data.amount } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
      ...(data.paid !== undefined ? { paid: data.paid } : {}),
      ...(data.paidAt !== undefined ? { paid: !!data.paidAt } : {}),
    };
    return mockPaymentsList[idx];
  },

  async deletePayment(id): Promise<void> {
    await delay(200);
    mockPaymentsList = mockPaymentsList.filter((p) => p.id !== id);
  },

  async getUpcomingTasks() {
    await delay(200);
    return mockTasks
      .filter((t) => t.status !== "done")
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
  },

  async getUpcomingPayments() {
    await delay(200);
    return mockPaymentsList
      .filter((p) => !p.paid)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  },

  // Web Page (mock)
  async getWebPage(): Promise<WebPageConfig | null> {
    await delay(200);
    return mockWebPage;
  },

  async createWebPage(data): Promise<WebPageConfig> {
    await delay(200);
    mockWebPage = {
      id: genId(),
      templateId: "classic",
      colorPalette: { primary: "#C4B7A6", accent: "#c7a977", bg: "#FAF7F2", text: "#4A3C32" },
      fontTitle: "Playfair Display",
      fontBody: "Quicksand",
      rsvpEnabled: true,
      rsvpDeadline: null,
      mealOptions: ["Carne", "Pescado", "Vegetariano", "Infantil"],
      transportOptions: [],
      heroTitle: "Lucía & Pablo",
      heroSubtitle: "",
      storyText: "",
      scheduleText: "",
      locationText: "",
      transportText: "",
      accommodationText: "",
      dressCode: "",
      customSections: [],
      isPublished: false,
      publishedAt: null,
      ...data,
    };
    return mockWebPage!;
  },

  async updateWebPage(data): Promise<WebPageConfig> {
    await delay(200);
    if (!mockWebPage) throw new Error("No web page");
    mockWebPage = { ...mockWebPage, ...data };
    return mockWebPage;
  },

  async publishWebPage(): Promise<WebPageConfig> {
    await delay(200);
    if (!mockWebPage) throw new Error("No web page");
    mockWebPage.isPublished = true;
    mockWebPage.publishedAt = new Date().toISOString();
    return mockWebPage;
  },

  async unpublishWebPage(): Promise<WebPageConfig> {
    await delay(200);
    if (!mockWebPage) throw new Error("No web page");
    mockWebPage.isPublished = false;
    return mockWebPage;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPublicWedding(slug): Promise<PublicWeddingData> {
    await delay(200);
    if (!mockWebPage?.isPublished) throw new Error("Not published");
    return {
      wedding: {
        partner1Name: mockWedding.partner1Name,
        partner2Name: mockWedding.partner2Name,
        date: mockWedding.date,
        venue: mockWedding.venue,
        location: mockWedding.location,
        slug: mockWedding.slug,
      },
      page: mockWebPage,
    };
  },

  async submitRsvp(slug, data) {
    await delay(200);
    const guest = mockGuests.find(
      (g) => g.name.toLowerCase() === data.guestName.toLowerCase()
    );
    if (!guest) throw new Error("Invitado no encontrado");
    guest.rsvp = data.rsvpStatus;
    if (data.mealChoice) guest.dish = data.mealChoice as Guest["dish"];
    if (data.allergies !== undefined) guest.allergies = data.allergies;
    if (data.transport !== undefined) guest.transport = data.transport;
    return { success: true, message: "RSVP actualizado" };
  },
};
