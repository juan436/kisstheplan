/**
 * Media Helper Utility
 * 
 * Qué hace: Procesa URLs de medios para asegurar que tengan el dominio correcto y protocolo.
 *           Evita duplicidad de dominios y corrupción de rutas.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Obtiene la URL base para archivos estáticos (uploads)
 * Elimina la parte '/api' si está presente en la URL base.
 */
const getBaseUrl = () => {
  return API_URL.replace(/\/api$/, "").replace(/\/api\/$/, "");
};

/**
 * Procesa una ruta de archivo para devolver una URL absoluta válida.
 * 
 * @param path Ruta del archivo o URL completa
 * @returns URL absoluta
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";

  // Si ya es una URL absoluta, la devolvemos tal cual
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const baseUrl = getBaseUrl();
  
  // Limpiamos el path para asegurar que empiece con /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // Evitamos concatenar // si el baseUrl termina en /
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}${cleanPath}`;
}
