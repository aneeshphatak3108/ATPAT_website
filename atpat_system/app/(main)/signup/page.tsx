"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api"
import { useCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter()
  const { mutate } = useCurrentUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mis_id, setMis_id] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "admin">("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth_routes/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important if backend uses sessions
        body: JSON.stringify({
          name,
          email,
          mis_id,
          role,
          password,
        }),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.message || "Signup failed")
      }
  
      console.log("✅ Signup success:", result.message)
  
      // optionally update local user state
      await mutate()
  
      // redirect on success
      router.push("/")
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }  

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>


            <div className="grid gap-2">
              <Label htmlFor="id">MIS Id</Label>
              <Input
                id="id"
                type="text"
                placeholder="Example 612303138"
                value={mis_id}
                onChange={(e) => setMis_id(e.target.value)}
                required
              />
            </div>



            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <a className="underline" href="/(main)/login">
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
