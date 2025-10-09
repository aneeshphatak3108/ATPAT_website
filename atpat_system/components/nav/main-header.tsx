"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useMe, useLogoutRedirect } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  )
}

export default function MainHeader() {
  const { data: me } = useMe()
  const router = useRouter()
  const handleLogout = useLogoutRedirect()

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/coep.png"
              width={28}
              height={28}
              alt="Logo"
              className="rounded"
            />
            <span className="font-semibold">ATPAT System</span>
          </Link>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <nav className="hidden gap-1 md:flex">
            {me?.role === "admin" && (
              <>
                <NavLink href="/tests/new" label="Create Test" />
                <NavLink href="/tests" label="Tests" />
                <NavLink href="/reports" label="View Reports" />
              </>
            )}
            {me?.role === "student" && (
              <>
                <NavLink href="/student/flags" label="My Flags" />
                <NavLink href="/reports" label="View Reports" />
              </>
            )}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!me ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {me.name} • {me.role}
              </span>
              <Button variant="outline" onClick={() => router.refresh()}>
                Refresh
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
