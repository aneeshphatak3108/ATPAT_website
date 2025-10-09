"use client"

import useSWR from "swr"
import { apiGet } from "@/lib/api"
import { useCurrentUser } from "@/lib/auth"
import { AppealDialog } from "@/components/student/appeal-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Flag = {
  id: string
  session_id: string
  student_name?: string
  student_email?: string
  rule: string
  severity: "low" | "medium" | "high"
  ts: string
  details?: Record<string, any>
}

export default function ReportsPage() {
  const { user } = useCurrentUser()
  const { data, error, isLoading, mutate } = useSWR<Flag[]>(`/api/reports`, apiGet)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user?.role === "admin" ? "All Reports" : "My Report"}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground text-sm">Loading reports...</p>}
        {error && <p className="text-destructive text-sm">Failed to load reports</p>}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {user?.role === "admin" && <TableHead>Student</TableHead>}
                  <TableHead>Rule</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((f) => (
                  <TableRow key={f.id}>
                    {user?.role === "admin" && (
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm">{f.student_name || "-"}</div>
                        <div className="text-xs text-muted-foreground">{f.student_email || "-"}</div>
                      </TableCell>
                    )}
                    <TableCell className="whitespace-pre-wrap">{f.rule}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          f.severity === "high" ? "destructive" : f.severity === "medium" ? "secondary" : "outline"
                        }
                      >
                        {f.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(f.ts).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <AppealDialog flagId={f.id} onSubmitted={() => mutate()} />
                    </TableCell>
                  </TableRow>
                ))}
                {(data ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={user?.role === "admin" ? 5 : 4} className="text-center text-muted-foreground">
                      No flags yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
