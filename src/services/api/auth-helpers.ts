import { getApiUrl, setTokens, clearTokens, apiFetch, getTokens } from "./http-client";

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
  return data.user;
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
}) {
  return apiFetch("/weddings", { method: "POST", body: JSON.stringify(data) });
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

export { clearTokens, getTokens };
