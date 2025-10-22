// /app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/auth_routes/me", {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include", // ✅ ensures the session cookie is respected
    })

    // copy cookies from Flask response back to browser (important!)
    const response = NextResponse.json(await res.json(), { status: res.status })
    const setCookie = res.headers.get("set-cookie")
    if (setCookie) {
      response.headers.set("set-cookie", setCookie)
    }

    return response
  } catch (err) {
    console.error("Error in /api/me:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
