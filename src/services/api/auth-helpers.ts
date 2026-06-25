import { getApiUrl, setTokens, clearTokens, apiFetch, getTokens } from "./http-client";
import type { WeddingOption } from "@/types/user";

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${getApiUrl()}/auth/login`, {
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
  return { user: data.user, weddings: (data.weddings ?? []) as WeddingOption[] };
}

export async function apiGetAvailableWeddings(): Promise<WeddingOption[]> {
  return apiFetch("/auth/weddings");
}

export async function apiSwitchWedding(weddingId: string): Promise<{ accessToken: string; refreshToken: string; role: string; weddingId: string }> {
  const data = await apiFetch("/auth/switch-wedding", { method: "POST", body: JSON.stringify({ weddingId }) }) as { accessToken: string; refreshToken: string; role: string; weddingId: string };
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function apiRegister(email: string, password: string, name: string) {
  const res = await fetch(`${getApiUrl()}/auth/register`, {
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
  partner1Name: string; partner2Name: string; date: string;
  venue: string; location?: string; estimatedGuests: number; estimatedBudget: number;
  plan?: 'trial' | 'annual';
}) {
  return apiFetch("/weddings", { method: "POST", body: JSON.stringify(data) });
}

export async function apiRefreshTokens(): Promise<void> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return;
  const res = await fetch(`${getApiUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return;
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
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

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch("/auth/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) });
}

export function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("ktp_access_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { email?: string };
    return payload.email ?? null;
  } catch {
    return null;
  }
}

export { clearTokens, getTokens, setTokens };
