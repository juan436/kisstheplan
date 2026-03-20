/**
 * Helper para subir imágenes al servidor
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("ktp_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads/photo`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error al subir archivo" }));
    throw new Error(error.message || "Error al subir el archivo");
  }

  const data = await response.json();

  // Si la URL es relativa, hacerla absoluta
  if (data.url.startsWith("/")) {
    const baseUrl = API_URL.replace("/api", "");
    return `${baseUrl}${data.url}`;
  }

  return data.url;
}

export async function uploadPdf(file: File): Promise<string> {
  // Por ahora usa el mismo endpoint que imágenes
  // En el futuro podrías tener un endpoint específico para PDFs
  return uploadImage(file);
}
