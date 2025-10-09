"use client"

import Link from "next/link"
import { useApi } from "@/lib/swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type TestRow = {
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
  }
}

export default function TestsList() {
  const { data, error, isLoading } = useApi<any>("/api/tests")

  // Support common shapes: [] | { data: [] } | { items: [] }
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.items)
        ? data.items
        : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading tests...</p>}
        {error && <p className="text-destructive">Failed to load tests.</p>}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Name</TableHead>
                  <TableHead>Parent URL</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Login Window</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((t) => {
                  const start = t.login_window_start ? new Date(t.login_window_start) : null
                  const end = t.login_window_end ? new Date(t.login_window_end) : null
                  const status = t.stats?.active ? (
                    <Badge variant="default">Active</Badge>
                  ) : t.stats?.completed ? (
                    <Badge variant="secondary">Completed</Badge>
                  ) : (
                    <Badge variant="outline">Scheduled</Badge>
                  )

                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        <Link href={`/tests/${t.id}`} className="hover:underline">
                          {t.name || `Test #${t.id}`}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate">{t.parent_url}</TableCell>
                      <TableCell>{t.duration_minutes} min</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {start ? start.toLocaleString() : "-"} → {end ? end.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/tests/${t.id}/reports`} className="hover:underline">
                          View Reports
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {list.length === 0 && (
              <p className="text-muted-foreground mt-4">No tests yet. Create one to get started.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
