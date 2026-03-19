import type { ApiService } from "./api";
import type { GuestStats, BudgetSummary, Guest, GuestGroup, ExpenseCategory, PaymentSchedule, Task, WebPageConfig, PublicWeddingData, Vendor, ScriptEntry, ScriptArea, SeatingPlan } from "@/types";
import { mockUser, mockWedding } from "@/data/mock-wedding";
import { mockGuests as initialGuests } from "@/data/mock-guests";
import { mockBudget as initialBudget } from "@/data/mock-budget";
import { mockTasks as initialTasks } from "@/data/mock-tasks";
import { mockPayments as initialPayments } from "@/data/mock-payments";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mutable copies for CRUD operations in mock mode
let mockGuests = [...initialGuests];
let mockBudget = initialBudget.map((c) => ({ ...c, items: [...c.items] }));
let mockPaymentsList = [...initialPayments];
let nextId = 1000;

let mockTasksList: Task[] = initialTasks.map((t) => ({ ...t }));
let mockGroups: GuestGroup[] = [];
let mockWebPage: WebPageConfig | null = null;

const genId = () => String(++nextId);

let mockScriptEntries: ScriptEntry[] = [
  { id: "se1", timeType: "exact", timeStart: "09:00", title: "Maquillaje y peluquería", description: "Preparativos de los novios", style: {}, order: 0 },
  { id: "se2", timeType: "exact", timeStart: "17:00", title: "Llegada de invitados", description: "Recepción en la entrada", style: {}, order: 1 },
  { id: "se3", timeType: "range", timeStart: "17:30", timeEnd: "18:15", title: "Ceremonia", description: "Intercambio de votos y anillos", style: {}, order: 2 },
  { id: "se4", timeType: "range", timeStart: "18:30", timeEnd: "20:00", title: "Banquete y cocktail", description: "Cóctel de bienvenida y aperitivos", style: {}, order: 3 },
  { id: "se5", timeType: "exact", timeStart: "20:00", title: "Cena", description: "Menú degustación", style: {}, order: 4 },
  { id: "se6", timeType: "exact", timeStart: "22:30", title: "Corte de tarta", description: "", style: {}, order: 5 },
  { id: "se7", timeType: "exact", timeStart: "23:00", title: "Fiesta y barra libre", description: "Primer baile y celebración", style: {}, order: 6 },
];
let mockScriptAreas: ScriptArea[] = [
  { id: "sa1", name: "Parking", order: 0 },
  { id: "sa2", name: "Jardín principal", order: 1 },
  { id: "sa3", name: "Clastra", order: 2 },
  { id: "sa4", name: "Sala interior", order: 3 },
];

let mockSeatingPlans: SeatingPlan[] = [
  {
    id: "sp1",
    name: "Cena",
    tables: [
      {
        id: "t1", name: "Mesa 1", shape: "round", capacity: 8, posX: 80, posY: 80,
        assignments: [
          { seatNumber: 1, guestId: "1" },
          { seatNumber: 2, guestId: "2" },
          { seatNumber: 3 },
          { seatNumber: 4 },
          { seatNumber: 5 },
          { seatNumber: 6 },
          { seatNumber: 7 },
          { seatNumber: 8 },
        ],
      },
      {
        id: "t2", name: "Mesa 2", shape: "round", capacity: 6, posX: 280, posY: 80,
        assignments: [
          { seatNumber: 1, guestId: "3" },
          { seatNumber: 2, guestId: "4" },
          { seatNumber: 3 },
          { seatNumber: 4 },
          { seatNumber: 5 },
          { seatNumber: 6 },
        ],
      },
      {
        id: "t3", name: "Mesa de honor", shape: "rectangular", capacity: 10, posX: 160, posY: 280,
        assignments: [
          { seatNumber: 1, guestId: "5" },
          { seatNumber: 2, guestId: "6" },
          { seatNumber: 3 },
          { seatNumber: 4 },
          { seatNumber: 5 },
          { seatNumber: 6 },
          { seatNumber: 7 },
          { seatNumber: 8 },
          { seatNumber: 9 },
          { seatNumber: 10 },
        ],
      },
    ],
  },
  {
    id: "sp2",
    name: "Aperitivo",
    tables: [
      {
        id: "t4", name: "Cocktail 1", shape: "round", capacity: 4, posX: 100, posY: 120,
        assignments: [
          { seatNumber: 1 },
          { seatNumber: 2 },
          { seatNumber: 3 },
          { seatNumber: 4 },
        ],
      },
      {
        id: "t5", name: "Cocktail 2", shape: "round", capacity: 4, posX: 300, posY: 120,
        assignments: [
          { seatNumber: 1 },
          { seatNumber: 2 },
          { seatNumber: 3 },
          { seatNumber: 4 },
        ],
      },
      {
        id: "t6", name: "Mesa buffet", shape: "rectangular", capacity: 0, posX: 180, posY: 260,
        assignments: [],
      },
    ],
  },
];

let mockVendors: Vendor[] = [
  {
    id: "v1", name: "Finca Tagamanent", categories: ["Finca"], status: "confirmed",
    contactName: "Maria García", email: "info@tagamanent.com", phone: "93 123 45 67",
    web: "www.tagamanent.com", social: "@tagamanent", contractUrl: undefined,
    needsStaffMenu: false, notes: "Incluye servicio de parking y jardines.",
    payments: [
      { id: "vp1", amount: 3000, dueDate: "2026-03-15", paid: true, notes: "Señal" },
      { id: "vp2", amount: 3000, dueDate: "2026-07-01", paid: false, notes: "Segundo pago" },
    ],
    activity: [
      { id: "va1", type: "note", content: "Confirmada la fecha con el responsable", author: "Lucía", createdAt: "2026-02-10T10:00:00Z" },
    ],
  },
  {
    id: "v2", name: "Catering Moments", categories: ["Catering"], status: "confirmed",
    contactName: "Jordi Puig", email: "jordi@moments.es", phone: "93 456 78 90",
    web: "www.cateringmoments.es", social: "", contractUrl: undefined,
    needsStaffMenu: true, staffCount: 8, staffAllergies: "Gluten (2 personas)",
    notes: "Menú degustación pendiente de confirmar.",
    payments: [
      { id: "vp3", amount: 5000, dueDate: "2026-04-01", paid: false, notes: "" },
      { id: "vp4", amount: 7000, dueDate: "2026-08-15", paid: false, notes: "" },
    ],
    activity: [],
  },
  {
    id: "v3", name: "Foto & Film Studio", categories: ["Fotografía", "Vídeo"], status: "considering",
    contactName: "Ana López", email: "ana@fotostudio.es", phone: "666 123 456",
    web: "", social: "@fotostudio_es", contractUrl: undefined,
    needsStaffMenu: false, notes: "",
    payments: [
      { id: "vp5", amount: 2500, dueDate: "2026-06-01", paid: false, notes: "Pago único" },
    ],
    activity: [],
  },
];

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

  async importGuestsExcel(_file: File) {
    await delay(600);
    // Mock: return empty import result (no real xlsx parsing in mock)
    return { imported: 0, guests: [] as import("@/types").Guest[] };
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

  async getUpcomingTasks() {
    await delay(200);
    return mockTasksList
      .filter((t) => t.status !== "done" && t.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  },

  // Task CRUD
  async getTasks(filters?: Record<string, string>) {
    await delay(200);
    let result = [...mockTasksList];
    if (filters?.status) result = result.filter((t) => t.status === filters.status);
    if (filters?.category) result = result.filter((t) => t.category === filters.category);
    if (filters?.stage) result = result.filter((t) => t.stage === filters.stage);
    return result;
  },

  async createTask(data) {
    await delay(200);
    const task: Task = {
      id: genId(),
      title: data.title,
      status: "pending",
      category: data.category,
      stage: data.stage,
      dueDate: data.dueDate,
      notes: data.notes,
    };
    mockTasksList.push(task);
    return task;
  },

  async updateTask(id, data) {
    await delay(200);
    const idx = mockTasksList.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Tarea no encontrada");
    const existing = mockTasksList[idx];
    mockTasksList[idx] = {
      ...existing,
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.stage !== undefined ? { stage: data.stage } : {}),
    };
    return mockTasksList[idx];
  },

  async deleteTask(id) {
    await delay(200);
    mockTasksList = mockTasksList.filter((t) => t.id !== id);
  },

  async getTaskProgress() {
    await delay(100);
    const total = mockTasksList.length;
    const completed = mockTasksList.filter((t) => t.status === "done").length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  },

  async getUpcomingPayments() {
    await delay(200);
    return mockPaymentsList
      .filter((p) => !p.paid)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  async uploadPhoto(file: File) {
    await delay(300);
    const url = URL.createObjectURL(file);
    // Persist in mock wedding for the session
    Object.assign(mockWedding, { photoUrl: url });
    return { url };
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

  // Vendors
  async getVendors() {
    await delay(200);
    return [...mockVendors];
  },

  async createVendor(data) {
    await delay(200);
    const vendor: Vendor = {
      id: genId(), payments: [], activity: [],
      needsStaffMenu: false, ...data,
    };
    mockVendors.push(vendor);
    return vendor;
  },

  async updateVendor(id, data) {
    await delay(200);
    const idx = mockVendors.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error("Vendor not found");
    mockVendors[idx] = { ...mockVendors[idx], ...data };
    return mockVendors[idx];
  },

  async deleteVendor(id) {
    await delay(200);
    mockVendors = mockVendors.filter((v) => v.id !== id);
  },

  async addVendorPayment(vendorId, data) {
    await delay(200);
    const vendor = mockVendors.find((v) => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    vendor.payments.push({ id: genId(), paid: false, ...data });
    return vendor;
  },

  async updateVendorPayment(vendorId, paymentId, data) {
    await delay(200);
    const vendor = mockVendors.find((v) => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    const pidx = vendor.payments.findIndex((p) => p.id === paymentId);
    if (pidx !== -1) vendor.payments[pidx] = { ...vendor.payments[pidx], ...data };
    return vendor;
  },

  async deleteVendorPayment(vendorId, paymentId) {
    await delay(200);
    const vendor = mockVendors.find((v) => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    vendor.payments = vendor.payments.filter((p) => p.id !== paymentId);
    return vendor;
  },

  async addVendorActivity(vendorId, data) {
    await delay(200);
    const vendor = mockVendors.find((v) => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    vendor.activity.unshift({
      id: genId(), author: "Tú", createdAt: new Date().toISOString(), ...data,
    });
    return vendor;
  },

  // Seating Plans
  async getSeatingPlans(): Promise<SeatingPlan[]> {
    await delay(200);
    return mockSeatingPlans.map((p) => ({ ...p, tables: p.tables.map((t) => ({ ...t, assignments: [...t.assignments] })) }));
  },
  async createSeatingPlan(name: string): Promise<SeatingPlan> {
    await delay(200);
    const plan: SeatingPlan = { id: genId(), name, tables: [] };
    mockSeatingPlans.push(plan);
    return plan;
  },
  async updateSeatingPlan(planId: string, name: string): Promise<SeatingPlan> {
    await delay(200);
    const plan = mockSeatingPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan no encontrado");
    plan.name = name;
    return plan;
  },
  async deleteSeatingPlan(planId: string): Promise<void> {
    await delay(200);
    mockSeatingPlans = mockSeatingPlans.filter((p) => p.id !== planId);
  },
  async addSeatingTable(planId: string, data: { name: string; shape: "round" | "rectangular"; capacity: number; posX: number; posY: number }): Promise<SeatingPlan> {
    await delay(200);
    const plan = mockSeatingPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan no encontrado");
    const assignments = Array.from({ length: data.capacity }, (_, i) => ({ seatNumber: i + 1 }));
    plan.tables.push({ id: genId(), name: data.name, shape: data.shape, capacity: data.capacity, posX: data.posX, posY: data.posY, assignments });
    return plan;
  },
  async updateSeatingTable(planId: string, tableId: string, data: Partial<{ name: string; shape: "round" | "rectangular"; capacity: number; posX: number; posY: number }>): Promise<SeatingPlan> {
    await delay(200);
    const plan = mockSeatingPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan no encontrado");
    const table = plan.tables.find((t) => t.id === tableId);
    if (!table) throw new Error("Mesa no encontrada");
    if (data.name !== undefined) table.name = data.name;
    if (data.shape !== undefined) table.shape = data.shape;
    if (data.posX !== undefined) table.posX = data.posX;
    if (data.posY !== undefined) table.posY = data.posY;
    if (data.capacity !== undefined && data.capacity !== table.capacity) {
      const newAssignments = Array.from({ length: data.capacity }, (_, i) => {
        return table.assignments.find((a) => a.seatNumber === i + 1) ?? { seatNumber: i + 1 };
      });
      table.assignments = newAssignments;
      table.capacity = data.capacity;
    }
    return plan;
  },
  async deleteSeatingTable(planId: string, tableId: string): Promise<SeatingPlan> {
    await delay(200);
    const plan = mockSeatingPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan no encontrado");
    plan.tables = plan.tables.filter((t) => t.id !== tableId);
    return plan;
  },
  async assignSeat(planId: string, tableId: string, seatNumber: number, guestId?: string): Promise<SeatingPlan> {
    await delay(200);
    const plan = mockSeatingPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan no encontrado");
    const table = plan.tables.find((t) => t.id === tableId);
    if (!table) throw new Error("Mesa no encontrada");
    const seat = table.assignments.find((a) => a.seatNumber === seatNumber);
    if (seat) {
      seat.guestId = guestId || undefined;
    }
    return plan;
  },

  // Script (Guión del Día) - mock data
  async getScriptEntries(): Promise<ScriptEntry[]> {
    await delay(200);
    return mockScriptEntries;
  },
  async createScriptEntry(data): Promise<ScriptEntry> {
    await delay(200);
    const entry: ScriptEntry = {
      id: genId(),
      timeType: data.timeType ?? "none",
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      title: data.title ?? "Nueva entrada",
      description: data.description,
      style: data.style ?? {},
      order: data.order ?? mockScriptEntries.length,
    };
    mockScriptEntries.push(entry);
    return entry;
  },
  async updateScriptEntry(id, data): Promise<ScriptEntry> {
    await delay(200);
    const idx = mockScriptEntries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Not found");
    mockScriptEntries[idx] = { ...mockScriptEntries[idx], ...data };
    return mockScriptEntries[idx];
  },
  async deleteScriptEntry(id): Promise<void> {
    await delay(200);
    mockScriptEntries = mockScriptEntries.filter((e) => e.id !== id);
  },
  async reorderScriptEntries(ids): Promise<ScriptEntry[]> {
    await delay(200);
    ids.forEach((id, index) => {
      const e = mockScriptEntries.find((x) => x.id === id);
      if (e) e.order = index;
    });
    mockScriptEntries.sort((a, b) => a.order - b.order);
    return mockScriptEntries;
  },
  async getScriptAreas(): Promise<ScriptArea[]> {
    await delay(200);
    return mockScriptAreas;
  },
  async createScriptArea(data): Promise<ScriptArea> {
    await delay(200);
    const area: ScriptArea = { id: genId(), name: data.name, imageUrl: data.imageUrl, order: mockScriptAreas.length };
    mockScriptAreas.push(area);
    return area;
  },
  async updateScriptArea(id, data): Promise<ScriptArea> {
    await delay(200);
    const idx = mockScriptAreas.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Not found");
    mockScriptAreas[idx] = { ...mockScriptAreas[idx], ...data };
    return mockScriptAreas[idx];
  },
  async deleteScriptArea(id): Promise<void> {
    await delay(200);
    mockScriptAreas = mockScriptAreas.filter((a) => a.id !== id);
  },
};
