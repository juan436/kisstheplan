import { apiFetch } from "./http-client";

export const taskVendorMethods = {
  async getTasks(filters?: Record<string, string>) {
    const params = filters ? "?" + new URLSearchParams(filters).toString() : "";
    return apiFetch(`/tasks${params}`);
  },
  async createTask(data: object) {
    return apiFetch("/tasks", { method: "POST", body: JSON.stringify(data) });
  },
  async updateTask(id: string, data: object) {
    return apiFetch(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteTask(id: string) { return apiFetch(`/tasks/${id}`, { method: "DELETE" }); },
  async getTaskProgress() { return apiFetch("/tasks/progress"); },
  async getTaskCategories(): Promise<string[]> {
    const cats = await apiFetch("/budget/categories");
    return (cats as { name: string }[]).map((c) => c.name);
  },
  async getVendors() { return apiFetch("/vendors"); },
  async createVendor(data: object) {
    return apiFetch("/vendors", { method: "POST", body: JSON.stringify(data) });
  },
  async updateVendor(id: string, data: object) {
    return apiFetch(`/vendors/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteVendor(id: string) { return apiFetch(`/vendors/${id}`, { method: "DELETE" }); },
  async addVendorPayment(vendorId: string, data: object) {
    return apiFetch(`/vendors/${vendorId}/payments`, { method: "POST", body: JSON.stringify(data) });
  },
  async updateVendorPayment(vendorId: string, paymentId: string, data: object) {
    return apiFetch(`/vendors/${vendorId}/payments/${paymentId}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteVendorPayment(vendorId: string, paymentId: string) {
    return apiFetch(`/vendors/${vendorId}/payments/${paymentId}`, { method: "DELETE" });
  },
  async addVendorActivity(vendorId: string, data: object) {
    return apiFetch(`/vendors/${vendorId}/activity`, { method: "POST", body: JSON.stringify(data) });
  },
};
