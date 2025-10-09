"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useApi } from "@/lib/swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TestDetail = {
  id: string | number
  name?: string
  parent_url: string
  duration_minutes: number
  login_window_start?: string
  login_window_end?: string
  stats?: {
    assigned?: number
    active?: number
    completed?: number
    events_total?: number
    flags_total?: number
  }
}

export default function TestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data, error, isLoading } = useApi<TestDetail>(`/api/tests/${id}`)

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Test Detail</h1>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/tests">Back to Tests</Link>
          </Button>
          <Button asChild>
            <Link href={`/tests/${id}/sessions`}>View Sessions</Link>
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-destructive">Failed to load test details.</p>}
      {!isLoading && !error && data && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{data.name || `Test #${data.id}`}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Parent URL:</span>{" "}
                <a href={data.parent_url} target="_blank" rel="noreferrer" className="underline">
                  {data.parent_url}
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span> {data.duration_minutes} minutes
              </div>
              <div>
                <span className="text-muted-foreground">Login window:</span>{" "}
                {data.login_window_start ? new Date(data.login_window_start).toLocaleString() : "-"} →{" "}
                {data.login_window_end ? new Date(data.login_window_end).toLocaleString() : "-"}
              </div>
              {data.stats && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <Stat label="Assigned" value={data.stats.assigned ?? 0} />
                  <Stat label="Active" value={data.stats.active ?? 0} />
                  <Stat label="Completed" value={data.stats.completed ?? 0} />
                  <Stat label="Flags" value={data.stats.flags_total ?? 0} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  )
}
