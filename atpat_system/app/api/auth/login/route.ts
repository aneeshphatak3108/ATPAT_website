import { NextResponse } from "next/server"
import { createSession, publicUser, verifyUser } from "../../_auth/store"
import { setSessionToken } from "../../_auth/session"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = verifyUser(email, password)
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = crypto.randomUUID()
    createSession(user.id, token)
    setSessionToken(token)

    return NextResponse.json(publicUser(user))
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Login failed" }, { status: 500 })
  }
}
