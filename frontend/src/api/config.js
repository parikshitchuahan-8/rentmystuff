const fallbackApiBaseUrl = "http://localhost:8080/api";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/+$/, "");

export const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_BASE_URL || API_BASE_URL.replace(/\/api$/, "")
).replace(/\/+$/, "");

export function resolveAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${ASSET_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
