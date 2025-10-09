const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

function url(path: string) {
  return `${BASE}${path}`
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(url(path), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPost<T = any>(path: string, body: any, init?: RequestInit): Promise<T> {
  const res = await fetch(url(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    ...init,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiUpload<T = any>(path: string, formData: FormData, init?: RequestInit): Promise<T> {
  const res = await fetch(url(path), {
    method: "POST",
    credentials: "include",
    body: formData,
    ...init,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
