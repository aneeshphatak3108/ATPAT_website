"use client"

import { useRouter } from "next/navigation"
import useSWR from "swr"
import { apiGet, apiPost } from "./api-client"

export type Role = "admin" | "student"
export type User = {
  id: string | number
  name: string
  email: string
  role: Role
}

export function useMe() {
  return useSWR<User | null>("api/me", (key) => apiGet<User | null>(key), {
    revalidateOnFocus: true,
  })
}

export function useCurrentUser() {
  return useMe()
}

export async function login(payload: { email: string; password: string }) {
  return apiPost<User>("api/login", payload)
}

export async function signup(payload: {
  name: string
  email: string
  password: string
  role: Role
}) {
  return apiPost<User>("api/signup", payload)
}

export async function logout() {
  // backend may accept POST /logout with empty body
  return apiPost<{}>("api/logout", {})
}

export function useLogoutRedirect() {
  const router = useRouter()
  return async function onLogout() {
    await logout().catch(() => {})
    router.push("/login")
  }
}
