import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-semibold">ATPAT Proctoring Portal</h1>
        <p className="text-muted-foreground mt-2">
          Admins can create tests and view reports. Students can review proctoring flags and submit reconsiderations.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create a Test</CardTitle>
            <CardDescription>Set parent test URL, duration, login window and upload students CSV.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/tests/new">Create Test</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Tests</CardTitle>
            <CardDescription>Browse existing tests and check their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <Link href="/tests">Open Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
