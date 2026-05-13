import { getMediaUrl } from "./utils/media";

export function getImgUrl(url: string | null | undefined): string {
  return getMediaUrl(url);
}
