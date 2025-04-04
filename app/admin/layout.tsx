import type React from "react"
import { AdminNav } from "@/components/admin-nav"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if we're on the login page
  const isLoginPage = cookies().get("__pathname")?.value === "/admin/login"

  // If we're on the login page, don't show the admin nav
  if (isLoginPage) {
    return <>{children}</>
  }

  // Check if user is authenticated by checking for session cookie
  const sessionCookie = cookies().get("session_id")

  if (!sessionCookie) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}

