import Link from "next/link"
import { redirect } from "next/navigation" // import redirect
import { Button } from "@/components/ui/button"
import TestsList from "@/components/tests/tests-list"

export default async function TestsPage() {
  /*const meRes = await fetch("/api/auth/me", { cache: "no-store" })
  const me = await meRes.json().catch(() => null)
  if (!me || me.role !== "admin") {
    redirect("/login")
  }*/

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Tests</h1>
        <Button asChild>
          <Link href="/tests/new">Create Test</Link>
        </Button>
      </div>
      <TestsList />
    </main>
  )
}
