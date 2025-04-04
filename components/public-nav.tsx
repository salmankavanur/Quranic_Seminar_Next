"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export function PublicNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-medium text-emerald-500">
          Quranic Seminar
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
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link href="/" className={pathname === "/" ? "font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
            Home
          </Link>
          <Link href="/about" className={pathname === "/about" ? "font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
            About
          </Link>
          <Link href="/register" className={pathname === "/register" ? "font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
            Register
          </Link>
          <Link href="/submit" className={pathname.startsWith("/submit") ? "font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
            Submit Abstract
          </Link>
          <Link href="/certificates" className={pathname === "/certificates" ? "font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
            Certificates
          </Link>
          <Link href="/contact" className={pathname === "/contact" ? "font-medium" : "text-muted-foreground hover:text-foreground transition-colors"}>
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 space-y-4">
              <Link 
                href="/" 
                className={`block py-2 ${pathname === "/" ? "font-medium" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`block py-2 ${pathname === "/about" ? "font-medium" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/register" 
                className={`block py-2 ${pathname === "/register" ? "font-medium" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link 
                href="/submit" 
                className={`block py-2 ${pathname.startsWith("/submit") ? "font-medium" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Abstract
              </Link>
              <Link 
                href="/certificates" 
                className={`block py-2 ${pathname === "/certificates" ? "font-medium" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Certificates
              </Link>
              <Link 
                href="/contact" 
                className={`block py-2 ${pathname === "/contact" ? "font-medium" : "text-muted-foreground"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
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
                <Button asChild variant="warning" size="sm" className="flex-1">
                  <Link href="/admin">Admin</Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

