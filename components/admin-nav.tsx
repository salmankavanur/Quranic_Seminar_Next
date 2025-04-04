"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, MessageSquare, UserCog, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { logoutAction } from "@/app/actions/auth-actions"

export function AdminNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutAction()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin" className="text-xl font-medium text-emerald-500">
          Numerical Quran Admin
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/admin"
            className={
              pathname === "/admin"
                ? "font-medium flex items-center gap-1"
                : "text-muted-foreground flex items-center gap-1"
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/registrations"
            className={
              pathname === "/admin/registrations"
                ? "font-medium flex items-center gap-1"
                : "text-muted-foreground flex items-center gap-1"
            }
          >
            <Users className="h-4 w-4" />
            Registrations
          </Link>
          <Link
            href="/admin/submissions"
            className={
              pathname === "/admin/submissions"
                ? "font-medium flex items-center gap-1"
                : "text-muted-foreground flex items-center gap-1"
            }
          >
            <FileText className="h-4 w-4" />
            Submissions
          </Link>
          <Link
            href="/admin/messages"
            className={
              pathname === "/admin/messages"
                ? "font-medium flex items-center gap-1"
                : "text-muted-foreground flex items-center gap-1"
            }
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/admin/manage-admins"
            className={
              pathname === "/admin/manage-admins"
                ? "font-medium flex items-center gap-1"
                : "text-muted-foreground flex items-center gap-1"
            }
          >
            <UserCog className="h-4 w-4" />
            Manage Admins
          </Link>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button onClick={handleLogout} variant="destructive" size="sm" className="ml-4">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  )
}

