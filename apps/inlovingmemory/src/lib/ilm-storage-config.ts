/** Runtime reads — safe under Docker. */

export function getIlmStorageEnv() {
  const bucket = process.env["ILM_S3_BUCKET"]?.trim();
  const endpoint = process.env["ILM_S3_ENDPOINT"]?.trim();
  const region = process.env["ILM_S3_REGION"]?.trim() || "auto";
  const accessKeyId = process.env["ILM_S3_ACCESS_KEY_ID"]?.trim();
  const secretAccessKey = process.env["ILM_S3_SECRET_ACCESS_KEY"]?.trim();
  const publicBaseUrl = process.env["ILM_S3_PUBLIC_BASE_URL"]?.trim().replace(/\/$/, "");

  const configured = Boolean(
    bucket && endpoint && accessKeyId && secretAccessKey && publicBaseUrl,
  );

  return {
    configured,
    bucket,
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl,
  };
}

export function publicUrlForStorageKey(key: string): string {
  const { publicBaseUrl } = getIlmStorageEnv();
  if (!publicBaseUrl) return "";
  const path = key.split("/").map(encodeURIComponent).join("/");
  return `${publicBaseUrl}/${path}`;
}

/** Derive object key from a public CDN URL (must match `ILM_S3_PUBLIC_BASE_URL`). */
export function storageKeyFromPublicUrl(storageUrl: string): string | null {
  const { publicBaseUrl } = getIlmStorageEnv();
  if (!publicBaseUrl) return null;
  if (!storageUrl.startsWith(`${publicBaseUrl}/`)) return null;
  const rest = storageUrl.slice(publicBaseUrl.length + 1);
  if (!rest) return null;
  try {
    return rest.split("/").map(decodeURIComponent).join("/");
  } catch {
    return null;
  }
}
