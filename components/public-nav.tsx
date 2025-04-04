"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function PublicNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-medium text-emerald-500">
          Numerical Quran
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className={pathname === "/" ? "font-medium" : "text-muted-foreground"}>
            Home
          </Link>
          <Link href="/about" className={pathname === "/about" ? "font-medium" : "text-muted-foreground"}>
            About
          </Link>
          <Link href="/register" className={pathname === "/register" ? "font-medium" : "text-muted-foreground"}>
            Register
          </Link>
          <Link href="/submit" className={pathname.startsWith("/submit") ? "font-medium" : "text-muted-foreground"}>
            Submit Abstract
          </Link>
          <Link href="/certificates" className={pathname === "/certificates" ? "font-medium" : "text-muted-foreground"}>
            Certificates
          </Link>
          <Link href="/contact" className={pathname === "/contact" ? "font-medium" : "text-muted-foreground"}>
            Contact
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button asChild variant="warning" size="sm" className="ml-4">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

