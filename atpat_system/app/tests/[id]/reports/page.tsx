import { redirect } from "next/navigation"

export default async function TestReportsPage({
  params,
}: {
  params: { id: string }
}) {
  // ✅ Important: include credentials
  const meRes = await fetch("http://localhost:3000/api/me", {
    cache: "no-store",
    credentials: "include", // <-- this ensures Flask session cookie is sent
  })

  const me = await meRes.json().catch(() => null)
  if (!me || me.status !== "success" || me.user?.role !== "admin") {
    redirect("/login")
  }

  const testId = params.id

  let reports: any[] = []
  try {
    const r = await fetch(`/api/tests/${testId}/reports`, {
      cache: "no-store",
      credentials: "include", // also include session here if backend needs it
    })
    const json = await r.json()
    reports = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.items)
          ? json.items
          : []
  } catch {
    reports = []
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Reports for Test #{testId}</h1>
        <p className="text-sm text-muted-foreground">
          Student activity, flags, and outcomes for this test.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          No reports yet for this test.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr className="[&>th]:px-4 [&>th]:py-3">
                <th>Student</th>
                <th>Flag Count</th>
                <th>Score</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-b">
              {reports.map((r, idx) => (
                <tr key={r.id ?? idx} className="[&>td]:px-4 [&>td]:py-3">
                  <td>{r.studentName ?? "Unknown"}</td>
                  <td>{r.flagCount ?? 0}</td>
                  <td>{r.score ?? "-"}</td>
                  <td>
                    {r.submittedAt
                      ? new Date(r.submittedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
