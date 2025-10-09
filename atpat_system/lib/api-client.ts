const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "")

type Json = Record<string, any>

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed with ${res.status}`)
  }
  const contentType = res.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await res.json()) as T
  }
  // @ts-expect-error allow unknown types as text for now
  return (await res.text()) as T
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, { credentials: "include" })
  return handleResponse<T>(res)
}

export async function apiPost<T>(path: string, body: Json): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  })
  return handleResponse<T>(res)
}

export function getApiBase() {
  return API_BASE
}
