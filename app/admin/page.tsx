import { getServerSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import AdminDashboardContent from "./dashboard-content"

export const metadata: Metadata = {
  title: "Admin Dashboard - Quranic Seminar",
  description: "Admin dashboard for managing the Quranic Seminar registrations, abstracts, and messages",
}

export default async function AdminDashboard() {
  // Check authentication on the server
  const user = await getServerSession()

  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }

  // Serialize the user object to a plain object
  const serializedUser = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    created_at: user.created_at?.toISOString()
  }

  return <AdminDashboardContent user={serializedUser} />
}