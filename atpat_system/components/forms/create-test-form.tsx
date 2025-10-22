"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiPost, apiUpload, getApiBase } from "@/lib/api-client"

type CreateTestResponse = { id: string | number }

export default function CreateTestForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [testName, setTestName] = useState("")
  const [parentUrl, setParentUrl] = useState("")
  const [duration, setDuration] = useState<number | "">("")
  const [loginStart, setLoginStart] = useState<string>("")
  const [loginEnd, setLoginEnd] = useState<string>("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [sendInvites, setSendInvites] = useState(true)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const apiConfigured = useMemo(() => Boolean(getApiBase()), [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!parentUrl || !duration || !loginStart || !loginEnd) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" })
      return
    }
  
    try {
      setSubmitting(true)
  
      const formData = new FormData()
      formData.append("testname", testName)
      formData.append("parenturl", parentUrl)
      formData.append("duration", String(duration))
      formData.append("loginwindowstart", loginStart)
      formData.append("loginwindowend", loginEnd)
      formData.append("description", notes)
      formData.append("send_invites", sendInvites ? "1" : "0")
  
      if (csvFile) {
        formData.append("file", csvFile)
      }
  
      const res = await fetch("http://127.0.0.1:5000/api/test_routes/createtest", {
        method: "POST",
        body: formData,
        credentials: "include"
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message || "Failed to create test")
      }
  
      toast({ title: "Test created", description: data.message })
      router.push("/tests") // or wherever you want to navigate
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }
  

  return (
    <Card asChild>
      <form onSubmit={onSubmit} className="w-full">
        <CardHeader>
          <CardTitle>Create Test</CardTitle>
          <CardDescription>Define the test parameters and upload the students CSV (name, email, id).</CardDescription>
          {!apiConfigured && (
            <p className="text-sm text-destructive">
              Backend URL not configured. Set NEXT_PUBLIC_API_BASE_URL to your Flask server.
            </p>
          )}
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="testName">Test name (optional)</Label>
            <Input
              id="testName"
              placeholder="Midterm - CS101"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="parentUrl">Parent test URL</Label>
            <Input
              id="parentUrl"
              required
              type="url"
              placeholder="https://www.hackerrank.com/..."
              value={parentUrl}
              onChange={(e) => setParentUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              required
              type="number"
              min={1}
              placeholder="90"
              value={duration}
              onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="loginStart">Login window start</Label>
              <Input
                id="loginStart"
                required
                type="datetime-local"
                value={loginStart}
                onChange={(e) => setLoginStart(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loginEnd">Login window end</Label>
              <Input
                id="loginEnd"
                required
                type="datetime-local"
                value={loginEnd}
                onChange={(e) => setLoginEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="studentsCsv">Students CSV</Label>
            <Input
              id="studentsCsv"
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
            <p className="text-muted-foreground text-xs">
              CSV columns: name, email, student_id (header row recommended).
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific rules or instructions for proctoring..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label className="font-medium">Send invites to students</Label>
              <p className="text-muted-foreground text-sm">
                Emails will contain each student&apos;s unique invite link.
              </p>
            </div>
            <Switch checked={sendInvites} onCheckedChange={setSendInvites} aria-label="Send invites switch" />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => history.back()} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Confirm & Create Test"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
