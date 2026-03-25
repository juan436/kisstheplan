import { apiFetch, getApiUrl } from "./http-client";

export const contentMethods = {
  // Script
  async getScriptEntries() { return apiFetch("/script/entries"); },
  async createScriptEntry(data: object) {
    return apiFetch("/script/entries", { method: "POST", body: JSON.stringify(data) });
  },
  async updateScriptEntry(id: string, data: object) {
    return apiFetch(`/script/entries/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteScriptEntry(id: string) {
    return apiFetch(`/script/entries/${id}`, { method: "DELETE" });
  },
  async reorderScriptEntries(ids: string[]) {
    return apiFetch("/script/entries/reorder", { method: "PATCH", body: JSON.stringify({ ids }) });
  },
  async getScriptAreas() { return apiFetch("/script/areas"); },
  async createScriptArea(data: object) {
    return apiFetch("/script/areas", { method: "POST", body: JSON.stringify(data) });
  },
  async updateScriptArea(id: string, data: object) {
    return apiFetch(`/script/areas/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteScriptArea(id: string) {
    return apiFetch(`/script/areas/${id}`, { method: "DELETE" });
  },
  // Seating
  async getSeatingPlans() { return apiFetch("/seating/plans"); },
  async createSeatingPlan(name: string) {
    return apiFetch("/seating/plans", { method: "POST", body: JSON.stringify({ name }) });
  },
  async updateSeatingPlan(planId: string, data: string | object) {
    const payload = typeof data === "string" ? { name: data } : data;
    return apiFetch(`/seating/plans/${planId}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  async deleteSeatingPlan(planId: string) {
    return apiFetch(`/seating/plans/${planId}`, { method: "DELETE" });
  },
  async addSeatingTable(planId: string, data: { shape: string; [key: string]: unknown }) {
    const payload = { ...data, shape: data.shape === "rectangular" ? "rect" : data.shape };
    return apiFetch(`/seating/plans/${planId}/tables`, { method: "POST", body: JSON.stringify(payload) });
  },
  async updateSeatingTable(planId: string, tableId: string, data: { shape?: string; [key: string]: unknown }) {
    const payload = data.shape ? { ...data, shape: data.shape === "rectangular" ? "rect" : data.shape } : data;
    return apiFetch(`/seating/plans/${planId}/tables/${tableId}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  async deleteSeatingTable(planId: string, tableId: string) {
    return apiFetch(`/seating/plans/${planId}/tables/${tableId}`, { method: "DELETE" });
  },
  async assignSeat(planId: string, tableId: string, seatNumber: number, guestId?: string) {
    return apiFetch(`/seating/plans/${planId}/tables/${tableId}/seats/${seatNumber}`, {
      method: "PATCH",
      body: JSON.stringify({ guestId: guestId ?? null }),
    });
  },
  // Notes
  async getNotes() { return apiFetch("/notes"); },
  async getNote(id: string) { return apiFetch(`/notes/${id}`); },
  async createNote(data: object) {
    return apiFetch("/notes", { method: "POST", body: JSON.stringify(data) });
  },
  async updateNote(id: string, data: object) {
    return apiFetch(`/notes/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteNote(id: string) { return apiFetch(`/notes/${id}`, { method: "DELETE" }); },
  async addNoteColor(noteId: string, data: object) {
    return apiFetch(`/notes/${noteId}/colors`, { method: "POST", body: JSON.stringify(data) });
  },
  async removeNoteColor(noteId: string, colorId: string) {
    return apiFetch(`/notes/${noteId}/colors/${colorId}`, { method: "DELETE" });
  },
  async addNoteCategory(noteId: string, data: object) {
    return apiFetch(`/notes/${noteId}/categories`, { method: "POST", body: JSON.stringify(data) });
  },
  async removeNoteCategory(noteId: string, categoryId: string) {
    return apiFetch(`/notes/${noteId}/categories/${categoryId}`, { method: "DELETE" });
  },
  async addNoteCategoryImage(noteId: string, categoryId: string, data: object) {
    return apiFetch(`/notes/${noteId}/categories/${categoryId}/images`, { method: "POST", body: JSON.stringify(data) });
  },
  async removeNoteCategoryImage(noteId: string, categoryId: string, imageId: string) {
    return apiFetch(`/notes/${noteId}/categories/${categoryId}/images/${imageId}`, { method: "DELETE" });
  },
  // Web Page
  async getWebPage() { return apiFetch("/web-page"); },
  async createWebPage(data: Record<string, unknown>) {
    const { id: _id, isPublished: _p, publishedAt: _pa, ...payload } = data;
    return apiFetch("/web-page", { method: "POST", body: JSON.stringify(payload) });
  },
  async updateWebPage(data: Record<string, unknown>) {
    const { id: _id, isPublished: _p, publishedAt: _pa, ...payload } = data;
    return apiFetch("/web-page", { method: "PATCH", body: JSON.stringify(payload) });
  },
  async publishWebPage() { return apiFetch("/web-page/publish", { method: "POST" }); },
  async unpublishWebPage() { return apiFetch("/web-page/unpublish", { method: "POST" }); },
  async getPublicWedding(slug: string) {
    const res = await fetch(`${getApiUrl()}/public/wedding/${slug}`);
    if (!res.ok) throw new Error("Not found");
    return res.json();
  },
  async submitRsvp(slug: string, data: object) {
    const res = await fetch(`${getApiUrl()}/public/rsvp/${slug}`, {
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
