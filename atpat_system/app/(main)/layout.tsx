import type React from "react"
import MainHeader from "@/components/nav/main-header"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <MainHeader />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
