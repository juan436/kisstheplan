import { apiFetch, getApiUrl, getTokens } from "./http-client";
import type { GuestStats, BudgetSummary } from "@/types";

export const coreMethods = {
  async getUser() { return apiFetch("/auth/me"); },
  async getWedding() { return apiFetch("/weddings/me"); },
  async updateWedding(id: string, data: object) {
    return apiFetch(`/weddings/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async getGuests(filters?: Record<string, string>) {
    const params = filters ? "?" + new URLSearchParams(filters).toString() : "";
    return apiFetch(`/guests${params}`);
  },
  async getGuestStats(): Promise<GuestStats> { return apiFetch("/guests/stats"); },
  async getBudgetCategories() { return apiFetch("/budget/categories"); },
  async getBudgetSummary(): Promise<BudgetSummary> { return apiFetch("/budget/summary"); },
  async getUpcomingTasks() { return apiFetch("/tasks/upcoming"); },
  async getUpcomingPayments() { return apiFetch("/budget/payments/upcoming"); },
  async checkSlug(slug: string): Promise<{ available: boolean }> {
    return apiFetch(`/weddings/check-slug/${encodeURIComponent(slug)}`);
  },
  async uploadPhoto(file: File) {
    const { accessToken } = getTokens();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${getApiUrl()}/uploads/photo`, {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error("Error al subir la imagen");
    return res.json() as Promise<{ url: string }>;
  },
  async importGuestsExcel(file: File) {
    const { accessToken } = getTokens();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${getApiUrl()}/guests/import`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` } as HeadersInit,
      body: formData,
    });
    if (!res.ok) throw new Error("Error al importar el archivo");
    return res.json();
  },
  async createGuest(data: object) {
    return apiFetch("/guests", { method: "POST", body: JSON.stringify(data) });
  },
  async updateGuest(id: string, data: object) {
    return apiFetch(`/guests/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteGuest(id: string) { return apiFetch(`/guests/${id}`, { method: "DELETE" }); },
  async getGuestHistory(id: string) { return apiFetch(`/guests/${id}/history`); },
  async getGuestGroups() { return apiFetch("/guests/groups"); },
  async createGuestGroup(name: string) {
    return apiFetch("/guests/groups", { method: "POST", body: JSON.stringify({ name }) });
  },
  async updateGuestGroup(id: string, name: string) {
    return apiFetch(`/guests/groups/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
  },
  async deleteGuestGroup(id: string) {
    return apiFetch(`/guests/groups/${id}`, { method: "DELETE" });
  },
  async createCategory(data: object) {
    return apiFetch("/budget/categories", { method: "POST", body: JSON.stringify(data) });
  },
  async updateCategory(id: string, data: object) {
    return apiFetch(`/budget/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteCategory(id: string) {
    return apiFetch(`/budget/categories/${id}`, { method: "DELETE" });
  },
  async createItem(categoryId: string, data: object) {
    return apiFetch(`/budget/categories/${categoryId}/items`, { method: "POST", body: JSON.stringify(data) });
  },
  async updateItem(categoryId: string, itemId: string, data: object) {
    return apiFetch(`/budget/categories/${categoryId}/items/${itemId}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteItem(categoryId: string, itemId: string) {
    return apiFetch(`/budget/categories/${categoryId}/items/${itemId}`, { method: "DELETE" });
  },
  async getPayments() { return apiFetch("/budget/payments"); },

  async getItemPayments(catId: string, itemId: string) {
    return apiFetch(`/budget/categories/${catId}/items/${itemId}/payments`);
  },
  async createItemPayment(catId: string, itemId: string, data: object) {
    return apiFetch(`/budget/categories/${catId}/items/${itemId}/payments`, { method: "POST", body: JSON.stringify(data) });
  },
  async updateBudgetPayment(paymentId: string, data: object) {
    return apiFetch(`/budget/payments/${paymentId}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteBudgetPayment(paymentId: string) {
    return apiFetch(`/budget/payments/${paymentId}`, { method: "DELETE" });
  },
  async getVendorBudgetPayments(vendorId: string) {
    return apiFetch(`/budget/vendor/${vendorId}/payments`);
  },
};
