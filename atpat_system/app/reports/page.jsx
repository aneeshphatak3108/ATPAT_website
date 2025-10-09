"use client"

import Link from "next/link"
import { useMe } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  const { data: me } = useMe()

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href="/tests">Go to Tests</Link>
          </Button>
          <Button asChild>
            <Link href="/tests/new">Create Test</Link>
          </Button>
        </div>
      </div>

      {!me && <p className="text-muted-foreground">Please login as an admin to view detailed reports.</p>}
      {me && me.role !== "admin" && (
        <p className="text-destructive">Access restricted. Reports are available for admins only.</p>
      )}
      {me && me.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Basic report placeholder. Connect to your Flask reports API.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Hook this page to endpoints like:
            <div className="mt-2">
              <code className="rounded bg-muted px-2 py-1">GET /api/reports/overview</code>
            </div>
            and detailed test reports at:
            <div className="mt-2">
              <code className="rounded bg-muted px-2 py-1">GET /api/reports/tests/:id</code>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
