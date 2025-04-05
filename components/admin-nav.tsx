"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, MessageSquare, UserCog, LogOut, Moon, Sun, Menu, X, BarChart2 } from "lucide-react"
import { useTheme } from "next-themes"
import { logoutAction } from "@/app/actions/auth-actions"
import { useState } from "react"

export function AdminNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutAction()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const menuItems = [
    {
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard"
    },
    {
      href: "/admin/registrations",
      icon: <Users className="h-4 w-4" />,
      label: "Registrations"
    },
    {
      href: "/admin/analytics",
      icon: <BarChart2 className="h-4 w-4" />,
      label: "Analytics"
    },
    {
      href: "/admin/submissions",
      icon: <FileText className="h-4 w-4" />,
      label: "Submissions"
    },
    {
      href: "/admin/messages",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Messages"
    },
    {
      href: "/admin/manage-admins",
      icon: <UserCog className="h-4 w-4" />,
      label: "Manage Admins"
    }
  ]

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin" className="text-lg sm:text-xl font-medium text-emerald-500">
          Quranic Seminar Admin
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "font-medium flex items-center gap-1"
                  : "text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
              }
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 py-2 ${
                    pathname === item.href
                      ? "font-medium"
                      : "text-muted-foreground hover:text-foreground transition-colors"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>

                <Button onClick={handleLogout} variant="destructive" size="sm" className="flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

