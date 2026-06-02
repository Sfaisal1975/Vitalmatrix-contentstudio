const KEY = "vm_cs_key";

export function getApiKey(): string | null {
  return localStorage.getItem(KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(KEY, key);
}

export function clearApiKey(): void {
  localStorage.removeItem(KEY);
}

export function makeAuthHeader(key: string): string {
  return "Basic " + btoa("admin:" + key);
}

export function getBaseApiUrl(): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return base.replace(/\/$/, "") + "/api";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  apiKey?: string | null
): Promise<T> {
  const key = apiKey ?? getApiKey();
  if (!key) throw new Error("No API key");
  const base = getBaseApiUrl();
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: makeAuthHeader(key),
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 401) {
    clearApiKey();
    window.location.reload();
    throw new Error("Unauthorised");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
