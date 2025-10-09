import { redirect } from "next/navigation"
import CreateTestForm from "@/components/forms/create-test-form"

export default async function NewTestPage() {
  /*const meRes = await fetch("/api/auth/me", { cache: "no-store" })
  const me = await meRes.json().catch(() => null)
  if (!me || me.role !== "admin") {
    redirect("/login")
  }*/

  return (
    <div className="max-w-3xl">
      <CreateTestForm />
    </div>
  )
}
