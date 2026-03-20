import type { ApiService } from "./api";
import type { GuestStats, BudgetSummary } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function getTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("ktp_access_token"),
    refreshToken: localStorage.getItem("ktp_refresh_token"),
  };
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("ktp_access_token", accessToken);
  localStorage.setItem("ktp_refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("ktp_access_token");
  localStorage.removeItem("ktp_refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken } = getTokens();

  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}

// --- Auth helpers (used by login/register pages) ---

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || "Credenciales incorrectas");
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function apiRegister(email: string, password: string, name: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || "Error al registrarse");
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function apiCreateWedding(data: {
  partner1Name: string;
  partner2Name: string;
  date: string;
  venue: string;
  location?: string;
  estimatedGuests: number;
  estimatedBudget: number;
}) {
  return apiFetch("/weddings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiLogout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    clearTokens();
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("ktp_access_token");
}

// --- ApiService implementation ---

export const realApi: ApiService = {
  async getUser() {
    return apiFetch("/auth/me");
  },

  async getWedding() {
    return apiFetch("/weddings/me");
  },

  async updateWedding(id, data) {
    return apiFetch(`/weddings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async getGuests(filters?: Record<string, string>) {
    const params = filters ? "?" + new URLSearchParams(filters).toString() : "";
    return apiFetch(`/guests${params}`);
  },

  async getGuestStats(): Promise<GuestStats> {
    return apiFetch("/guests/stats");
  },

  async getBudgetCategories() {
    return apiFetch("/budget/categories");
  },

  async getBudgetSummary(): Promise<BudgetSummary> {
    return apiFetch("/budget/summary");
  },

  async getUpcomingTasks() {
    return apiFetch("/tasks/upcoming");
  },

  async getUpcomingPayments() {
    return apiFetch("/budget/payments/upcoming");
  },

  async uploadPhoto(file: File) {
    const { accessToken } = getTokens();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/uploads/photo`, {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error("Error al subir la imagen");
    return res.json() as Promise<{ url: string }>;
  },

  // Guest import
  async importGuestsExcel(file: File) {
    const { accessToken } = getTokens();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/guests/import`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Error al importar el archivo");
    return res.json();
  },

  // Guest CRUD
  async createGuest(data) {
    return apiFetch("/guests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateGuest(id, data) {
    return apiFetch(`/guests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteGuest(id) {
    return apiFetch(`/guests/${id}`, { method: "DELETE" });
  },

  // Guest Groups
  async getGuestGroups() {
    return apiFetch("/guests/groups");
  },

  async createGuestGroup(name) {
    return apiFetch("/guests/groups", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async updateGuestGroup(id, name) {
    return apiFetch(`/guests/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },

  async deleteGuestGroup(id) {
    return apiFetch(`/guests/groups/${id}`, { method: "DELETE" });
  },

  // Budget CRUD
  async createCategory(data) {
    return apiFetch("/budget/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id, data) {
    return apiFetch(`/budget/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id) {
    return apiFetch(`/budget/categories/${id}`, { method: "DELETE" });
  },

  async createItem(categoryId, data) {
    return apiFetch(`/budget/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateItem(categoryId, itemId, data) {
    return apiFetch(`/budget/categories/${categoryId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteItem(categoryId, itemId) {
    return apiFetch(`/budget/categories/${categoryId}/items/${itemId}`, {
      method: "DELETE",
    });
  },

  async getPayments() {
    return apiFetch("/budget/payments");
  },

  // Task CRUD
  async getTasks(filters?: Record<string, string>) {
    const params = filters ? "?" + new URLSearchParams(filters).toString() : "";
    return apiFetch(`/tasks${params}`);
  },

  async createTask(data) {
    return apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateTask(id, data) {
    return apiFetch(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteTask(id) {
    return apiFetch(`/tasks/${id}`, { method: "DELETE" });
  },

  async getTaskProgress() {
    return apiFetch("/tasks/progress");
  },

  // Seating Plans
  async getSeatingPlans() { return apiFetch("/seating/plans"); },
  async createSeatingPlan(name) { return apiFetch("/seating/plans", { method: "POST", body: JSON.stringify({ name }) }); },
  async updateSeatingPlan(planId, data) {
    // Support both legacy (planId, name) and new (planId, data) signatures
    const payload = typeof data === 'string' ? { name: data } : data;
    return apiFetch(`/seating/plans/${planId}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  async deleteSeatingPlan(planId) { return apiFetch(`/seating/plans/${planId}`, { method: "DELETE" }); },
  async addSeatingTable(planId, data) {
    const payload = { ...data, shape: data.shape === "rectangular" ? "rect" : data.shape };
    return apiFetch(`/seating/plans/${planId}/tables`, { method: "POST", body: JSON.stringify(payload) });
  },
  async updateSeatingTable(planId, tableId, data) {
    const payload = data.shape ? { ...data, shape: data.shape === "rectangular" ? "rect" : data.shape } : data;
    return apiFetch(`/seating/plans/${planId}/tables/${tableId}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  async deleteSeatingTable(planId, tableId) { return apiFetch(`/seating/plans/${planId}/tables/${tableId}`, { method: "DELETE" }); },
  async assignSeat(planId, tableId, seatNumber, guestId?) { return apiFetch(`/seating/plans/${planId}/tables/${tableId}/seats/${seatNumber}`, { method: "PATCH", body: JSON.stringify({ guestId: guestId ?? null }) }); },

  // Script (Guión del Día)
  async getScriptEntries() { return apiFetch("/script/entries"); },
  async createScriptEntry(data) { return apiFetch("/script/entries", { method: "POST", body: JSON.stringify(data) }); },
  async updateScriptEntry(id, data) { return apiFetch(`/script/entries/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
  async deleteScriptEntry(id) { return apiFetch(`/script/entries/${id}`, { method: "DELETE" }); },
  async reorderScriptEntries(ids) { return apiFetch("/script/entries/reorder", { method: "PATCH", body: JSON.stringify({ ids }) }); },
  async getScriptAreas() { return apiFetch("/script/areas"); },
  async createScriptArea(data) { return apiFetch("/script/areas", { method: "POST", body: JSON.stringify(data) }); },
  async updateScriptArea(id, data) { return apiFetch(`/script/areas/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
  async deleteScriptArea(id) { return apiFetch(`/script/areas/${id}`, { method: "DELETE" }); },

  // Notes
  async getNotes() { return apiFetch("/notes"); },
  async getNote(id) { return apiFetch(`/notes/${id}`); },
  async createNote(data) { return apiFetch("/notes", { method: "POST", body: JSON.stringify(data) }); },
  async updateNote(id, data) { return apiFetch(`/notes/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
  async deleteNote(id) { return apiFetch(`/notes/${id}`, { method: "DELETE" }); },
  async addNoteColor(noteId, data) { return apiFetch(`/notes/${noteId}/colors`, { method: "POST", body: JSON.stringify(data) }); },
  async removeNoteColor(noteId, colorId) { return apiFetch(`/notes/${noteId}/colors/${colorId}`, { method: "DELETE" }); },
  async addNoteCategory(noteId, data) { return apiFetch(`/notes/${noteId}/categories`, { method: "POST", body: JSON.stringify(data) }); },
  async removeNoteCategory(noteId, categoryId) { return apiFetch(`/notes/${noteId}/categories/${categoryId}`, { method: "DELETE" }); },
  async addNoteCategoryImage(noteId, categoryId, data) { return apiFetch(`/notes/${noteId}/categories/${categoryId}/images`, { method: "POST", body: JSON.stringify(data) }); },
  async removeNoteCategoryImage(noteId, categoryId, imageId) { return apiFetch(`/notes/${noteId}/categories/${categoryId}/images/${imageId}`, { method: "DELETE" }); },

  // Web Page
  async getWebPage() {
    return apiFetch("/web-page");
  },

  async createWebPage(data) {
    const { id: _id, isPublished: _p, publishedAt: _pa, ...payload } = data as Record<string, unknown>;
    return apiFetch("/web-page", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateWebPage(data) {
    const { id: _id, isPublished: _p, publishedAt: _pa, ...payload } = data as Record<string, unknown>;
    return apiFetch("/web-page", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async publishWebPage() {
    return apiFetch("/web-page/publish", { method: "POST" });
  },

  async unpublishWebPage() {
    return apiFetch("/web-page/unpublish", { method: "POST" });
  },

  async getPublicWedding(slug) {
    // Public endpoint, no auth needed
    const res = await fetch(`${API_URL}/public/wedding/${slug}`);
    if (!res.ok) throw new Error("Not found");
    return res.json();
  },

  async submitRsvp(slug, data) {
    const res = await fetch(`${API_URL}/public/rsvp/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Error" }));
      throw new Error(error.message);
    }
    return res.json();
  },

  // Vendors
  async getVendors() { return apiFetch("/vendors"); },
  async createVendor(data) { return apiFetch("/vendors", { method: "POST", body: JSON.stringify(data) }); },
  async updateVendor(id, data) { return apiFetch(`/vendors/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
  async deleteVendor(id) { return apiFetch(`/vendors/${id}`, { method: "DELETE" }); },
  async addVendorPayment(vendorId, data) { return apiFetch(`/vendors/${vendorId}/payments`, { method: "POST", body: JSON.stringify(data) }); },
  async updateVendorPayment(vendorId, paymentId, data) { return apiFetch(`/vendors/${vendorId}/payments/${paymentId}`, { method: "PATCH", body: JSON.stringify(data) }); },
  async deleteVendorPayment(vendorId, paymentId) { return apiFetch(`/vendors/${vendorId}/payments/${paymentId}`, { method: "DELETE" }); },
  async addVendorActivity(vendorId, data) { return apiFetch(`/vendors/${vendorId}/activity`, { method: "POST", body: JSON.stringify(data) }); },
};
