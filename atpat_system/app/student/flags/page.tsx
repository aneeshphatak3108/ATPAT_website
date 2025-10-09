"use client"

import { useApi } from "@/lib/swr"
import AppealDialog from "@/components/student/appeal-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Flag = {
  id: string | number
  rule: string
  severity: "low" | "medium" | "high"
  ts: string
  details?: Record<string, any>
  status?: "open" | "pending" | "reviewed" | "dismissed"
  appeal?: {
    status?: "pending" | "accepted" | "rejected"
    message?: string
    responded_at?: string
  } | null
}

export default function StudentFlagsPage() {
  const { data, error, isLoading, mutate } = useApi<Flag[]>("/api/students/me/flags")

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">My Flags</h1>

      {isLoading && <p className="text-muted-foreground">Loading flags...</p>}
      {error && <p className="text-destructive">Failed to load your flags.</p>}
      {!isLoading && !error && (
        <div className="grid gap-4">
          {(data || []).map((f) => (
            <Card key={f.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">
                  {f.rule} <SeverityBadge severity={f.severity} />
                </CardTitle>
                <div className="text-xs text-muted-foreground">{new Date(f.ts).toLocaleString()}</div>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="text-muted-foreground">
                  Status: <Badge variant="outline">{f.status || "open"}</Badge>
                </div>
                {f.appeal?.status && (
                  <div className="text-muted-foreground">
                    Appeal: <Badge variant="secondary">{f.appeal.status}</Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <AppealDialog
                    flagId={String(f.id)}
                    disabled={f.appeal?.status === "pending"}
                    onSubmitted={() => mutate()}
                  />
                  <Button variant="outline" asChild>
                    <a href="/placeholder.pdf" target="_blank" rel="noreferrer">
                      Exam Policy
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {data && data.length === 0 && <p className="text-muted-foreground">No flags recorded.</p>}
        </div>
      )}
    </main>
  )
}

function SeverityBadge({ severity }: { severity: Flag["severity"] }) {
  if (severity === "high") return <Badge variant="destructive">High</Badge>
  if (severity === "medium") return <Badge>Medium</Badge>
  return <Badge variant="outline">Low</Badge>
}
