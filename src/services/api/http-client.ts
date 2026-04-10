/**
 * Cliente HTTP base para el backend KissthePlan.
 *
 * Características:
 * - Adjunta el JWT (accessToken) en cada petición como `Authorization: Bearer`.
 * - Si el backend devuelve 401, intenta refrescar el token automáticamente.
 * - Si el refresh falla, limpia los tokens (el usuario deberá volver a hacer login).
 * - Los tokens se guardan en localStorage con clave `ktp_access_token` / `ktp_refresh_token`.
 *
 * Todos los métodos de la API usan `apiFetch` — no hacer fetch() directo fuera de este archivo.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function getApiUrl() {
  return API_URL;
}

export function getTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("ktp_access_token"),
    refreshToken: localStorage.getItem("ktp_refresh_token"),
  };
}

export function setTokens(accessToken: string, refreshToken: string) {
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
    if (!res.ok) { clearTokens(); return null; }
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
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
    if (newToken) res = await doFetch(newToken);
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || `Error ${res.status}`);
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as unknown as T;
  }
  return res.json();
}
