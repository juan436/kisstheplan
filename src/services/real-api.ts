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
    return apiFetch("/budget/payments");
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

  async createPayment(data) {
    return apiFetch("/budget/payments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updatePayment(id, data) {
    return apiFetch(`/budget/payments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deletePayment(id) {
    return apiFetch(`/budget/payments/${id}`, { method: "DELETE" });
  },

  // Web Page
  async getWebPage() {
    return apiFetch("/web-page");
  },

  async createWebPage(data) {
    return apiFetch("/web-page", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateWebPage(data) {
    return apiFetch("/web-page", {
      method: "PATCH",
      body: JSON.stringify(data),
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
};
