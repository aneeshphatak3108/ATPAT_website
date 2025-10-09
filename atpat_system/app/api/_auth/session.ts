import { cookies } from "next/headers"

const SESSION_COOKIE = "op_session"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

export function getSessionToken(): string | undefined {
  // Reading cookies is safe on server in route handlers
  return cookies().get(SESSION_COOKIE)?.value
}

export function setSessionToken(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  })
}

export function clearSessionToken() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
