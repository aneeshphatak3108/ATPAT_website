import { NextResponse } from "next/server"
import { deleteSession } from "../../_auth/store"
import { clearSessionToken, getSessionToken } from "../../_auth/session"

export async function POST() {
  try {
    const token = getSessionToken()
    deleteSession(token)
    clearSessionToken()
    return NextResponse.json({ ok: true })
  } catch {
    // still clear cookie for safety
    clearSessionToken()
    return NextResponse.json({ ok: true })
  }
}
