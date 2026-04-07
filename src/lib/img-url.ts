const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace("/api", "");

export function getImgUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}
