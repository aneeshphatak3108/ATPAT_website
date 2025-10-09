import { NextResponse } from "next/server"
import { getUserById, getUserIdBySession, publicUser } from "../../_auth/store"
import { getSessionToken } from "../../_auth/session"

export async function GET() {
  try {
    const token = getSessionToken()
    const userId = getUserIdBySession(token)
    if (!userId) {
      return NextResponse.json(null)
    }
    const user = getUserById(userId)
    if (!user) {
      return NextResponse.json(null)
    }
    return NextResponse.json(publicUser(user))
  } catch (err: any) {
    return NextResponse.json(null)
  }
}
