"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TestItem = {
  testname: string
  parenturl: string
  start_time?: string
  end_time?: string
}

export default function TestsList() {
  const [tests, setTests] = useState<TestItem[]>([])
  const [role, setRole] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get logged-in user info
        const meRes = await fetch("http://localhost:5000/api/auth_routes/me", {
          credentials: "include",
        })
        if (!meRes.ok) throw new Error("Not logged in")
        const user = await meRes.json()
        setRole(user.role)

        // Use GET for both — student uses session now
        const endpoint =
          user.role === "student"
            ? "http://localhost:5000/api/test_routes/showtestsstudents"
            : "http://localhost:5000/api/test_routes/showtestsadmin"

        const res = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        })

        const data = await res.json()
        if (data.status !== "success") throw new Error(data.message)
        setTests(data.tests || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {role === "admin" ? "All Tests You Created" : "Your Registered Tests"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-muted-foreground">Loading tests...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Parent URL</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((t) => (
                  <TableRow key={t.testname}>
                    <TableCell>{t.testname}</TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {t.parenturl}
                    </TableCell>
                    <TableCell>{t.start_time || "-"}</TableCell>
                    <TableCell>{t.end_time || "-"}</TableCell>
                    <TableCell className="text-right">
                      {role === "student" ? (
                        <Link
                          href={`/tests/${encodeURIComponent(t.testname)}/flags`}
                          className="hover:underline text-blue-600"
                        >
                          Review Flags
                        </Link>
                      ) : (
                        <Link
                          href={`/tests/${encodeURIComponent(t.testname)}/admin-report`}
                          className="hover:underline text-blue-600"
                        >
                          View Report
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {tests.length === 0 && (
              <p className="text-muted-foreground mt-4">No tests found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
