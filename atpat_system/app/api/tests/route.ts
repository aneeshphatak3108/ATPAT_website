import { type NextRequest, NextResponse } from "next/server"
import { getUserIdBySession, getUserById } from "@/app/api/_auth/store"
import { createTest, getAllTests } from "@/app/api/_tests/store"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value
  const userId = getUserIdBySession(token)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = getUserById(userId)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Admin can see all tests, students see only their assigned tests (for now, return all)
  const tests = getAllTests()

  return NextResponse.json(tests)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("session")?.value
  const userId = getUserIdBySession(token)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = getUserById(userId)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, parent_url, duration_minutes, login_window_start, login_window_end, notes } = body

    if (!parent_url || !duration_minutes || !login_window_start || !login_window_end) {
      return NextResponse.json(
        { error: "Missing required fields: parent_url, duration_minutes, login_window_start, login_window_end" },
        { status: 400 },
      )
    }

    const test = createTest({
      name,
      parent_url,
      duration_minutes: Number(duration_minutes),
      login_window_start,
      login_window_end,
      notes,
      created_by: userId,
    })

    return NextResponse.json({ id: test.id, ...test }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
