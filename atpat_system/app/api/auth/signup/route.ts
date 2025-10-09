import { NextResponse } from "next/server"
import { createUser, getUserByEmail, publicUser } from "../../_auth/store"

type Role = "admin" | "student"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email, password, role } = body as {
      name?: string
      email?: string
      password?: string
      role?: Role
    }

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }
    if (role !== "admin" && role !== "student") {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }
    if (getUserByEmail(email)) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 })
    }

    const user = createUser({ name, email, role, password })
    return NextResponse.json(publicUser(user), { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Signup failed" }, { status: 500 })
  }
}
